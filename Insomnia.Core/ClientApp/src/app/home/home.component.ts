import { Component, OnInit } from '@angular/core';
import { Raider } from '../raider/raider';
import { RaiderDkpService } from '../raider/raider-dkp.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private raiderService: RaiderDkpService) {}


  ngOnInit() {
  }

}
