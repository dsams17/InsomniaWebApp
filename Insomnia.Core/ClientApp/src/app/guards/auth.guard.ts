import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from "../authentication/authentication.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser !== null && currentUser !== undefined) {

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    console.log("Off to login");
    var f = this.router.navigate(['login'], { queryParams: { returnUrl: state.url.slice(1) } });
    f.then(res => { console.log(res);});
    return false;
  }
}
