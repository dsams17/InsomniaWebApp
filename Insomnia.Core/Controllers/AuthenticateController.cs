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
    public class AuthenticateController : ControllerBase
    {
        private readonly IItemService _itemService;
        private readonly IRaiderService _raiderService;
        private readonly IAuthenticateService _authenticateService;

        public AuthenticateController(IItemService itemService, IRaiderService raiderService, IAuthenticateService authenticateService)
        {
            _itemService = itemService;
            _raiderService = raiderService;
            _authenticateService = authenticateService;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] AuthUser user)
        {
            return await _authenticateService.AuthenticateUser(user, HttpContext);
        }
    }
}
