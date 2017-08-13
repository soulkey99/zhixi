import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MdDialogRef } from '@angular/material';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import { HomeworkQuestionDetailService } from './homework-question-detail.service';


@Component({
  selector: 'app-homework-question-detail',
  templateUrl: './homework-question-detail.component.html',
  styleUrls: ['./homework-question-detail.component.css'],
  providers: [HomeworkQuestionDetailService]
})
export class HomeworkQuestionDetailComponent implements OnInit {

  _data: any = {};

  question: any;
  questionContent: string;
  percent: number;
  steps: any;
  options: any;

  swork_id: String;
  q_id: String;

  constructor( 
    private service: HomeworkQuestionDetailService,
    private location: Location,
    private localS: SessionStorageService,
    public dialogRef: MdDialogRef<HomeworkQuestionDetailComponent>
) { }

  ngOnInit() {  
    this._data = {};
    this.steps = [];
    this.options = [];
    this.question = {};
    this.questionContent = "";

    this.swork_id = this.localS.retrieve("homework_question_swork_id");
    this.q_id = this.localS.retrieve("homework_question_q_id");

    this.getQuestionSteps();
  }


  getQuestionSteps(){
    this.service.getQuestionSteps(this.swork_id, this.q_id).then(result=>{
      this._data = result.info;
      this.updateView();
    });

  }

  updateView () {
    if(this._data.step!=undefined && this._data.step.length > 0){
      this.question = this._data.step[0];
      this.questionContent = this.question.content;
      var arr = this._data.step.slice(1, this._data.step.length);
      for(var i=0;i<arr.length;i++){
        var correct = false;
        var choice_id = arr[i].choice_id;
        var choices = arr[i].choice;
        
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
