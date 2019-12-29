using System.Threading.Tasks;
using Insomnia.Core.Database;
using Insomnia.Core.Models;

namespace Insomnia.Core.Services
{
    public class DkpService : IDkpService
    {
        private readonly IDatabaseOperations _database;

        public DkpService(IDatabaseOperations database)
        {
            _database = database;
        }
        public async Task<RaiderEntity> InsertRaider(RaiderEntity raider)
        {
            var result = await _database.Insert("Raider", raider);

            return (RaiderEntity)result.Result;
        }
    }
}
