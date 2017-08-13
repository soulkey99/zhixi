import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HomeworkDetailService {

    constructor(
        private http: Http,
        @Inject('apiUrl') private apiUrl,
    ) { }

    getHomework(schedule_id: String, s_id: String): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.apiUrl + '/webrest/t/schedule/' + schedule_id + '/homework/stat/student/' + s_id + '?type=schedule', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    getHomeworkAdditional(swork_id: String): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.apiUrl + '/webrest/t/swork/' + swork_id + '/stat', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    sendFeedback(schedule_id: String, s_id: String, content: String) {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.apiUrl + '/webrest/t/schedule/' + schedule_id + '/student/' + s_id + '/feedback', JSON.stringify({content: content}), options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    getFeedback(schedule_id: String, s_id: String): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.apiUrl + '/webrest/t/schedule/' + schedule_id + '/student/' + s_id + '/feedback', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    getQuestionSteps(swork_id: String, q_id: String): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.apiUrl + '/webrest/t/swork/' + swork_id + '/question/' + q_id + '/steps', options)
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