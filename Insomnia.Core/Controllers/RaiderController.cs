using System.Threading.Tasks;
using Insomnia.Core.Models;
using Insomnia.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Insomnia.Core.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RaiderController : ControllerBase
    {
        private readonly IItemService _itemService;
        private readonly IRaiderService _raiderService;
        private readonly IMemoryCache _cache;

        public RaiderController(IItemService itemService, IRaiderService raiderService, IMemoryCache cache)
        {
            _itemService = itemService;
            _raiderService = raiderService;
            _cache = cache;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Raider>> AddRaider([FromBody] Raider raider)
        {
            var user = HttpContext.Request.Headers["adminUser"];

            if (string.IsNullOrWhiteSpace(user)) return new BadRequestObjectResult("User must be logged in to do this action.");
            if (string.IsNullOrWhiteSpace(raider.Name) || string.IsNullOrWhiteSpace(raider.CharacterClass) || raider.Dkp < 0) return new BadRequestResult();

            var entity = new RaiderEntity(raider.Name, raider.CharacterClass, raider.Dkp);

            return await _raiderService.InsertRaider(entity, user);
        }

        [Authorize]
        [HttpPost]
        [Route("multiple/decay")]
        public async Task<ActionResult<Raider[]>> DecayRaiders([FromBody] double percentage)
        {
            var user = HttpContext.Request.Headers["adminUser"];

            if (string.IsNullOrWhiteSpace(user)) return new BadRequestObjectResult("User must be logged in to do this action.");
            if (percentage <= 0) return new NoContentResult();

            return await _raiderService.DecayRaiders(percentage, user);
        }

        [Authorize]
        [HttpPost]
        [Route("givedkp")]
        public async Task<ActionResult<Raider[]>> AddDkp([FromBody] AddDkpToRaiders raidersAndDkp)
        {
            var user = HttpContext.Request.Headers["adminUser"];

            if (string.IsNullOrWhiteSpace(user)) return new BadRequestObjectResult("User must be logged in to do this action.");
            if (raidersAndDkp.Raiders == null) return new BadRequestResult();
            if (raidersAndDkp.Raiders.Length == 0) return new NoContentResult();

            return await _raiderService.AddDkpToRaiders(raidersAndDkp, user);
        }

        [Authorize]
        [HttpPost]
        [Route("item")]
        public async Task<ActionResult<Raider>> AddItem([FromBody] DkpItem item)
        {
            var user = HttpContext.Request.Headers["adminUser"];

            if (string.IsNullOrWhiteSpace(user)) return new BadRequestObjectResult("User must be logged in to do this action.");
            if (string.IsNullOrWhiteSpace(item.ItemName) || item.DkpCost < 0 || item.Raider == null || string.IsNullOrWhiteSpace(item.Raider.Name)) return new BadRequestResult();

            return await _itemService.InsertItem(item, user);
        }

        [HttpGet]
        public async Task<ActionResult<Raider>> Get([FromQuery] string characterClass, [FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(characterClass) || string.IsNullOrWhiteSpace(name)) return new BadRequestResult();

            var content = await _raiderService.GetRaider(characterClass, name);

            return new JsonResult(content);
        }

        [HttpGet]
        [Route("multiple")]
        public async Task<ActionResult<Raider[]>> GetAll()
        {
            return new JsonResult(await _raiderService.GetRaiders());
        }

        [HttpGet]
        [Route("item")]
        public async Task<ActionResult<DkpItem[]>> GetAllItems()
        {
            return new JsonResult(await _itemService.GetAllItems());
        }

        [Authorize]
        [HttpGet]
        [Route("invalidatecache")]
        public async Task<ActionResult> InvalidateAllCache()
        {
            _cache.Remove("ALL");

            return await Task.FromResult(new OkResult());
        }
    }
}
