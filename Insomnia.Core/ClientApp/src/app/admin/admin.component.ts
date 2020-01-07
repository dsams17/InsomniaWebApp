import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Raider } from "../raider/raider";
import { DkpItem } from "../raider/dkp-item";
import { RaiderHttpService } from "../raider/raider-http.service";
import { DataChangedService } from "../data-changed.service";
import { CharacterClassEnum } from "../character-class/character-class.enum";

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
  
  constructor(private raiderService: RaiderHttpService, private modalService: NgbModal, private changesService: DataChangedService) { }

  ngOnInit() {
    this.getAllRaiders();
  }

  clickAddRaider() {
    const modal = this.modalService.open(AddRaiderModal);
    modal.componentInstance.raider = new Raider("", "", 0, null);

    modal.result.then((res: Raider) => {
      if (res !== null && res !== undefined) {
        this.buttons.push(new RaiderButton(false, res));
        this.changesService.areNewRaiders.next(true);
      }
    }).catch(err => console.log(err));
  }

  clickGiveItem() {
    const selected = this.buttons.filter(x => x.clicked);

    if (selected.length !== 1) return;

    const modal = this.modalService.open(GiveItemModal);
    modal.componentInstance.raider = selected[0].raider;

    modal.result.then((res: Raider) => {
      if (res !== null && res !== undefined) {
        this.buttons.map(x => {
          if (x.raider.name === res.name) {
            x.clicked = false;
            x.raider.dkp = res.dkp;
          }
        });
        this.changesService.areNewRaiders.next(true);
      }
    }).catch(err => console.log(err));
  }

  clickDecayRaiders() {
    console.log("decay click");
    const modal = this.modalService.open(DecayRaidersModal);
    
    modal.result.then(res => {
      if (res !== null && res !== undefined) {
        this.buttons = this.constructButtons(res);
        this.changesService.areNewRaiders.next(true);
      }
    }).catch(err => console.log(err));
  }

  clickAddDkp() {
    const modal = this.modalService.open(AddDkpModal);
    var arr = new Array(0);
    this.buttons.map(x => {
      if (x.clicked) {
        arr.push(x.raider);
      }
    });
    modal.componentInstance.raiders = arr;

    modal.result.then((res: Raider[]) => {
      if (res !== null && res !== undefined) {
        this.changesService.areNewRaiders.next(true);
        this.buttons = this.constructButtons(res);
      }
    }).catch(err => console.log(err));
  }

  getAllRaiders() {
    this.raiderService.getRaiders()
      .subscribe((res: Raider[]) => {
          this.buttons = this.constructButtons(res);
        },
        err => { console.log(err); });
  }

  constructButtons(raiders: Raider[]) {
    var arr = new Array(raiders.length);
    for (var i = 0; i < arr.length; ++i) {
      arr[i] = new RaiderButton(false, raiders[i]);
    };
    return arr;
  }

  onClick(index: number) {
    console.log(this.buttons[index].raider.name);
    this.buttons[index].clicked = !this.buttons[index].clicked;
  }
}


