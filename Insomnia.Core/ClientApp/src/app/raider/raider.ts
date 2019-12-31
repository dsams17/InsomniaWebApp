import { DkpItem } from "./dkp-item";

export class Raider {
  characterClass: string;
  name: string;
  dkp: number;
  dkpItems: DkpItem[];

  constructor(characterClass: string, name: string, dkp: number, dkpItems: DkpItem[]) {
    this.characterClass = characterClass;
    this.name = name;
    this.dkp = dkp;
    this.dkpItems = dkpItems;
  }
}
