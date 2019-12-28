import { Injectable } from '@angular/core';
import { Raider } from './raider';

@Injectable({
  providedIn: 'root'
})
export class RaiderDkpService {

  constructor() { }

  getRaider(id: number): Raider {
    return new Raider(id, "Waffle", 15);
  } 
}
