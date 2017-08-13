import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class LearnService {

  
  constructor(
      private http: Http,
      @Inject('apiUrl') private apiUrl,
  ) { }

  getRecently() {
      let headers = new Headers({ 
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.apiUrl + '/webrest/s/recentList?start=1&limit=10000', options)
                  .toPromise()
                  .then(r => r.json())
                  .catch(this.handleError);
  }

  getHomework() {
      let headers = new Headers({ 
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.apiUrl + '/webrest/s/homework?start=1&limit=10000', options)
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
  
  private handleError(error: any): Promise<any> {
      console.error('An error occurred', error.json());
      alert(error.json().msg);
      return Promise.reject(error.json() || error);
  }
}
