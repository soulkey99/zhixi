import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {

  _s_info: any = {};

  @Input() set s_info(s_info:any){
    this._s_info = s_info;
    this.updateView();
  };
  @Input() type: string = "";
  @Input() homeworks: any = [];

  @Output() action = new EventEmitter<string>();
  @Output() questionDetail = new EventEmitter<any>();

  s_avatar: any;
  s_nick: any;
  percent: any;

  constructor() { }

  ngOnInit() {
    this.s_avatar = "";
    this.s_nick = "";
    this.percent =  "0%";
  }

  updateView(){
    this.s_avatar = this._s_info.s_avatar;
    this.s_nick = this._s_info.s_nick;
    this.percent = Math.round(this._s_info.correct_count / this._s_info.question_total * 100);
  }

  actionF(type:string){
    this.action.emit(type);
  }

  onSelectHomework(item: any): void {
    this.questionDetail.emit(item);
  }
}
