using System.Threading.Tasks;
using Insomnia.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace Insomnia.Core.Services
{
    public interface IItemService
    {
        Task<Raider> InsertItem(DkpItem item, string user);
        Task<DkpItem[]> GetAllItems();
    }
}
