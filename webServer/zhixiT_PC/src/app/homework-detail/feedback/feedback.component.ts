import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {

  _feedbackContent: string = "";

  @Input() set feedbackContent(feedbackContent:any){
    this._feedbackContent = feedbackContent;
    this.updateView();
  };

  @Output() hideFeedback = new EventEmitter<string>();
  @Output() sendFeedback = new EventEmitter<string>();

  s_avatar: any;
  s_nick: any;
  percent: any;

  constructor() { }

  ngOnInit() {
    this._feedbackContent = "";
  }

  updateView(){
  }

  send_click(content:string){
    this.sendFeedback.emit(content);
  }

  hideFeedbackDiv(){
    this.hideFeedback.emit();
  }
}
