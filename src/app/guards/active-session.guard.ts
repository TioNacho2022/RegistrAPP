import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../servicio/api-base.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveSessionGuard implements CanActivate {
  constructor(private api:ApiBaseService, private router:Router){}
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.api.sessionActive){
      return true
    }

    return this.router.navigate(['']);
  }

}
