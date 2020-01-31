import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Raider } from "../raider/raider";
import { DkpItem } from "../raider/dkp-item";
import { RaiderHttpService } from "../raider/raider-http.service";
import { DataChangedService } from "../data-changed.service";
import { CharacterClassEnum } from "../character-class/character-class.enum";
import { AuthenticationService } from "../authentication/authentication.service";

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
  error: string = null;
  
  constructor(private raiderService: RaiderHttpService, private modalService: NgbModal, private changesService: DataChangedService, private authService: AuthenticationService, private router: Router ) { }

  ngOnInit() {
    this.getAllRaiders();
  }

  clickLogout() {
    this.authService.logout();
    this.router.navigate(["/home"]);
    this.error = null;
  }

  clickAddRaider() {
    this.error = null;
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
    this.error = null;
    const selected = this.buttons.filter(x => x.clicked);

    if (selected.length !== 1) {
      this.error = "Please select exactly one raider when trying to give an item.";
      return;
    }

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
    this.error = null;
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
    this.error = null;
    var arr = new Array(0);
    this.buttons.map(x => {
      if (x.clicked) {
        arr.push(x.raider);
      }
    });
    if (arr.length === 0) {
      this.error = "Please select at least one raider to add DKP to.";
      return;
    }

    const modal = this.modalService.open(AddDkpModal);
    
    modal.componentInstance.raiders = arr;

    modal.result.then((res: Raider[]) => {
      if (res !== null && res !== undefined) {
        this.changesService.areNewRaiders.next(true);
        this.buttons = this.constructButtons(res);
      }
    }).catch(err => console.log(err));
  }

  clickSubtractDkp() {
    this.error = null;
    var arr = new Array(0);
    this.buttons.map(x => {
      if (x.clicked) {
        arr.push(x.raider);
      }
    });
    if (arr.length === 0) {
      this.error = "Please select at least one raider to subtract DKP from.";
      return;
    }

    const modal = this.modalService.open(SubtractDkpModal);

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
    return arr.sort((a, b) => {
      if (a.raider.name < b.raider.name) { return -1; }
      if (a.raider.name > b.raider.name) { return 1; }
      return 0;
    });
  }

  onClick(index: number) {
    console.log(this.buttons[index].raider.name);
    this.buttons[index].clicked = !this.buttons[index].clicked;
  }
}

