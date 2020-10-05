import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListsComponent} from "./lists/lists.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";


const routes: Routes = [
  {
    path: 'lists',
    component: ListsComponent
  },
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
