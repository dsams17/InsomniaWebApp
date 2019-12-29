using System.Collections.Generic;
using System.Threading.Tasks;
using Insomnia.Core.Models;
using Microsoft.WindowsAzure.Storage.Table;

namespace Insomnia.Core.Database
{
    public interface IDatabaseOperations
    {
        Task<TableResult> Insert(string table, RaiderEntity raider);
        Task<TableResult> Delete(string table, RaiderEntity raider);
        Task<TableResult> Select(string table, RaiderEntity raider);
        Task<IEnumerable<RaiderEntity>> SelectAll(string table);
        Task<TableResult> Update(string table, RaiderEntity raider);
        Task<TableResult[]> UpdateMany(string table, IEnumerable<RaiderEntity> raiders);

    }
}
