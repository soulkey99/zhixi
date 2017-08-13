import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class QuestionService {

  constructor(
      private http: Http,
      @Inject('apiUrl') private apiUrl,
  ) { }

  getEid(q_id: String): Promise<any>{
      let headers = new Headers({ 
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.apiUrl + '/webrest/s/study/question/' + q_id + '/exercise?start=1&limit=1', options)
                  .toPromise()
                  .then(r => r.json())
                  .catch(this.handleError);
  }

  getQuestionSteps(e_id: String): Promise<any> {
      let headers = new Headers({ 
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.apiUrl + '/webrest/s/study/exercise/' + e_id + '/steps', options)
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

// // routing

// import { LearnComponent } from './learn/learn.component';
// import { DoHomeworkComponent } from './do-homework/do-homework.component';
// import { QuestionComponent } from './exercise/question/question.component';

//       ,{ path: 'learn', component: LearnComponent }
//       ,{ path: 'doHomework', component: DoHomeworkComponent }
//       ,{ path: '', component: QuestionComponent}


// // module

// import { LearnComponent } from './learn/learn.component';
// import { DoHomeworkComponent } from './do-homework/do-homework.component';
// import { QuestionComponent } from './exercise/question/question.component';

//     IndexSComponent,LearnComponent, DoHomeworkComponent, QuestionComponent



