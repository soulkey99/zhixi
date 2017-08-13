import { Injectable, Inject }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
}                           from '@angular/router';
import { LoginService }      from './login/login.service';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  isLogin = false;

  constructor(private loginService: LoginService, private router: Router, private localS: SessionStorageService, private http: Http, @Inject('apiUrl') private apiUrl) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let userInfoUrl = "/webrest/s/info";
    if(localStorage.getItem("userType") == "t"){
      userInfoUrl = "/webrest/t/info";
    }
    let headers = new Headers({ 
        'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    let data = this.http.get(this.apiUrl + userInfoUrl, options)
                    .toPromise()
                    .then(r => {
                      localStorage.setItem("userInfo",r.json().info);
                      if(localStorage.getItem("userType") == "s"){
                        localStorage.setItem("avatar",r.json().info.avatar);
                        localStorage.setItem("name",r.json().info.name);
                        localStorage.setItem("nick",r.json().info.nick);
                        localStorage.setItem("phone",r.json().info.phone);
                        localStorage.setItem("userID",r.json().info.userID);
                        localStorage.setItem("ver",r.json().info.userInfo.version);
                        localStorage.setItem("grade",r.json().info.userInfo.grade);
                        localStorage.setItem("city",r.json().info.userInfo.city);
                        localStorage.setItem("school",r.json().info.userInfo.school);
                      }
                      return r.json();
                    })
                    .catch(this.handleError);
    data.then(res => {
      if (res.code == 900) { 
        this.isLogin = true;
      } else {
        this.router.navigate(['/login']);
      }
    });                
    
    // Store the attempted URL for redirecting;
    this.localS.store("redirectUrl",url);
    // Create a dummy session id
    let sessionId = 123456789;

    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
      queryParams: { 'session_id': sessionId },
      fragment: 'anchor'
    };
    // Navigate to the login page with extras
    return this.isLogin;
  }

  private handleError(error: any): Promise<any> {
      console.error('An error occurred', error.json());
      alert(error.json().msg);
      return Promise.reject(error.json() || error);
  }
}