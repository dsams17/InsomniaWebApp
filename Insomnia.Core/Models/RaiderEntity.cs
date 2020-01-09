using Microsoft.WindowsAzure.Storage.Table;

namespace Insomnia.Core.Models
{
    public class RaiderEntity : TableEntity
    {
        public RaiderEntity(string name, string raiderClass, double dkp)
        {
            PartitionKey = raiderClass;
            RowKey = name;
            Dkp = dkp;
        }

        public RaiderEntity()
        {
        }

        public double Dkp { get; set; }
    }
}
