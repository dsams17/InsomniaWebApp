using System.Threading.Tasks;
using Insomnia.Core.Models;
using Insomnia.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        [Authorize]
        [HttpPost]
        public async Task<Raider> AddRaider([FromBody] Raider raider)
        {
            var entity = new RaiderEntity(raider.Name, raider.CharacterClass, raider.Dkp);

            return await _raiderService.InsertRaider(entity);
        }

        [Authorize]
        [HttpPost]
        [Route("multiple/decay")]
        public async Task<Raider[]> DecayRaiders([FromBody] decimal percentage)
        {
            return await _raiderService.DecayRaiders(percentage);
        }

        [Authorize]
        [HttpPost]
        [Route("givedkp")]
        public async Task<Raider[]> AddDkp([FromBody] AddDkpToRaiders raidersAndDkp)
        {
            return await _raiderService.AddDkpToRaiders(raidersAndDkp);
        }

        [Authorize]
        [HttpPost]
        [Route("item")]
        public async Task<Raider> AddItem([FromBody] DkpItem item)
        {
            return await _itemService.InsertItem(item);
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
