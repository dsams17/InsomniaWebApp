import { Injectable, PipeTransform } from '@angular/core';
import { Raider } from './raider';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { SortDirection } from '../table/sortable.directive';

interface ISearchResult {
  raiders: Raider[];
  //total: number;
}

interface IState {
  //page: number;
  //pageSize: number;
  //searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(raiders: Raider[], column: string, direction: string): Raider[] {
  if (direction === '') {
    return raiders;
  } else {
    return [...raiders].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

//function matches(raider: Raider, term: string, pipe: PipeTransform) {
//  return raider.name.toLowerCase().includes(term)
//    || pipe.transform(raider.characterClass).includes(term)
//    || pipe.transform(raider.dkp).includes(term);
//}

@Injectable({providedIn: 'root'})
export class RaiderDkpService {
  private _raiders: Raider[];
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _raiders$ = new BehaviorSubject<Raider[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: IState = {
    //page: 1,
    //pageSize: 4,
    //searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private httpClient: HttpClient, private pipe: DecimalPipe) {
    this.getRaiders().subscribe((res: Raider[]) => {
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search(res)),
          delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe((result: ISearchResult) => {
          this._raiders$.next(result.raiders);
          //this._total$.next(result.total);
        });

        this._search$.next(); },
      err => {console.log(err)});
  }

  ngOnInit() {
    
  }

  get raiders$() { return this._raiders$.asObservable(); }
  //get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  //get page() { return this._state.page; }
  //get pageSize() { return this._state.pageSize; }
  //get searchTerm() { return this._state.searchTerm; }

  //set page(page: number) { this._set({ page }); }
  //set pageSize(pageSize: number) { this._set({ pageSize }); }
  //set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<IState>) {
    (<any>Object).assign(this._state, patch);
    this._search$.next();
  }

  private _search(res: Raider[]): Observable<ISearchResult> {
    const { sortColumn, sortDirection } = this._state;

    // 1. sort
    let raiders = sort(res, sortColumn, sortDirection);

    return of({ raiders });
  }

  getRaiders(): Observable<Raider[]> {
    return this.httpClient.get<Raider[]>("api/dkp/multiple");
  } 
}
