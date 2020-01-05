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
        private readonly IItemService _itemService;
        private readonly IRaiderService _raiderService;

        public RaiderController(IItemService itemService, IRaiderService raiderService)
        {
            _itemService = itemService;
            _raiderService = raiderService;
        }

        [HttpPost]
        public async Task<Raider> Post([FromBody] Raider raider)
        {
            var entity = new RaiderEntity(raider.Name, raider.CharacterClass, raider.Dkp);

            return await _raiderService.InsertRaider(entity);
        }

        [HttpPost]
        [Route("multiple/decay")]
        public async Task<Raider[]> Post([FromBody] decimal percentage)
        {
            return await _raiderService.DecayRaiders(percentage);
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
            return new JsonResult(await _raiderService.GetRaiders());
        }
    }
}
