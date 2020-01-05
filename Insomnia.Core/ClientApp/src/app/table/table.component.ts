import { Component, QueryList, ViewChildren, OnInit} from '@angular/core';

import { Observable } from 'rxjs';
import { RaiderTableService } from '../raider/raider-table.service';
import { Raider } from '../raider/raider';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';

@Component({
  selector: 'ngbd-table-complete',
  templateUrl: './table.component.html'
})
export class NgbdTableComplete {
  raiders: Raider[];
  //total$: Observable<number>;
  classPicture: { [id: string]: string; } = {};
  

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: RaiderTableService) {
    service.raiders$.subscribe(res => {
      console.log("NGBD UPDATE");
      console.log(res);
      this.raiders = res;
    });
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

  ngOnInit() {
    //this.raiders$ = this.service.raiders$;
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
