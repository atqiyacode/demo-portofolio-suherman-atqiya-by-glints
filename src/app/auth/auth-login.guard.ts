import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { formatDate } from "@angular/common";

import { ApiBackendService } from "./api-backend.service";

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGuard implements CanActivate {

  userTimeOut:any = "";
	constructor(
        private router: Router,
        private authenticationService: ApiBackendService
    ) {}
    
  	canActivate(
    	next: ActivatedRouteSnapshot,
    	state: RouterStateSnapshot) {
      const currentUser:any = this.authenticationService.currentUserValue;
      let today = new Date()
      let date = formatDate(today, 'yyyy-MM-dd HH:mm:ss', 'en-ID')
      if (currentUser != null) {
        if (date < localStorage.getItem("date")) {
          return true;
        }
      }
      this.router.navigate(['login']);
      return false;
  	}
  
}
