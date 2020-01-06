import { Injectable } from '@angular/core';
import { Raider } from './raider';
import { distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataChangedService } from "../data-changed.service";


@Injectable({ providedIn: 'root' })
export class RaiderHttpService {
  allRaiders: BehaviorSubject<Observable<Raider[]>> = new BehaviorSubject<Observable<Raider[]>>(new Observable);


  constructor(private httpClient: HttpClient, private dataChangedService: DataChangedService) {
    this.dataChangedService.areNewRaiders.pipe(distinctUntilChanged()).subscribe(value => {
      console.log("Client update");
      this.allRaiders.next(this.getRaiders());
      this.dataChangedService.areNewRaiders.next(false);
    });
  }

  ngOnInit() {
    this.allRaiders.next(this.getRaiders());
  }

  decayRaiders(percentage: Number) {
    return this.httpClient.post<Raider[]>("api/raider/multiple/decay", percentage);
  }

  addRaider(raider: Raider): Observable<Raider> {
    return this.httpClient.post<Raider>("api/raider", raider);
  }

  getRaider(name: string, characterClass: string): Observable<Raider> {
    return this.httpClient.get<Raider>(`api/raider?name=${name}&characterClass=${characterClass}`);
  }

  getRaiders(): Observable<Raider[]> {
    return this.httpClient.get<Raider[]>("api/raider/multiple");
  }

  giveDkp(raidersAndDkp): Observable<Raider[]> {
    return this.httpClient.post<Raider[]>("api/raider/givedkp", raidersAndDkp);
  }
}
