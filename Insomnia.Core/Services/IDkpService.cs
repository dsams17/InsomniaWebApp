using System.Threading.Tasks;
using Insomnia.Core.Models;

namespace Insomnia.Core.Services
{
    public interface IDkpService
    {
        Task<RaiderEntity> InsertRaider(RaiderEntity raider);
    }
}
