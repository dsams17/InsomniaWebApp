using System.Linq;
using System.Threading.Tasks;
using Insomnia.Core.Database;
using Insomnia.Core.Models;

namespace Insomnia.Core.Services
{
    public class RaiderService : IRaiderService
    {
        private readonly IDatabaseOperations _database;

        public RaiderService(IDatabaseOperations database)
        {
            _database = database;
        }
        public async Task<Raider> InsertRaider(RaiderEntity raider)
        {
            var result = await _database.Insert<RaiderEntity>("Raider", raider);

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
            var result = await _database.SelectAll<RaiderEntity>("Raider");

            return result.Select(x => new Raider
            {
                CharacterClass = x.PartitionKey,
                Dkp = x.Dkp,
                Name = x.RowKey
            }).ToArray();
        }

        public async Task<Raider> GetRaider(string characterClass, string name)
        {
            var raiderEntity = await _database.Select<RaiderEntity>("Raider", characterClass, name);
            var itemsEntity = await _database.SelectPartition<DkpItemEntity>("Item", name);

            var items = itemsEntity.Select(x => new DkpItem
            {
                DkpCost = x.DkpCost,
                DateAcquired = x.DateAcquired,
                ItemName = x.ItemName
            }).ToArray();

            var res = (RaiderEntity) raiderEntity.Result;

            return new Raider
            {
                Name = res.RowKey,
                CharacterClass = res.PartitionKey,
                Dkp = res.Dkp,
                DkpItems = items
            };
        }
    }
}
