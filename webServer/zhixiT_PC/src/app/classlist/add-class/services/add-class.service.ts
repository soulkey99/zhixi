import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'
import { TextbookInfo } from '../model/textbookInfo.model'
import { GetTextbookListRes } from './response/getTextbookListRes'
import { AddClassRes } from './response/addClassRes'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AddClassService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http, @Inject('apiUrl') private apiUrl) { }

  getTextbookList(): Promise<GetTextbookListRes> {
    const url = `${this.apiUrl}/webrest/t/vgList`;

    return this.http.get(url, this.options)
      .toPromise()
      .then(res => {
        console.log(res.json());
        return res.json() as GetTextbookListRes;
      })
      .catch(this.handleError);
  }

  addClass(name: string, grade: string, subject: string, version: string, duration: string, startAt: string, endAt: string, week: string, num: string, noon: string, hour: string, minute: string): Promise<AddClassRes> {
    const url = `${this.apiUrl}/webrest/t/school/my/class`;

    return this.http.post(url, JSON.stringify({ name: name, grade: grade, subject: subject, version: version, duration: duration, startAt: startAt, endAt: endAt, week: week, week_num: num, noon: noon, hour: hour, minute: minute }), this.options)
      .toPromise()
      .then(res => {
        console.log(res.json());
        return res.json() as AddClassRes;
      })
      .catch(this.handleError);

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error.json());
    alert(error.json().msg);
    return Promise.reject((error.code + error.code) || error);
  }
}
