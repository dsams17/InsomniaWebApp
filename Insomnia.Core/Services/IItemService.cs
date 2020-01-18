using System.Threading.Tasks;
using Insomnia.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace Insomnia.Core.Services
{
    public interface IItemService
    {
        Task<Raider> InsertItem(DkpItem item);
        Task<DkpItem[]> GetAllItems();
    }
}