@Component({
  selector: 'add-raider-modal-content',
  template: `
    <div class="modal-header">
      <h3 class="modal-title">Add Raider</h3>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-4">
          <label for="raiderName" style="text-align: right;">Raider Name:</label>
        </div>
        <div class="col-8">
          <input [(ngModel)]="raider.name" id="raiderName" required type="text">
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <label for="characterClass" style="text-align: right;">Class:</label>
        </div>
        <div class="col-8">
          <select [(ngModel)]="raider.characterClass">
            <option *ngFor="let fileType of fileTypes"
                    [ngValue]="fileType">
              {{fileType}}
            </option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <label for="dkp" style="text-align: right;">Starting DKP:</label>
        </div>
        <div class="col-8">
          <input [(ngModel)]="raider.dkp" required id="dkp" type="number">
        </div>
      </div>      
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)=addRaider()>Add</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class AddRaiderModal {
  @Input() raider: Raider;
  
  public fileTypes = Object.values(CharacterClassEnum);

  constructor(public activeModal: NgbActiveModal, private raiderService: RaiderHttpService, private router: Router) { }

  addRaider() {
    this.raiderService.addRaider(this.raider)
      .subscribe(res => {
          this.activeModal.close(res);
        },
        err => {
          this.activeModal.dismiss();
          console.log(err);
        });

    this.router.navigate(['/admin']);
  }
}

@Component({
  selector: 'decay-raiders-modal-content',
  template: `
    <div class="modal-header">
      <h3 class="modal-title">Decay Raiders</h3>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-6">
          <label for="raiderName" style="text-align: right;">Choose percentage to decay (10% decay means everyone will be left with 90% of initial DKP):</label>
        </div>
        <div class="col-6">
          <select [(ngModel)]="decayPct">
            <option [ngValue]=".95">5%</option>
            <option [ngValue]=".90">10%</option>
            <option [ngValue]=".85">15%</option>
            <option [ngValue]=".80">20%</option>
            <option [ngValue]=".75">25%</option>
            <option [ngValue]=".70">30%</option>
            <option [ngValue]=".65">35%</option>
            <option [ngValue]=".60">40%</option>
            <option [ngValue]=".55">45%</option>
            <option [ngValue]=".50">50%</option>
          </select>
        </div>
      </div>     
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)=decayRaiders()>Submit Decay</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class DecayRaidersModal {
  @Input() decayPct: Number;

  constructor(public activeModal: NgbActiveModal, private raiderService: RaiderHttpService, private router: Router) { }

  decayRaiders() {
    this.raiderService.decayRaiders(this.decayPct)
      .subscribe(res => {
          this.activeModal.close(res);
        },
        err => {
          console.log(err);
          this.activeModal.dismiss();
        });

    this.router.navigate(['/admin']);
  }
}

class RaidersDkpAdd {
  constructor(raiders: Raider[], dkpToAdd: number) {
    this.dkpToAdd = dkpToAdd;
    this.raiders = raiders;
  }

  raiders: Raider[];
  dkpToAdd: number;
}

@Component({
  selector: 'add-dkp-modal-content',
  template: `
    <div class="modal-header">
      <h3 class="modal-title">Add DKP to Raiders</h3>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-6">
          <label for="raiderName" style="text-align: right;">DKP to add to selected:</label>
        </div>
        <div class="col-6">
          <input [(ngModel)]="pointsToAdd" id="raiderName" required type="number">
        </div>
      </div>     
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)=addDkpToRaiders()>Submit Add</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class AddDkpModal {
  @Input() pointsToAdd: number;
  @Input() raiders: Raider[];

  constructor(public activeModal: NgbActiveModal, private raiderService: RaiderHttpService, private router: Router) { }

  addDkpToRaiders() {
    this.raiderService.giveDkp(new RaidersDkpAdd(this.raiders, this.pointsToAdd))
      .subscribe(res => {
          this.activeModal.close(res);
        },
        err => {
          console.log(err);
          this.activeModal.dismiss();
        });

    this.router.navigate(['/admin']);
  }
}

@Component({
  selector: 'give-item-modal-content',
  template: `
    <div class="modal-header">
      <h3 class="modal-title">Give Item to Raider</h3>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-6">
          <label for="raiderName" style="text-align: right;">Item Name:</label>
        </div>
        <div class="col-6">
          <input [(ngModel)]="itemName" id="itemName" required type="string">
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <label for="raiderName" style="text-align: right;">Item DKP Cost:</label>
        </div>
        <div class="col-6">
          <input [(ngModel)]="dkpCost" id="dkpCost" required type="number">
        </div>
      </div>     
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)=giveItemToRaider()>Submit</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class GiveItemModal {
  @Input() itemName: string;
  @Input() dkpCost: number;
  @Input() raider: Raider;

  constructor(public activeModal: NgbActiveModal, private raiderService: RaiderHttpService, private router: Router) { }

  giveItemToRaider() {
    console.log(this.dkpCost);

    var item = new DkpItem();
    item.raider = this.raider;
    item.dkpCost = this.dkpCost;
    item.itemName = this.itemName;
    this.raiderService.giveItem(item)
      .subscribe(res => {
          this.activeModal.close(res);
        },
        err => {
          console.log(err);
          this.activeModal.dismiss();
        });

    this.router.navigate(['/admin']);
  }
}
