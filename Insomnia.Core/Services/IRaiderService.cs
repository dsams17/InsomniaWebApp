using System.Threading.Tasks;
using Insomnia.Core.Models;

namespace Insomnia.Core.Services
{
    public interface IRaiderService
    {
        Task<Raider> InsertRaider(RaiderEntity raider, string user);
        Task<Raider[]> GetRaiders();
        Task<Raider[]> DecayRaiders(double percentage, string user);
        Task<Raider[]> AddDkpToRaiders(AddDkpToRaiders raidersAndDkp, string user);
        Task<Raider> GetRaider(string characterClass, string name);
    }
}
