using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Insomnia.Core.Database;
using Insomnia.Core.Models;
using Microsoft.Extensions.Caching.Memory;

namespace Insomnia.Core.Services
{
    public class RaiderService : IRaiderService
    {
        private readonly IDatabaseOperations _database;
        private readonly IMemoryCache _cache;

        public RaiderService(IDatabaseOperations database, IMemoryCache cache)
        {
            _database = database;
            _cache = cache;
        }
        public async Task<Raider> InsertRaider(RaiderEntity raider, string user)
        {
            var addResult = await _database.Insert("Raider", raider);

            var changeLog = new ChangeEntity(user, $"Added raider {raider.RowKey} of class {raider.PartitionKey} with {raider.Dkp} DKP", DateTime.Now);
            await _database.Insert("Change", changeLog);

            var entity = (RaiderEntity)addResult.Result;

            var newRaider = new Raider
            {
                CharacterClass = entity.PartitionKey,
                Dkp = entity.Dkp,
                Name = entity.RowKey
            };

            
            // Key not in cache, so get data.
            var cacheEntry = await _database.SelectAll<RaiderEntity>("Raider");

            // Set cache options.
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);

            // Save data in cache.
            _cache.Set("ALL", cacheEntry, cacheEntryOptions.GetValueOrDefault(new TimeSpan(0, 1, 0)));



            return newRaider;
        }

        public async Task<Raider[]> DecayRaiders(double percentage, string user)
        {
            // Look for cache key.
            if (!_cache.TryGetValue("ALL", out IEnumerable<RaiderEntity> allRaiders))
            {
                // Key not in cache, so get data.
                allRaiders = await _database.SelectAll<RaiderEntity>("Raider");
            }

            foreach (var raider in allRaiders)
            {
                if (raider.Dkp < 1) continue;

                var dkp = raider.Dkp * percentage;
                raider.Dkp = Math.Truncate(dkp * 100) / 100;
            }

            var cacheEntry = await _database.UpdateMany<RaiderEntity>("Raider", allRaiders);

            var changeLog = new ChangeEntity(user, $"Decayed all raiders by {percentage}", DateTime.Now);
            await _database.Insert("Change", changeLog);

            // Set cache options.
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);

            // Save data in cache.
            _cache.Set("ALL", cacheEntry, cacheEntryOptions.GetValueOrDefault(new TimeSpan(0, 1, 0)));

            return cacheEntry.Select(x => new Raider
            {
                CharacterClass = x.PartitionKey,
                Dkp = x.Dkp,
                Name = x.RowKey
            }).ToArray();
        }

        public async Task<Raider[]> AddDkpToRaiders(AddDkpToRaiders raidersAndDkp, string user)
        {
            var add = raidersAndDkp.DkpToAdd;
            var dict = raidersAndDkp.Raiders.ToDictionary(raider => raider.Name);

            // Look for cache key.
            if (!_cache.TryGetValue("ALL", out IEnumerable<RaiderEntity> allRaiders))
            {
                // Key not in cache, so get data.
                allRaiders = await _database.SelectAll<RaiderEntity>("Raider");
            }

            foreach (var raider in allRaiders)
            {
                if (dict.TryGetValue(raider.RowKey, out var _))
                {
                    raider.Dkp += add;
                }
            }

            var cacheEntry = await _database.UpdateMany<RaiderEntity>("Raider", allRaiders);

            var raiderNames = raidersAndDkp.Raiders.Aggregate("", (res, raider) => res += $"{raider.Name}, ", total => total.Trim().TrimEnd(','));

            var changeLog = new ChangeEntity(user, $"Added {raidersAndDkp.DkpToAdd} DKP to raiders {raiderNames}", DateTime.Now);
            await _database.Insert("Change", changeLog);

            // Set cache options.
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);

            // Save data in cache.
            _cache.Set("ALL", cacheEntry, cacheEntryOptions.GetValueOrDefault(new TimeSpan(0, 1, 0)));

            return cacheEntry.Select(x => new Raider
            {
                CharacterClass = x.PartitionKey,
                Dkp = x.Dkp,
                Name = x.RowKey
            }).ToArray();
        }

        public async Task<Raider[]> GetRaiders()
        {

            // Look for cache key.
            if (!_cache.TryGetValue("ALL", out IEnumerable<RaiderEntity> cacheEntry))
            {
                // Key not in cache, so get data.
                cacheEntry = await _database.SelectAll<RaiderEntity>("Raider");

                // Set cache options.
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);

                // Save data in cache.
                _cache.Set("ALL", cacheEntry, cacheEntryOptions.GetValueOrDefault(new TimeSpan(0, 1, 0)));
            }

            return cacheEntry.Select(x => new Raider
            {
                CharacterClass = x.PartitionKey,
                Dkp = x.Dkp,
                Name = x.RowKey
            }).ToArray();
        }

        public async Task<Raider> GetRaider(string characterClass, string name)
        {
            var raiderEntity = await _database.Select<RaiderEntity>("Raider", characterClass, name);
            var itemsEntity = await _database.SelectPartition<DkpItemEntity>("Item", name);

            var items = itemsEntity.Select(x => new DkpItem
            {
                DkpCost = x.DkpCost,
                DateAcquired = x.DateAcquired,
                ItemName = x.ItemName
            }).ToArray();

            var res = (RaiderEntity) raiderEntity.Result;

            return new Raider
            {
                Name = res.RowKey,
                CharacterClass = res.PartitionKey,
                Dkp = res.Dkp,
                DkpItems = items
            };
        }
    }
}
