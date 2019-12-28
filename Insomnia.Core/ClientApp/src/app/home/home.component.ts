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

  raiders : Raider[] = [
    { id: 1, name: "Xede", dkp: 50 },
    { id: 2, name: "Vahn", dkp: 50 },
    { id: 3, name: "Title", dkp: 50 },
    { id: 4, name: "Xede", dkp: 50 },
    { id: 5, name: "Xede", dkp: 50 },
    { id: 6, name: "Xede", dkp: 50 },
    { id: 7, name: "Xede", dkp: 50 },
    { id: 8, name: "Xede", dkp: 50 },
    { id: 9, name: "Xede", dkp: 50 },
    { id: 10, name: "Xede", dkp: 50 },
  ];

  ngOnInit() {
  }

}
