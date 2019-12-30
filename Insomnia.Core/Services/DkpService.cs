using System.Linq;
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
        public async Task<Raider> InsertRaider(RaiderEntity raider)
        {
            var result = await _database.Insert("Raider", raider);

            var entity = (RaiderEntity)result.Result;

            return new Raider
            {
                CharacterClass = entity.PartitionKey,
                Dkp = entity.Dkp,
                Name = entity.RowKey
            };
        }

        public async Task<Raider[]> GetRaiders()
        {
            var result = await _database.SelectAll("Raider");

            return result.Select(x => new Raider
            {
                CharacterClass = x.PartitionKey,
                Dkp = x.Dkp,
                Name = x.RowKey
            }).ToArray();
        }
    }
}
