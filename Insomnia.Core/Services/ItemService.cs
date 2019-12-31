using System;
using System.Linq;
using System.Threading.Tasks;
using Insomnia.Core.Database;
using Insomnia.Core.Models;

namespace Insomnia.Core.Services
{
    public class ItemService : IItemService
    {
        private readonly IDatabaseOperations _database;

        public ItemService(IDatabaseOperations database)
        {
            _database = database;
        }
        public async Task<DkpItem> InsertItem(DkpItemEntity item)
        {
            var result = await _database.Insert<DkpItemEntity>("Item", item);

            var entity = (DkpItemEntity)result.Result;

            return new DkpItem
            {
                ItemName = entity.ItemName,
                DateAcquired = DateTime.Now,
                DkpCost = entity.DkpCost
            };
        }
    }
}
