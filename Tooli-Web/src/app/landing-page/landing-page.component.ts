import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  loginUrl = environment.loginUrl;
  isSignedIn = false;

  constructor(
    private _http: HttpClient,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    if (environment.production) {
      this._http.get(environment.api_url + "sso/google/isSignedIn")
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response.isSignedIn) {
              this.isSignedIn = true;
              this._router.navigate(['lists']);
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
