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
import { AdminComponent } from './admin/admin.component';
import { ItemHistoryComponent } from './item-history/item-history.component';

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
    ItemHistoryComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [RaiderTableService, RaiderHttpService, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
