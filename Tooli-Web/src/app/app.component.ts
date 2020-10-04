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
  isSignedIn = false;

  constructor(
    private _http: HttpClient
  ) {  }

  ngOnInit(): void {
    if (environment.production) {
      this._http.get(environment.api_url + "sso/google/isSignedIn")
        .subscribe(
          (response: any) => {
            console.log(response);
            if (!response.isSignedIn) {
              window.location.href = environment.api_url + "sso/google/login?state=/";
            } else {
              this.isSignedIn = true;
            }
          },
          err => {
            console.log(err);
          }
        );
    } else {
      this.isSignedIn = true;
    }
  }


}
