import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HomeworkDetailService {

    constructor(
        private http: Http,
        @Inject('apiUrl') private apiUrl
    ) { }

    loadHomeworkDetails(schedule_id: String): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/t/schedule/'+ schedule_id +'/homework/stat', options)
                    .toPromise()
                    .then(r => {
                        console.log(r);
                        r.json();
                    })
                    .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error.json());
        alert(error.json().msg);
        return Promise.reject((error.code+error.code) || error);
    }
    
}