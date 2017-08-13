import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class HomeworkQuestionDetailService {

  constructor(
        private http: Http,
        @Inject('apiUrl') private apiUrl,) { }

  getQuestionSteps(swork_id: String, q_id: String): Promise<any> {
      let headers = new Headers({ 
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.apiUrl + '/webrest/s/homework/' + swork_id + '/question/' + q_id + '/steps', options)
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
