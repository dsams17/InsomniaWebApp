import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Raider } from '../raider/raider';
import { RaiderDkpService } from './raider-dkp.service';

@Component({
  selector: 'app-home',
  templateUrl: './raider-details.component.html',
  styleUrls: ['./raider-details.component.css']
})
export class RaiderDetailsComponent {

  constructor(private raiderService: RaiderDkpService,
              private route: ActivatedRoute) { }


  raider : Raider;

  ngOnInit() {
    //this.getRaider();
  }


  //getRaider(): void {
    //const id = +this.route.snapshot.paramMap.get('id');
    //this.raider = this.raiderService.getRaider(id);
  //}

}
