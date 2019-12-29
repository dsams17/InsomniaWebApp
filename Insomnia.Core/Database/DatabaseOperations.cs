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

        public async Task<TableResult> Insert(string tableName, RaiderEntity raider)
        {
            var table = _client.GetTableReference(tableName);

            var insertOperation = TableOperation.Insert(raider);

            return await table.ExecuteAsync(insertOperation);
        }

        public async Task<TableResult> Delete(string tableName, RaiderEntity raider)
        {
            var table = _client.GetTableReference(tableName);

            var deleteOperation = TableOperation.Delete(raider);

            return await table.ExecuteAsync(deleteOperation);
        }

        public async Task<TableResult> Select(string tableName, RaiderEntity raider)
        {
            var table = _client.GetTableReference(tableName);

            var retrieveOperation = TableOperation.Retrieve<RaiderEntity>(raider.PartitionKey, raider.RowKey);

            return await table.ExecuteAsync(retrieveOperation);
        }

        public async Task<IEnumerable<RaiderEntity>> SelectAll(string tableName)
        {
            var table = _client.GetTableReference(tableName);

            var seg = await table.ExecuteQuerySegmentedAsync(new TableQuery<RaiderEntity>(), null);

            return seg.Results;
        }

        public async Task<TableResult> Update(string tableName, RaiderEntity raider)
        {
            var table = _client.GetTableReference(tableName);

            var updateOperation = TableOperation.Merge(raider);

            return await table.ExecuteAsync(updateOperation);
        }

        public async Task<TableResult[]> UpdateMany(string tableName, IEnumerable<RaiderEntity> raiders)
        {
            var table = _client.GetTableReference(tableName);

            var tasks = raiders.Select(x => table.ExecuteAsync(TableOperation.Merge(x)));

            return await Task.WhenAll(tasks);
        }
    }
}
