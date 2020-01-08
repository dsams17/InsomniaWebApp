using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace Insomnia.Core.Models
{
    public class DkpItemEntity : TableEntity
    {
        public DkpItemEntity(string raiderName, decimal dkpCost, string itemName, DateTime dateAcquired)
        {
            PartitionKey = raiderName;
            RowKey = Guid.NewGuid().ToString("N");
            DkpCost = dkpCost;
            ItemName = itemName;
            DateAcquired = dateAcquired;
        }

        public DkpItemEntity()
        {
        }

        public decimal DkpCost { get; set; }
        public string ItemName { get; set; }
        public DateTime DateAcquired { get; set; }
    }
}
