import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './lists/list/list.component';
import {HttpClientModule} from "@angular/common/http";
import { ListsComponent } from './lists/lists.component';
import {FormsModule} from "@angular/forms";
import { TrashIconComponent } from './icon/trash-icon/trash-icon.component';
import { CheckIconComponent } from './icon/check-icon/check-icon.component';
import { XIconComponent } from './icon/x-icon/x-icon.component';
import {CookieService} from "ngx-cookie-service";
import {environment} from "../environments/environment";
import {ListService} from "./service/list.service";
import {HttpListRepositoryService} from "./service/live/http-list-repository.service";
import {MockListRepositoryService} from "./service/mock/mock-list-repository.service";
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskComponent } from './tasks/task/task.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ListsComponent,
    TrashIconComponent,
    CheckIconComponent,
    XIconComponent,
    LandingPageComponent,
    TasksComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    CookieService,
    ListService,
    HttpListRepositoryService,
    MockListRepositoryService,
    {provide: 'ListRepositoryService', useClass: environment.listRepositoryServiceType},
    {provide: 'TaskRepositoryService', useClass: environment.taskRepositoryServiceType}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
