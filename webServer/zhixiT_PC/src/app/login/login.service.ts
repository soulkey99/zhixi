import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../app.model';
import 'rxjs/add/operator/toPromise';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';

var jsSHA = require("jssha");

@Injectable()
export class LoginService {

    constructor(
        private http: Http,
        @Inject('apiUrl') private apiUrl,
        private localS: SessionStorageService
    ) { }

    login(userPhone: string,userPwd: string,userType: string): Promise<any> {
        let sha256 = new jsSHA("SHA-256", "TEXT");
        sha256.update(userPwd);
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/'+ userType +'/login', JSON.stringify({phone: userPhone, passwd: sha256.getHash("HEX").toUpperCase()}), options)
                    .toPromise()
                    .then(()=> {
                        r => r.json();
                        this.localS.store("isLoggedIn",true);
                    })
                    .catch(this.handleError);
    }

    sendMsg(userPhone: string): Promise<any> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/t/smscode', JSON.stringify({phone: userPhone}), options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    regedit(userPhone: string, passwd: string, msgCode: string): Promise<any> {
        let sha256 = new jsSHA("SHA-256", "TEXT");
        sha256.update(passwd);
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/t/register', JSON.stringify({phone: userPhone, passwd: sha256.getHash("HEX").toUpperCase(), smscode: msgCode}), options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    resetPwd(userPhone: string, passwd: string, msgCode: string): Promise<any> {
        let sha256 = new jsSHA("SHA-256", "TEXT");
        sha256.update(passwd);
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/t/resetPwd', JSON.stringify({phone: userPhone, newPwd: sha256.getHash("HEX").toUpperCase(), smscode: msgCode}), options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error.json());
        alert(error.json().msg);
        return Promise.reject(error.json() || error);
    }
    
}