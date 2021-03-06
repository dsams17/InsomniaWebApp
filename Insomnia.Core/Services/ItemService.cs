﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Insomnia.Core.Database;
using Insomnia.Core.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Insomnia.Core.Services
{
    public class ItemService : IItemService
    {
        private readonly IDatabaseOperations _database;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ItemService> _logger;

        public ItemService(IDatabaseOperations database, IMemoryCache cache, ILogger<ItemService> logger)
        {
            _database = database;
            _cache = cache;
            _logger = logger;
        }
        public async Task<Raider> InsertItem(DkpItem item, string user)
        {
            try
            {
                var raider = item.Raider;

                var utcTime = DateTime.UtcNow;

                var itemEntity = new DkpItemEntity(raider.Name, item.DkpCost, item.ItemName, utcTime);

                await _database.Insert("Item", itemEntity);

                var changeLog = new ChangeEntity(user, $"Gave {item.ItemName} to {item.Raider.Name} for {item.DkpCost} DKP", utcTime);
                await _database.Insert("Change", changeLog);

                //Get raider for this item
                var raiderOp = await _database.Select<RaiderEntity>("Raider", raider.CharacterClass, raider.Name);
                var raiderEntity = (RaiderEntity)raiderOp.Result;

                //Subtract item's DKP cost from Raider's DKP total
                raiderEntity.Dkp -= item.DkpCost;
                raiderOp = await _database.Update("Raider", raiderEntity);
                raiderEntity = (RaiderEntity)raiderOp.Result;

                // Look for cache key.
                if (!_cache.TryGetValue("ALL", out IEnumerable<RaiderEntity> allRaiders))
                {
                    // Key not in cache, so get data.
                    allRaiders = await _database.SelectAll<RaiderEntity>("Raider");
                }

                foreach (var chosenRaider in allRaiders)
                {
                    if (chosenRaider.RowKey.Equals(raiderEntity.RowKey))
                    {
                        chosenRaider.Dkp = raiderEntity.Dkp;
                        break;
                    }
                }

                // Set cache options.
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);

                // Save data in cache.
                _cache.Set("ALL", allRaiders, cacheEntryOptions.GetValueOrDefault(new TimeSpan(0, 1, 0)));

                return new Raider
                {
                    Name = raiderEntity.RowKey,
                    Dkp = raiderEntity.Dkp,
                    CharacterClass = raiderEntity.PartitionKey
                };
            }
            catch (Exception e)
            {
                _logger.LogWarning(e, "Call to database failed");

                return null;
            }
        }

        public async Task<DkpItem[]> GetAllItems()
        {
            // Look for cache key.
            if (!_cache.TryGetValue("ALLITEM", out DkpItem[] allItems))
            {
                var allItemsEntities = await _database.SelectAll<DkpItemEntity>("Item");

                allItems = allItemsEntities.Select(x => new DkpItem
                {
                    DateAcquired = x.DateAcquired,
                    DkpCost = x.DkpCost,
                    ItemName = x.ItemName,
                    Raider = new Raider
                    {
                        Name = x.PartitionKey
                    }
                }).ToArray();
            }

            // Set cache options.
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);

            // Save data in cache.
            _cache.Set("ALLITEM", allItems, cacheEntryOptions.GetValueOrDefault(new TimeSpan(0, 1, 0)));

            return allItems;
        }
    }
}
