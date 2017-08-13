import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/from';

@Injectable()
export class IndexSService {

    constructor(
        private http: Http,
        @Inject('apiUrl') private apiUrl
    ) { }

    loadBooks(ver: string, grade: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/study/books?start=1&limit=9999&version='+ ver + '&grade=' + grade + '&subject=数学', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadChapter(ver_id:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/study/version/'+ ver_id +'/catalog', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadQuestion(sec_id:string, start: number, limit: number): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/study/section/'+ sec_id +'/question?start=' + start + '&limit=' + limit, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadBookInfo(ver_id:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/study/version/'+ ver_id + '/detail', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadNextQuestion(next_id:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/study/question/'+ next_id, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    createAnswerStep(sec_id: string,q_id: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/s/study/exercise', {
                        sec_id: sec_id,
                        q_id: q_id
                    }, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    saveAnswerStep(choice_id: string,q_id: string,e_id: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/s/study/exercise/'+ e_id +'/check', {
                        choice_id: choice_id,
                        q_id: q_id
                    }, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadExerciseResult(e_id:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/study/exercise/'+ e_id + '/result', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadNextMainQuestion(sec_id:string,q_id:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/study/section/'+ sec_id +'/next?q_id='+ q_id, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadNextSection(sec_id:string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/rest/s/study/section/'+ sec_id +'/nextSection', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadStatisticsInfo(): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/stat', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadJoinedClasses(): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/class?start=1&limit=999', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadBoundParents(): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/parents?start=1&limit=999', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    joinClass(class_id: string,msg: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/s/class/'+ class_id +'/join', {
                        msg: msg
                    }, options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    loadUserInfo(): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.apiUrl + '/webrest/s/info', options)
                    .toPromise()
                    .then(r => r.json())
                    .catch(this.handleError);
    }

    editStudentInfo(name: string,nick: string,school: string,grade: string,version: string): Promise<any> {
        let headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/webrest/s/info', {
                        name: name,
                        nick: nick,
                        school: school,
                        grade: grade,
                        version: version
                    }, options)
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