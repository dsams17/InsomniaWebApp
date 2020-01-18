import { Component, QueryList, ViewChildren, OnInit} from '@angular/core';

import { Observable } from 'rxjs';
import { RaiderTableService } from '../raider/raider-table.service';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { DkpItem } from "../raider/dkp-item";

@Component({
  selector: 'item-table-complete',
  templateUrl: './item-table.component.html'
})
export class ItemTableComplete {
  items: DkpItem[];
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: RaiderTableService) {
    service.items$.subscribe(res => {
      console.log("NGBD UPDATE");
      console.log(res);
      this.items = res;
    });
    this.total$ = service.itemTotal$;
  }

  ngOnInit() {
    //this.raiders$ = this.service.raiders$;
  }

  onSort({ column, direction }: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      console.log(header);
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    console.log(column);
    this.service.itemSortColumn = column;
    this.service.itemSortDirection = direction;
  }
}
