import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataChangedService {
  public areNewRaiders: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public areNewItems: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
