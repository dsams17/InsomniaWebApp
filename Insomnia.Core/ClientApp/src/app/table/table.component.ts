import { Component, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';
import { RaiderDkpService } from '../raider/raider-dkp.service';
import { Raider } from '../raider/raider';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';

@Component({
  selector: 'ngbd-table-complete',
  templateUrl: './table.component.html'
})
export class NgbdTableComplete {
  raiders$: Observable<Raider[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: RaiderDkpService) {
    this.raiders$ = service.raiders$;
    this.total$ = service.total$;
  }

  onSort({ column, direction }: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
