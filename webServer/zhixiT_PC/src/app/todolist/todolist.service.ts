import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Base64 } from 'js-base64';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class TodolistService {

    constructor(
        private http: Http,
        @Inject('apiUrl') private apiUrl
    ) { }

    loadList(): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
            //'auth': Base64.encode('access_token=7d6e85d7a411f927043b10bfec45b82f4a490c9573d9dac0')
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/t/todoList', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error.json());
        alert(error.json().msg);
        return Promise.reject((error.code+error.code) || error);
    }
    
}