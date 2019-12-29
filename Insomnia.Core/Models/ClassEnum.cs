using Insomnia.Core.Util;
using Newtonsoft.Json;

namespace Insomnia.Core.Models
{
    [JsonConverter(typeof(ClassEnumJsonConverter))]
    public enum ClassEnum
    {
        Pleb = 0,
        Warrior,
        Mage,
        Rogue,
        Druid,
        Paladin,
        Warlock,
        Priest,
        Hunter,
        Shaman
    }
}