class AddRaiderError {
  raiderNameError: string = null;
  raiderClassError: string = null;
  raiderDkpError:string = null;
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
          <div (ngModel)="error" *ngIf="error?.raiderNameError"
               class="alert alert-danger">
            <div>
              {{error.raiderNameError}}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <label for="characterClass" style="text-align: right;">Class:</label>
        </div>
        <div class="col-8">
          <select [(ngModel)]="raider.characterClass">
            <option *ngFor="let characterClass of characterClasses"
                    [ngValue]="characterClass">
              {{characterClass}}
            </option>
          </select>
          <div (ngModel)="error" *ngIf="error?.raiderClassError"
               class="alert alert-danger">
            <div>
              {{error.raiderClassError}}
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <label for="dkp" style="text-align: right;">Starting DKP:</label>
        </div>
        <div class="col-8">
          <input [(ngModel)]="raider.dkp" required id="dkp" type="number">
          <div (ngModel)="error" *ngIf="error?.raiderDkpError"
               class="alert alert-danger">
            <div>
              {{error.raiderDkpError}}
            </div>
          </div>
        </div>
      </div>
      <div class="row" (ngModel)="requestError" *ngIf="requestError">
        <div class="alert alert-danger">
          <div>{{requestError}}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button [disabled]="loading" type="button" class="btn btn-outline-dark" (click)=addRaider()>
        <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
        Add</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class AddRaiderModal {
  @Input() raider: Raider;
  loading: boolean = false;
  error: AddRaiderError = new AddRaiderError();
  requestError: string = null;
  
  public characterClasses = Object.values(CharacterClassEnum);

  constructor(public activeModal: NgbActiveModal, private raiderService: RaiderHttpService, private router: Router) { }

  addRaider() {
    this.error.raiderNameError = null;
    this.error.raiderClassError = null;
    this.error.raiderDkpError = null;
    this.requestError = null;

    if (this.raider.dkp === null || this.raider.dkp === undefined || this.raider.dkp < 0) {
      this.error.raiderDkpError = "Please enter a non-negative starting DKP.";
    }
    if (this.raider.characterClass === null || this.raider.characterClass === undefined || this.raider.characterClass.length === 0) {
      this.error.raiderClassError = "Please select a class.";
    }
    if (this.raider.name === null || this.raider.name === undefined || this.raider.name.length === 0) {
      this.error.raiderNameError = "Please enter a name.";
    }

    if (this.error.raiderNameError !== null || this.error.raiderClassError !== null || this.error.raiderDkpError !== null) { return }

    this.loading = true;
    this.raiderService.addRaider(this.raider)
      .subscribe(res => {
          this.loading = false;
          this.activeModal.close(res);
        },
        (err) => {
          if (err === 401) {
            this.requestError = "You are not properly signed in. Please log in again.";
            return;
          } else {
            this.loading = false;
            console.log(err);
            this.requestError = "There was a problem with the request. Please try again but if this keeps happening you probably gotta hit up Waffle.";
            return;
          }
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
      <div class="row mb-3">
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
          <div (ngModel)="error" *ngIf="error"
               class="alert alert-danger">
            <div>
              {{error}}
            </div>
          </div>
        </div>
      </div>
      <div class="row" (ngModel)="requestError" *ngIf="requestError">
        <div class="alert alert-danger">
          <div>{{requestError}}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button [disabled]="loading" type="button" class="btn btn-outline-dark" (click)=decayRaiders()>
        <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
        Submit Decay</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class DecayRaidersModal {
  @Input() decayPct: Number;
  loading: boolean = false;
  error: string = null;
  requestError: string = null;

  constructor(public activeModal: NgbActiveModal, private raiderService: RaiderHttpService, private router: Router) { }

  decayRaiders() {
    this.requestError = null;
    this.error = null;

    if (this.decayPct === null || this.decayPct === undefined) {
      this.error = "Please select a decay percentage.";
      return;
    }

    this.loading = true;

    this.raiderService.decayRaiders(this.decayPct)
      .subscribe(res => {
          this.loading = false;
          this.activeModal.close(res);
        },
        err => {
          if (err === 401) {
            this.requestError = "You are not properly signed in. Please log in again.";
            return;
          } else {
            this.loading = false;
            console.log(err);
            this.requestError = "There was a problem with the request. Please try again but if this keeps happening you probably gotta hit up Waffle.";
            return;
          }
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
      <div class="row mb-3">
        <div class="col-6">
          <label for="raiderName" style="text-align: right;">DKP to add to selected:</label>
        </div>
        <div class="col-6">
          <input [(ngModel)]="pointsToAdd" id="dkpToAdd" name="dkpToAdd" required type="number">
          <div (ngModel)="error" *ngIf="error"
               class="alert alert-danger">
            <div>
              {{error}}
            </div>
          </div>
        </div>
      </div>
      <div class="row" (ngModel)="requestError" *ngIf="requestError">
        <div class="alert alert-danger">
          <div>{{requestError}}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button [disabled]="loading" type="button" class="btn btn-outline-dark" (click)=addDkpToRaiders()>
        <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
        Submit Add</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class AddDkpModal {
  @Input() pointsToAdd: number = 0;
  @Input() raiders: Raider[];
  loading: boolean = false;
  error: string;
  requestError: string = null;

  constructor(public activeModal: NgbActiveModal, private raiderService: RaiderHttpService, private router: Router) { }

  addDkpToRaiders() {
    this.error = null;
    this.requestError = null;

    if (this.pointsToAdd < 0) {
      this.error = "Please enter a positive number of DKP to add.";
      return;
    }

    this.loading = true;
    this.raiderService.giveDkp(new RaidersDkpAdd(this.raiders, this.pointsToAdd))
      .subscribe(res => {
          this.loading = false;
          this.activeModal.close(res);
        },
        err => {
          if (err === 401) {
            this.requestError = "You are not properly signed in. Please log in again.";
            return;
          } else {
            this.loading = false;
            console.log(err);
            this.requestError = "There was a problem with the request. Please try again but if this keeps happening you probably gotta hit up Waffle.";
            return;
          }
        });
    this.router.navigate(['/admin']);
  }
}

@Component({
  selector: 'subtract-dkp-modal-content',
  template: `
    <div class="modal-header">
      <h3 class="modal-title">Subtract DKP from Raiders</h3>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row mb-3">
        <div class="col-6">
          <label for="raiderName" style="text-align: right;">DKP to subtract from selected:</label>
        </div>
        <div class="col-6">
          <input [(ngModel)]="pointsToSubtract" id="dkpToSubtract" name="dkpToSubtract" required type="number">
          <div (ngModel)="error" *ngIf="error"
               class="alert alert-danger">
            <div>
              {{error}}
            </div>
          </div>
        </div>
      </div>
      <div class="row" (ngModel)="requestError" *ngIf="requestError">
        <div class="alert alert-danger">
          <div>{{requestError}}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button [disabled]="loading" type="button" class="btn btn-outline-dark" (click)=addDkpToRaiders()>
        <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
        Submit Add</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class SubtractDkpModal {
  @Input() pointsToSubtract: number = 0;
  @Input() raiders: Raider[];
  loading: boolean = false;
  error: string;
  requestError: string = null;

  constructor(public activeModal: NgbActiveModal, private raiderService: RaiderHttpService, private router: Router) { }

  addDkpToRaiders() {
    this.error = null;
    this.requestError = null;

    if (this.pointsToSubtract < 0) {
      this.error = "Please enter a positive number of DKP to subtract.";
      return;
    }

    this.loading = true;
    this.raiderService.giveDkp(new RaidersDkpAdd(this.raiders, -this.pointsToSubtract))
      .subscribe(res => {
        this.loading = false;
        this.activeModal.close(res);
      },
        err => {
          if (err === 401) {
            this.requestError = "You are not properly signed in. Please log in again.";
            return;
          } else {
            this.loading = false;
            console.log(err);
            this.requestError = "There was a problem with the request. Please try again but if this keeps happening you probably gotta hit up Waffle.";
            return;
          }
        });
    this.router.navigate(['/admin']);
  }
}

class GiveItemError {
  itemNameError: string = null;
  costError: string = null;
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
          <div (ngModel)="error" *ngIf="error?.itemNameError"
               class="alert alert-danger">
            <div>
              {{error.itemNameError}}
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6">
          <label for="raiderName" style="text-align: right;">Item DKP Cost:</label>
        </div>
        <div class="col-6">
          <input [(ngModel)]="dkpCost" id="dkpCost" required type="number">
          <div (ngModel)="error" *ngIf="error?.costError"
               class="alert alert-danger">
            <div>
              {{error.costError}}
            </div>
          </div>
        </div>
      </div>
      <div class="row" (ngModel)="requestError" *ngIf="requestError">
        <div class="alert alert-danger">
          <div>{{requestError}}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button [disabled]="loading" type="button" class="btn btn-outline-dark" (click)=giveItemToRaider()>
        <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
        Submit</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
    </div>
  `
})
export class GiveItemModal {
  @Input() itemName: string;
  @Input() dkpCost: number;
  @Input() raider: Raider;
  loading: boolean = false;
  error: GiveItemError = new GiveItemError();
  requestError: string = null;

  constructor(public activeModal: NgbActiveModal, private raiderService: RaiderHttpService, private router: Router) { }

  giveItemToRaider() {
    this.requestError = null;
    this.error.costError = null;
    this.error.itemNameError = null;

    if (this.dkpCost === null || this.dkpCost === undefined || this.dkpCost < 0) {
      this.error.costError = "Please enter a positive DKP cost for the item.";
    }
    if (this.itemName === null || this.itemName === undefined || this.itemName.length === 0) {
      this.error.itemNameError = "Please enter an item name.";
    }

    if (this.error.costError !== null || this.error.itemNameError !== null) { return }

    this.loading = true;

    var item = new DkpItem();
    item.raider = this.raider;
    item.dkpCost = this.dkpCost;
    item.itemName = this.itemName;
    this.raiderService.giveItem(item)
      .subscribe(res => {
          this.loading = false;
          this.activeModal.close(res);
        },
        err => {
          if (err === 401) {
            this.requestError = "You are not properly signed in. Please log in again.";
            return;
          } else {
            this.loading = false;
            console.log(err);
            this.requestError = "There was a problem with the request. Please try again but if this keeps happening you probably gotta hit up Waffle.";
            return;
          }
        });

    this.router.navigate(['/admin']);
  }
}
