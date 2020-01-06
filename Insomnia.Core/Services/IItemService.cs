using System.Threading.Tasks;
using Insomnia.Core.Models;

namespace Insomnia.Core.Services
{
    public interface IItemService
    {
        Task<Raider> InsertItem(DkpItem item);
    }
}
