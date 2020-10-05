import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";

var isAuthorized;
var currentApiRequest;
var GoogleAuth; // Google Auth object.

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
