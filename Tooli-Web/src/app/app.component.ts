import {Component, OnInit} from '@angular/core';
import {ListService} from "./service/list.service";
import {List} from "./entity/List";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Tooli-Web';

  constructor(
  ) {  }

  ngOnInit(): void {
  }
}
