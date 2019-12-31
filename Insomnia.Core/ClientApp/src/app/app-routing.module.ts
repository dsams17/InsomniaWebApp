import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ItemHistoryComponent } from './item-history/item-history.component';
import { RaiderDetailsComponent } from './raider/raider-details.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", component: HomeComponent },
  { path: "admin", component: AdminComponent },
  { path: "history", component: ItemHistoryComponent },
  { path: 'raiderdetail/:name', component: RaiderDetailsComponent },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
