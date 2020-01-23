using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace Insomnia.Core.Models
{
    public class ChangeEntity : TableEntity
    {
        public ChangeEntity(string adminUser, string description, DateTime changeTime)
        {
            PartitionKey = adminUser;
            RowKey = Guid.NewGuid().ToString("N");
            Description = description;
            ChangeTime = changeTime;
        }

        public ChangeEntity()
        {
        }

        public string Description { get; set; }
        public DateTime ChangeTime { get; set; }
    }
}