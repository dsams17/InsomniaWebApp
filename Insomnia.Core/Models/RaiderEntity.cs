using Microsoft.WindowsAzure.Storage.Table;

namespace Insomnia.Core.Models
{
    public class RaiderEntity : TableEntity
    {
        public RaiderEntity(string name, string raiderClass, int dkp)
        {
            PartitionKey = raiderClass;
            RowKey = name;
            Dkp = dkp;
        }

        public RaiderEntity()
        {
        }

        public int Dkp { get; set; }
    }
}
