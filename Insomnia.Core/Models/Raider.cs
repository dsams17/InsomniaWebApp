namespace Insomnia.Core.Models
{
    public class Raider
    {
        public string Name { get; set; }
        public string CharacterClass { get; set; }
        public double Dkp { get; set; }
        public DkpItem[] DkpItems { get; set; }
    }
}
