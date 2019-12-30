using System.Threading.Tasks;
using Insomnia.Core.Models;
using Insomnia.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Insomnia.Core.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DkpController : ControllerBase
    {
        private readonly ILogger<DkpController> _logger;
        private readonly IDkpService _dkpService;

        public DkpController(ILogger<DkpController> logger, IDkpService dkpService)
        {
            _logger = logger;
            _dkpService = dkpService;
        }

        [HttpGet]
        public ActionResult Get()
        {
            return Ok("Success");
        }

        [HttpPost]
        public async Task<Raider> Post([FromBody] Raider raider)
        {
            var entity = new RaiderEntity(raider.Name, raider.CharacterClass.ToString(), raider.Dkp);

            return await _dkpService.InsertRaider(entity);
        }

        [HttpGet]
        [Route("multiple")]
        public async Task<ActionResult<Raider[]>> GetAll()
        {
            var content = await _dkpService.GetRaiders();

            return new JsonResult(content);
        }
    }
}
