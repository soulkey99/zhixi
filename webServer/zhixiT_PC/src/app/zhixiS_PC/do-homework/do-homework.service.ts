import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

@Injectable()
export class DoHomeworkService {

  constructor(
        private http: Http,
        @Inject('apiUrl') private apiUrl) { }


  getNextQuestion(swork_id: string): Promise<any> { 
      let headers = new Headers({ 
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({ headers: headers });
      return this.http.get(this.apiUrl + '/webrest/s/homework/' + swork_id + "/next", options)
                  .toPromise()
                  .then(r => r.json())
                  .catch(this.handleError);
  }

  getQuestionChoice(q_id: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/study/question/'+ q_id, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
  }
  getNextChoice(next_id: string): Promise<any> {
      let headers = new Headers({ 
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({ headers: headers });
      return this.http.get(this.apiUrl + '/webrest/s/study/question/' + next_id, options)
                  .toPromise()
                  .then(r => r.json())
                  .catch(this.handleError);
  }

  answerQuestion(swork_id: string, q_id: string, choice_id: string): Promise<any> {
      let headers = new Headers({ 
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.apiUrl + '/webrest/s/homework/' + swork_id + "/question/" + q_id + "/check", {
                      choice_id: choice_id,
                  }, options)
                  .toPromise()
                  .then(r => r.json())
                  .catch(this.handleError);
  }

  getQuestionResult(swork_id: string, q_id: string): Promise<any> {
      let headers = new Headers({ 
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({ headers: headers });
      return this.http.get(this.apiUrl + '/webrest/s/homework/' + swork_id + "/question/" + q_id + "/result", options)
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
