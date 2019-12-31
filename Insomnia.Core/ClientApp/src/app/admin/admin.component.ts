import { Component, OnInit } from '@angular/core';
import { Raider } from "../raider/raider";
import { RaiderHttpService } from "../raider/raider-http.service";

class RaiderButton {
  constructor(clicked: boolean, raider: Raider) {
    this.clicked = clicked;
    this.raider = raider;
  }
  clicked: boolean;
  raider: Raider;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  buttons: RaiderButton[];

  constructor(private raiderService: RaiderHttpService ) { }

  ngOnInit() {
    this.raiderService.getRaiders()
      .subscribe((res: Raider[]) => {
          this.buttons = new Array(res.length);
          for (var i = 0; i < this.buttons.length; ++i) {
            this.buttons[i] = new RaiderButton(false, res[i]);
            console.log(this.buttons[i].raider.name);
          };
        },
        err => { console.log(err); });
    
  }


  onClick(index: number) {
    this.buttons[index].clicked = !this.buttons[index].clicked;
  }
}
