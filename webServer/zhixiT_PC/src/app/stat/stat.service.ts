/**
 * Created by MengLei on 2016-11-14.
 */
import {Injectable, Inject} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {
  ScheduleHomeworkStat,
  StudyQuestion,
  SimpleStudentInfo,
  WrongQuestionInfo,
  SworkItem,
  StudentStat,
  ScheduleInfo
} from './model';
const qs = require('qs');

@Injectable()
export class StatService {
  constructor(private  http: Http,
              @Inject('apiUrl') private apiUrl) {
  }

  private api(path, query = {}, method = 'get', body = {}): Promise<any> {
    let opt = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
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
        res = this.http.post(url, JSON.stringify(body), opt);
        break;
    }
    return res.toPromise().then(r => r.json()).catch(this.handleError);
  }

  getHistoryScheduleList(class_id: string): Promise<ScheduleInfo[]> {
    return this.api(`/webrest/t/class/${class_id}/homework`, {
      status: 'assigned',
      limit: '10000'
    }).then(r => r.list as ScheduleInfo[]);
  }

  getScheduleHomeworkStat(schedule_id: string): Promise<ScheduleHomeworkStat> {
    return this.api(`/webrest/t/schedule/${schedule_id}/homework/stat`).then(r => r.info as ScheduleHomeworkStat);
  }

  getQuestionDetail(q_id: string): Promise<StudyQuestion> {
    return this.api(`/webrest/t/study/question/${q_id}`).then(r => r.info as StudyQuestion);
  }

  getWrongQuestionInfo(schedule_id: string, q_id: string): Promise<WrongQuestionInfo> {
    return this.api(`/webrest/t/schedule/${schedule_id}/homework/stat/question/${q_id}/wrong`).then(r => r.info as WrongQuestionInfo);
  }

  getSworkList(schedule_id: string, type: string = null, status: string = null): Promise<SworkItem[]> {
    let query = {};
    if (type) {
      query['type'] = type;
    }
    if (status) {
      query['status'] = status;
    }
    return this.api(`/webrest/t/schedule/${schedule_id}/sworkList`, query).then(r => r.list as SworkItem[]);
  }

  getStudentStat(schedule_id: string): Promise<StudentStat[]> {
    return this.api(`/webrest/t/schedule/${schedule_id}/homework/stat/student`).then(r => r.list as StudentStat[]);
  }

  private handleError(error: any): Promise<any> {
    console.error(`An error occured: ${error.json()}`);
    alert(error.json().msg);
    return Promise.reject(error.json() || error);
  }
}
