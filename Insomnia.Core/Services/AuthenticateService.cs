using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Insomnia.Core.Database;
using Insomnia.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.WindowsAzure.Storage.Table;

namespace Insomnia.Core.Services
{
    public class AuthenticateService : IAuthenticateService
    {
        private readonly IDatabaseOperations _database;

        public AuthenticateService(IDatabaseOperations database)
        {
            _database = database;
        }

        public async Task<ActionResult> AuthenticateUser(AuthUser user, HttpContext context)
        {
            if (await LoginUser(user.UserName, user.Password))
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName)
                };

                var userIdentity = new ClaimsIdentity(claims, "login");

                ClaimsPrincipal principal = new ClaimsPrincipal(userIdentity);
                await context.SignInAsync(principal);

                return new OkObjectResult(new AuthUser
                {
                    UserName = user.UserName
                });
            }

            return new UnauthorizedResult();
        }

        private async Task<bool> LoginUser(string user, string password)
        {
            var passwordHash = ComputeSha256Hash(password);

            var result = await _database.Select<TableEntity>("Auth", user, passwordHash);

            return IsSuccessStatusCode(result.HttpStatusCode);
        }

        private static string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        private static bool IsSuccessStatusCode(int code)
        {
            return 199 < code && code < 300;
        }
    }
}
