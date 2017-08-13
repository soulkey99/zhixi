import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../app.model';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SetHomeworkService {

    constructor(
        private http: Http,
        @Inject('apiUrl') private apiUrl
    ) { }

    loadBooks(ver: string, grade: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/t/study/books?start=1&limit=9999&version='+ ver + '&grade=' + grade + '&subject=数学', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadChapter(ver_id:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/t/study/version/'+ ver_id +'/catalog', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadQuestion(sec_id:string, start: number, limit: number): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/rest/t/study/section/'+ sec_id +'/question?start=' + start + '&limit=' + limit, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadBookInfo(ver_id:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/rest/:userType/study/version/'+ ver_id + '/detail', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadSelectedQuestion(q_ids:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/t/study/questions?q_id='+ q_ids, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadClasstime(class_id:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/t/class/'+ class_id + '/homework?sort=asc&status=waiting,draft', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadTimeSelectedQuestions(schedule_id: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/t/schedule/'+ schedule_id +'/homework', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    saveQuestionsFirst(schedule_id: string,q_ids: string,endAt: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/t/schedule/'+ schedule_id + '/homework', {
                        q_id: q_ids,
                        endAt: endAt
                    }, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    saveQuestionsSecond(schedule_id: string, s_id: string, q_ids: string, endAt: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/t/schedule/'+ schedule_id +'/student/'+ s_id +'/homework/	', {
                        q_id: q_ids,
                        endAt: endAt
                    }, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadClassInfo(class_id: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/t/class/'+ class_id, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadStudentInfo(s_id: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/t/student/'+ s_id + '/info', options)
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