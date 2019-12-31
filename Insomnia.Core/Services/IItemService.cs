using System.Threading.Tasks;
using Insomnia.Core.Models;

namespace Insomnia.Core.Services
{
    public interface IItemService
    {
        Task<DkpItem> InsertItem(DkpItemEntity item);
        //Task<Raider[]> GetRaiders();
        //Task<Raider> GetRaider(string characterClass, string name);
    }
}
