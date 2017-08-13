import { Component, OnInit, ViewContainerRef, } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { QuestionService } from './question.service';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  providers: [QuestionService]
})
export class QuestionComponent {

  _data: any = {};

  question: any;
  questionContent: string;
  percent: number;
  steps: any;
  options: any;
  q_id: string;

  constructor(
    private localS: SessionStorageService,
    private service: QuestionService,
    public dialogRef: MdDialogRef<QuestionComponent>
    ) { }

  ngOnInit() {
    this._data = {};
    this.steps = [];
    this.options = [];
    this.question = {};
    this.questionContent = "";

    // this.getQuestionDetail("580848489205d5737cf0a119", "57874fd886bd1c83791522bf");
    //https://api.test.zx.soulkey99.com/rest/t/swork/580848489205d5737cf0a119/question/57874fd886bd1c83791522bf/steps

    this.q_id = this.localS.retrieve("question_q_id");

    this.getEid(this.q_id);
  }

  updateView () {
    if(this._data.step!=undefined && this._data.step.length > 0){
      console.log(this._data);
      this.question = this._data.step[0];
      console.log(this.question);
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

  hideDiv() {
    this.dialogRef.close("close");
  }

  //点击查看详情
  // questionDetail(item: any){
  //   // this.showFeedback = false;
  //   // this.showQuestions = true;

  //   this.getQuestionDetail(item.swork_id, item.q_id);
  // }

  getEid(q_id:string){
    this.service.getEid(q_id).then(result=>{
      if(result["code"]=="900"){
        var items = result["list"];
        if(items.length>0){
          var item = items[0];
          this.getQuestionDetail(item.e_id);
        }
        else{
          alert("获取eid失败");
        }
      }
      else{
        alert(result["msg"]);
      }
    });
  }
  
  //查询答题步骤
  getQuestionDetail(q_id: String) {
    this.service.getQuestionSteps(q_id).then(result => {
      if(result["code"]=="900"){
        this._data = result["info"];
        this.updateView();
        console.log(result);
      }
      else{
        alert(result["msg"]);
      }
    });
  }
}
