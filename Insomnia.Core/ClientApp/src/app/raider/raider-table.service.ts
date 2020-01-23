import { Injectable, PipeTransform } from '@angular/core';
import { Raider } from './raider';
import { RaiderHttpService } from './raider-http.service';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { SortDirection } from '../table/sortable.directive';
import { DkpItem } from "./dkp-item";

interface ISearchResult<T> {
  items: T[];
  total: number;
}

interface IState {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort<T>(raiders: T[], column: string, direction: string): T[] {
  if (direction === '') {
    return raiders;
  } else {
    if (column.includes(".")) {
      var split = column.split(".");

      return [...raiders].sort((a, b) => {
        const res = compare(a[split[0]][split[1]], b[split[0]][split[1]]);
        return direction === 'asc' ? res : -res;
      });
    }
    return [...raiders].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function itemMatches(item: DkpItem, term: string) {
  term = term.toLowerCase();
  var name = item.raider.name.toLowerCase();
  return item.itemName.toLowerCase().includes(term)
    || item.dkpCost.toString().includes(term)
    || name.includes(term);
}

@Injectable({providedIn: 'root'})
export class RaiderTableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _raiders$ = new BehaviorSubject<Raider[]>([]);
  private _items$ = new BehaviorSubject<DkpItem[]>([]);
  //private _total$ = new BehaviorSubject<number>(0);
  private _itemTotal$ = new BehaviorSubject<number>(0);

  private _raidersState: IState = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  private _itemsState: IState = {
    page: 1,
    pageSize: 25,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private raiderHttpService: RaiderHttpService) {
    this.raiderHttpService.allRaiders.subscribe((OGres: Observable<Raider[]>) => {
      OGres.subscribe((res: Raider[]) => {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search(res, null, this._raidersState)),
            //delay(200),
            tap(() => this._loading$.next(false))
          ).subscribe((result: ISearchResult<Raider>) => {
            this._raiders$.next(result.items);
            //this._total$.next(result.total);
          });

          this._search$.next();
        });
      },
      err => { console.log(err) });

    this.raiderHttpService.allItems.subscribe((OGres: Observable<DkpItem[]>) => {
      OGres.subscribe((res: DkpItem[]) => {
        res.map(x => x.dateToCstString = x.dateAcquired.toLocaleString());
          this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search(res, (item, search) => itemMatches(item, search), this._itemsState, true)),
            //delay(200),
            tap(() => this._loading$.next(false))
          ).subscribe((result: ISearchResult<DkpItem>) => {
            this._items$.next(result.items);
            this._itemTotal$.next(result.total);
          });

        this._search$.next();
        console.log(res);
      });
      },
      err => { console.log(err) });
  }

  ngOnInit() {
    
  }

  get raiders$() { return this._raiders$.asObservable(); }
  get items$() { return this._items$.asObservable(); }
  get itemTotal$() { return this._itemTotal$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  //get page() { return this._state.page; }
  //get pageSize() { return this._state.pageSize; }
  //get searchTerm() { return this._state.searchTerm; }
  get itemPage() { return this._itemsState.page; }
  get itemPageSize() { return this._itemsState.pageSize; }
  get itemSearchTerm() { return this._itemsState.searchTerm; }

  //set page(page: number) { this._set({ page }); }
  //set pageSize(pageSize: number) { this._set({ pageSize }); }
  //set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set raiderSortColumn(sortColumn: string) { this._set({ sortColumn }, this._raidersState); }
  set raiderSortDirection(sortDirection: SortDirection) { this._set({ sortDirection }, this._raidersState); }

  set itemPage(page: number) { this._set({ page }, this._itemsState); }
  set itemPageSize(pageSize: number) { this._set({ pageSize }, this._itemsState); }
  set itemSearchTerm(searchTerm: string) { this._set({ searchTerm }, this._itemsState); }
  set itemSortColumn(sortColumn: string) { this._set({ sortColumn }, this._itemsState); }
  set itemSortDirection(sortDirection: SortDirection) { this._set({ sortDirection }, this._itemsState); }

  private _set(patch: Partial<IState>, state: IState) {
    (<any>Object).assign(state, patch);
    this._search$.next();
  }

  private _search<T>(items: T[], matchesFunc: (item: T, search: string) => boolean, state: IState, filterAndPage: boolean = false): Observable<ISearchResult<T>> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = state;
    console.log("in search");
    console.log(items);
    // 1. sort
    let results = sort(items, sortColumn, sortDirection);
    let total = results.length;

    if (filterAndPage) {
      // 2. filter
      results = results.filter(raider => matchesFunc(raider, searchTerm));
      total = results.length;

      // 3. paginate
      results = results.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    }

    return of({ items: results, total});
  }
}
