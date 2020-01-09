﻿using System.Threading.Tasks;
using Insomnia.Core.Models;

namespace Insomnia.Core.Services
{
    public interface IRaiderService
    {
        Task<Raider> InsertRaider(RaiderEntity raider);
        Task<Raider[]> GetRaiders();
        Task<Raider[]> DecayRaiders(double percentage);
        Task<Raider[]> AddDkpToRaiders(AddDkpToRaiders raidersAndDkp);
        Task<Raider> GetRaider(string characterClass, string name);
    }
}
