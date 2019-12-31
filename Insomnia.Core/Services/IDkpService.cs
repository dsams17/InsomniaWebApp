using System.Threading.Tasks;
using Insomnia.Core.Models;

namespace Insomnia.Core.Services
{
    public interface IDkpService
    {
        Task<Raider> InsertRaider(RaiderEntity raider);
        Task<Raider[]> GetRaiders();
        Task<Raider> GetRaider(string characterClass, string name);
    }
}
