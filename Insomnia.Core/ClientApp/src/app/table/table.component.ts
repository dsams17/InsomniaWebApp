import { Component, QueryList, ViewChildren } from '@angular/core';

import { Observable } from 'rxjs';
import { RaiderTableService as RaiderDkpService } from '../raider/raider-table.service';
import { Raider } from '../raider/raider';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';

@Component({
  selector: 'ngbd-table-complete',
  templateUrl: './table.component.html'
})
export class NgbdTableComplete {
  raiders$: Observable<Raider[]>;
  //total$: Observable<number>;
  classPicture: { [id: string]: string; } = {};
  

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: RaiderDkpService) {
    this.raiders$ = service.raiders$;
    //this.total$ = service.total$;
    this.classPicture["DRUID"] = "/assets/druid_icon.png";
    this.classPicture["HUNTER"] = "/assets/hunter_icon.png";
    this.classPicture["MAGE"] = "/assets/mage_icon.png";
    this.classPicture["PALADIN"] = "/assets/paladin_icon.png";
    this.classPicture["PRIEST"] = "/assets/priest_icon.png";
    this.classPicture["ROGUE"] = "/assets/rogue_icon.png";
    this.classPicture["SHAMAN"] = "/assets/shaman_icon.png";
    this.classPicture["WARLOCK"] = "/assets/warlock_icon.png";
    this.classPicture["WARRIOR"] = "/assets/warrior_icon.png";
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
