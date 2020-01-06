using System.Threading.Tasks;
using Insomnia.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Insomnia.Core.Services
{
    public interface IAuthenticateService
    {
        public Task<ActionResult> AuthenticateUser(AuthUser user, HttpContext context);
    }
}
