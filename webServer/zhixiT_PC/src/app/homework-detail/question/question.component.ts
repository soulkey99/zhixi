import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {

  _data: any = {};

  question: any;
  questionContent: string;
  percent: number;
  steps: any;
  options: any;

  @Input() set data(data:any){
    this._data = data;

    if(this._data!={})
      this.updateView();
  };
  get data() {
    return this._data;
  }

  @Output() hideQuestion = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this._data = {};
    this.steps = [];
    this.options = [];
    this.question = {};
    this.questionContent = "";
  }

  hideQuestionDiv(){
    this.hideQuestion.emit();
  }

  updateView () {
    if(this._data.step!=undefined && this._data.step.length > 0){
      this.question = this._data.step[0];
      this.questionContent = this.question.info.content;
      var arr = this._data.step.slice(1, this._data.step.length);
      for(var i=0;i<arr.length;i++){
        var correct = false;
        var choice_id = arr[i].choice_id[0];
        var choices = arr[i].info.choice;
        
        for(var j=0;j<choices.length;j++){
          if(choices[j].correct){
            correct = choice_id==choices[j].choice_id;
            break;
          }
        }

        arr[i].correct = correct;
      }
      this.steps = arr;

      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'MathJax']);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'MathJax']);
    }
  }
}
