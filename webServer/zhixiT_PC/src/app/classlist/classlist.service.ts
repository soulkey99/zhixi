import { Injectable, Inject } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Base64 } from 'js-base64';
import { StudentInfo, ClassItem } from './classlist.model';

import 'rxjs/add/operator/toPromise';
const qs = require('qs');

@Injectable()
export class ClasslistService {

    constructor(
        private http: Http,
        @Inject('apiUrl') private apiUrl
    ) { }

    private api(path, query = {}, method = 'get', body = {}): Promise<any> {
        let opt = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
        let res = null;
        let url = `${this.apiUrl}${path}`;
        if (Object.keys(query).length > 0) {
            url += `?${qs.stringify(query)}`;
        }
        switch (method) {
            case 'get':
                res = this.http.get(url, opt);
                break;
            case 'post':
            console.log(body);
            console.log("post--------------"+JSON.stringify(body));
                res = this.http.post(url, JSON.stringify(body), opt);
                break;
        }
        return res.toPromise().then(r => r.json()).catch(this.handleError);
    }

    loadList(): Promise<ClassItem[]> {
        console.log("load class list");
        return this.api(`/webrest/t/class`, {
            limit: '10000'
        }).then(r => r.list as ClassItem[]);
    }

    getClassDetails(class_id: string): Promise<any> {
        console.log("getClassDetails");
        return this.api(`/webrest/t/class/${class_id}`).then(r => r.info);
    }

    getClassMates(class_id: string): Promise<StudentInfo[]> {
        console.log("getClassMates, class_id=" + class_id);

        return this.api(`/webrest/t/class/${class_id}/student`, {
            limit: '10000'
        }).then(r => {
            let studentList = [];
            r.list.forEach(student => {
                let s = new StudentInfo();
                s.s_avatar = student.avatar;
                s.s_id = student.userID;
                s.s_name = student.name;
                s.s_nick = student.nick;

                studentList = [...studentList, s];
            });
            return studentList;
        });
    }

    getNewClassMates(class_id: string): Promise<StudentInfo[]> {
        console.log("getNewClassMates, class_id=" + class_id);
        return this.api(`/webrest/t/class/${class_id}/joinList`, {
            status: 'pending',
            limit: '10000'
        }).then(r => r.list as StudentInfo[]);

    }


    removeStudent(class_id:string, s_id: string): Promise<any> {
        console.log("removeStudent");
        return this.api(`/webrest/t/class/${class_id}/student/del`,{},'post', {
            s_id
        }).then(r => {
            console.log("removeStudent: "+r.code);
            return r.code;
        });
    }

    acceptStudent(cs_id: string, status:string, reason:string): Promise<any> {
        console.log("acceptStudent");
        return this.api(`/webrest/t/classJoin/${cs_id}`,{},'post', {
            status,
            reason
        }).then(r => {
            console.log("acceptStudent: "+r.code);
            return r.code;
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error.json());
        alert(error.json().msg);
        return Promise.reject((error.code + error.code) || error);
    }
}