import { Injectable } from '@angular/core';
import { Raider } from './raider';
import { distinctUntilChanged } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataChangedService } from "../data-changed.service";
import { DkpItem } from "./dkp-item";


@Injectable({ providedIn: 'root' })
export class RaiderHttpService {
  allRaiders: BehaviorSubject<Observable<Raider[]>> = new BehaviorSubject<Observable<Raider[]>>(new Observable);
  allItems: BehaviorSubject<Observable<DkpItem[]>> = new BehaviorSubject<Observable<DkpItem[]>>(new Observable);


  constructor(private httpClient: HttpClient, private dataChangedService: DataChangedService) {
    this.dataChangedService.areNewRaiders.pipe(distinctUntilChanged()).subscribe(value => {
      console.log("Client update");
      this.allRaiders.next(this.getRaiders());
      this.dataChangedService.areNewRaiders.next(false);
    });

    this.dataChangedService.areNewItems.pipe(distinctUntilChanged()).subscribe(value => {
      console.log("Client item update");
      this.allItems.next(this.getItems());
      this.dataChangedService.areNewItems.next(false);
    });
  }

  ngOnInit() {
    this.allRaiders.next(this.getRaiders());
  }

  getOptions() {
    var user = localStorage.getItem("currentUser");
    return {
      headers: new HttpHeaders({
        "adminUser": user
      })
    }
  }

  decayRaiders(percentage: Number) {
    return this.httpClient.post<Raider[]>("api/raider/multiple/decay", percentage, this.getOptions());
  }

  addRaider(raider: Raider): Observable<Raider> {
    return this.httpClient.post<Raider>("api/raider", raider, this.getOptions());
  }

  getRaider(name: string, characterClass: string): Observable<Raider> {
    return this.httpClient.get<Raider>(`api/raider?name=${name}&characterClass=${characterClass}`);
  }

  getRaiders(): Observable<Raider[]> {
    return this.httpClient.get<Raider[]>("api/raider/multiple");
  }

  giveDkp(raidersAndDkp): Observable<Raider[]> {
    return this.httpClient.post<Raider[]>("api/raider/givedkp", raidersAndDkp, this.getOptions());
  }

  giveItem(dkpItem: DkpItem): Observable<Raider> {
    return this.httpClient.post<Raider>("api/raider/item", dkpItem, this.getOptions());
  }

  getItems(): Observable<DkpItem[]> {
    return this.httpClient.get<DkpItem[]>("api/raider/item");
  }
}
