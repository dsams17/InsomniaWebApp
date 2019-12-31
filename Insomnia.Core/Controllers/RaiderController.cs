using System;
using System.Threading.Tasks;
using Insomnia.Core.Models;
using Insomnia.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Insomnia.Core.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RaiderController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly IItemService _itemService;
        private readonly IRaiderService _raiderService;

        public RaiderController(IMemoryCache cache, IItemService itemService, IRaiderService raiderService)
        {
            _cache = cache;
            _itemService = itemService;
            _raiderService = raiderService;
        }

        [HttpPost]
        public async Task<Raider> Post([FromBody] Raider raider)
        {
            var entity = new RaiderEntity(raider.Name, raider.CharacterClass, raider.Dkp);

            _cache.Remove("ALL");

            return await _raiderService.InsertRaider(entity);
        }

        [HttpPost]
        [Route("item")]
        public async Task<DkpItem> Post([FromBody] DkpItem item)
        {
            var entity = new DkpItemEntity("Xede", item.DkpCost, item.ItemName, item.DateAcquired);

            return await _itemService.InsertItem(entity);
        }

        [HttpGet]
        public async Task<ActionResult<Raider>> Get([FromQuery] string characterClass, [FromQuery] string name)
        {
            var content = await _raiderService.GetRaider(characterClass, name);

            return new JsonResult(content);
        }

        [HttpGet]
        [Route("multiple")]
        public async Task<ActionResult<Raider[]>> GetAll()
        {
            
            // Look for cache key.
            if (!_cache.TryGetValue("ALL", out var cacheEntry))
            {
                // Key not in cache, so get data.
                cacheEntry = await _raiderService.GetRaiders();

                // Set cache options.
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);

                // Save data in cache.
                _cache.Set("ALL", cacheEntry, cacheEntryOptions.GetValueOrDefault(new TimeSpan(0, 10, 0)));
            }

            return new JsonResult(cacheEntry);
        }
    }
}
