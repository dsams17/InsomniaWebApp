using System.Collections.Generic;
using System.Threading.Tasks;
using Insomnia.Core.Models;
using Microsoft.WindowsAzure.Storage.Table;

namespace Insomnia.Core.Database
{
    public interface IDatabaseOperations
    {
        Task<TableResult> Insert<T>(string table, T entity) where T : ITableEntity;
        Task<TableResult> Delete(string table, RaiderEntity raider);
        Task<TableResult> Select<T>(string table, string partitionKey, string rowKey) where T : ITableEntity;
        Task<IEnumerable<RaiderEntity>> SelectAll(string table);
        Task<TableResult> Update(string table, RaiderEntity raider);
        Task<TableResult[]> UpdateMany(string table, IEnumerable<RaiderEntity> raiders);

    }
}
