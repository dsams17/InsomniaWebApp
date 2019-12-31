import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Raider } from '../raider/raider';
import { RaiderHttpService } from './raider-http.service';

import { Observable, BehaviorSubject, of, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './raider-details.component.html',
  styleUrls: ['./raider-details.component.css']
})
export class RaiderDetailsComponent {

  constructor(private raiderService: RaiderHttpService,
              private route: ActivatedRoute) { }


  raider: Raider;
  isLoaded: boolean;

  ngOnInit() {
    this.getRaider();
  }


  getRaider(): void {
    var name = this.route.snapshot.paramMap.get('name');
    var charClass = this.route.snapshot.queryParamMap.get('charClass');
    this.raiderService.getRaider(name, charClass)
      .subscribe((res: Raider) => {
          this.raider = res;
          this.isLoaded = true;
        },
                  err => { console.log(err); });
  }

}
