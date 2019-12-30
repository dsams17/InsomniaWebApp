export class Raider {
  characterClass: string;
  name: string;
  dkp: number;

  constructor(characterClass: string, name: string, dkp: number) {
    this.characterClass = characterClass;
    this.name = name;
    this.dkp = dkp;
  }
}
