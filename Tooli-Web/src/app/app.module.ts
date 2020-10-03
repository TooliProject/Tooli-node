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

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ListsComponent,
    TrashIconComponent,
    CheckIconComponent,
    XIconComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
