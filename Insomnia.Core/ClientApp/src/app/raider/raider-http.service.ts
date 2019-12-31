import { Injectable } from '@angular/core';
import { Raider } from './raider';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class RaiderHttpService {

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {

  }

  getRaider(name: string, characterClass: string): Observable<Raider> {
    return this.httpClient.get<Raider>(`api/raider?name=${name}&characterClass=${characterClass}`);
  }

  getRaiders(): Observable<Raider[]> {
    return this.httpClient.get<Raider[]>("api/raider/multiple");
  }
}
