import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RaiderDetailsComponent } from './raider/raider-details.component';
import { NgbdTableComplete } from './table/table.component';
import { NgbdSortableHeader } from "./table/sortable.directive";
import { RaiderTableService } from "./raider/raider-table.service";
import { RaiderHttpService } from "./raider/raider-http.service";
import { DecimalPipe } from "@angular/common";
import { AdminComponent, AddRaiderModal, DecayRaidersModal, AddDkpModal } from './admin/admin.component';
import { ItemHistoryComponent } from './item-history/item-history.component';
import { DataChangedService } from './data-changed.service';
import { AuthenticationService } from "./authentication/authentication.service";
import { LoginComponent } from "./authentication/login.component";
import { ErrorInterceptor } from "./interceptors/http-error.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    RaiderDetailsComponent,
    NgbdTableComplete,
    NgbdSortableHeader,
    AdminComponent,
    ItemHistoryComponent,
    AddRaiderModal,
    DecayRaidersModal,
    AddDkpModal,
    LoginComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [RaiderTableService, RaiderHttpService, DecimalPipe, DataChangedService, AuthenticationService, /*{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}*/],
  bootstrap: [AppComponent],
  entryComponents: [AddRaiderModal, DecayRaidersModal, AddDkpModal]
})
export class AppModule { }
