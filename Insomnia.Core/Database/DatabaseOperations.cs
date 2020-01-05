using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Insomnia.Core.Models;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace Insomnia.Core.Database
{
    public class DatabaseOperations : IDatabaseOperations
    {
        private readonly CloudTableClient _client;

        public DatabaseOperations(IConnectionConfig connection)
        {
            var account = CloudStorageAccount.Parse(connection.ConnectionString);

            _client = account.CreateCloudTableClient();
        }

        public async Task<TableResult> Insert <T>(string tableName, T entity) where T : ITableEntity
        {
            var table = _client.GetTableReference(tableName);

            var insertOperation = TableOperation.Insert(entity);

            return await table.ExecuteAsync(insertOperation);
        }

        public async Task<TableResult> Delete(string tableName, RaiderEntity raider)
        {
            var table = _client.GetTableReference(tableName);

            var deleteOperation = TableOperation.Delete(raider);

            return await table.ExecuteAsync(deleteOperation);
        }

        public async Task<TableResult> Select<T>(string tableName, string partitionKey, string rowKey) where T : ITableEntity
        {
            var table = _client.GetTableReference(tableName);

            var retrieveOperation = TableOperation.Retrieve<T>(partitionKey, rowKey);

            return await table.ExecuteAsync(retrieveOperation);
        }

        public async Task<IEnumerable<T>> SelectPartition<T>(string tableName, string partition) where T : ITableEntity, new()
        {
            var table = _client.GetTableReference(tableName);

            var seg = await table.ExecuteQuerySegmentedAsync(new TableQuery<T>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partition)), null);

            return seg.Results;
        }

        public async Task<IEnumerable<T>> SelectAll<T>(string tableName) where T : ITableEntity, new()
        {
            var table = _client.GetTableReference(tableName);

            var seg = await table.ExecuteQuerySegmentedAsync(new TableQuery<T>(), null);

            return seg.Results;
        }


        public async Task<TableResult> Update(string tableName, RaiderEntity raider)
        {
            var table = _client.GetTableReference(tableName);

            var updateOperation = TableOperation.Merge(raider);

            return await table.ExecuteAsync(updateOperation);
        }

        public async Task<IEnumerable<T>> UpdateMany<T>(string tableName, IEnumerable<T> entities) where T : class, ITableEntity, new()
        {
            var table = _client.GetTableReference(tableName);

            var tasks = entities.Select(x => table.ExecuteAsync(TableOperation.Merge(x)));

            var results = await Task.WhenAll(tasks);

            return results.Select(x => x.Result as T);
        }
    }
}
