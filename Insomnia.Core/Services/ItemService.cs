using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Insomnia.Core.Database;
using Insomnia.Core.Models;
using Microsoft.Extensions.Caching.Memory;

namespace Insomnia.Core.Services
{
    public class ItemService : IItemService
    {
        private readonly IDatabaseOperations _database;
        private readonly IMemoryCache _cache;

        public ItemService(IDatabaseOperations database, IMemoryCache cache)
        {
            _database = database;
            _cache = cache;
        }
        public async Task<Raider> InsertItem(DkpItem item)
        {
            var raider = item.Raider;

            var itemEntity = new DkpItemEntity(raider.Name, item.DkpCost, item.ItemName, DateTime.Now);

            await _database.Insert("Item", itemEntity);

            //Get raider for this item
            var raiderOp = await _database.Select<RaiderEntity>("Raider", raider.CharacterClass, raider.Name);
            var raiderEntity = (RaiderEntity) raiderOp.Result;

            //Subtract item's DKP cost from Raider's DKP total
            raiderEntity.Dkp -= item.DkpCost;
            raiderOp = await _database.Update("Raider", raiderEntity);
            raiderEntity = (RaiderEntity) raiderOp.Result;

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
    }
}
