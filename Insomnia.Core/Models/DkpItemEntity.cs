using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace Insomnia.Core.Models
{
    public class DkpItemEntity : TableEntity
    {
        public DkpItemEntity(string name, string raiderClass, int dkpCost, string itemName, DateTime dateAcquired)
        {
            PartitionKey = raiderClass;
            RowKey = name;
            DkpCost = dkpCost;
            ItemName = ItemName;
            DateAcquired = dateAcquired;
        }

        public DkpItemEntity()
        {
        }

        public int DkpCost { get; set; }
        public string ItemName { get; set; }
        public DateTime DateAcquired { get; set; }
    }
}
