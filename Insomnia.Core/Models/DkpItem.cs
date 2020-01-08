﻿using System;

namespace Insomnia.Core.Models
{
    public class DkpItem
    {
        public Raider Raider { get; set; }
        public decimal DkpCost { get; set; }
        public string ItemName { get; set; }
        public DateTime DateAcquired { get; set; }
    }
}
