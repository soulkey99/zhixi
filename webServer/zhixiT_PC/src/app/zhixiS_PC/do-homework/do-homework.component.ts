import { Component, OnInit/*, Input, ViewContainerRef, ViewChild, ElementRef*/ } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
// import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { QuestionComponent } from '../select-question/question/question.component';
import { Choice, SubQuestion } from '../index-s/index-s.model';
import { DoHomeworkService } from './do-homework.service';

@Component({
  selector: 'app-do-homework',
  templateUrl: './do-homework.component.html',
  styleUrls: ['./do-homework.component.css'],
  providers: [DoHomeworkService]
})
export class DoHomeworkComponent implements OnInit {

  // dialogRef: MdDialogRef<QuestionComponent>;

  swork_id : "";
  startQuestion = "questionList";
  mainQuestion = "";
  mainQuestionDiff = 0;
  answeredQuestions: SubQuestion[] = [];
  nowQuestions: SubQuestion[] = [];
  choice_id = "";
  selectedChoice: Choice;
  mainQ_id = "";
  nowQ_id = "";
  percent = "";

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private service: DoHomeworkService,
              // public viewContainerRef: ViewContainerRef,
              // private dialog: MdDialog,
              // private localS: SessionStorageService
              ) { }

  ngOnInit() {
    this.activatedRoute.params.filter(function (value: Params, index: number) {
      if(index == 0){
        return true;
      }
    }).forEach((params: Params) => {
        this.swork_id = params["swork_id"];
        this.getNextQuestion(this.swork_id);
    });
        this.nowQuestions = [];
  }

  getNextQuestion(swork_id: string) {
    this.service.getNextQuestion(swork_id).then(result => {
      if(result.code=="900"){

        if(result.info.q_id ==undefined){
          alert("作业已经做完!");
          this.router.navigate(['indexS/learn/']);
        }
        else{
          this.startQuestion = "startQuestion";
          this.mainQ_id = result.info.q_id;
          this.answeredQuestions = [];
          this.nowQuestions = [];
          this.mainQuestion = result.info.content.split('$$').join('$');
          this.mainQuestionDiff = result.info.difficulty;

          this.getQuestionChoice(result.info);
        }
      }
      else{
        alert(result["msg"]);
      }
    });
  }

  getQuestionChoice(question:any){
    this.service.getQuestionChoice(question.next).then(result=>{
      this.nowQuestions.push(result.info);
      this.answeredQuestions.push(result.info);
      this.nowQ_id = result.info.q_id;
      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
    });
  }

  selectChoice(choice): void {
    this.selectedChoice = choice;
    this.choice_id = choice.choice_id;
  }

  subChoice(): void {
    if(this.choice_id == ""){
      alert('请选择正确的选项！');
    }else{
      this.service.answerQuestion(this.swork_id, this.nowQuestions[0].q_id, this.selectedChoice.choice_id).then(rrr=>{
        if(this.selectedChoice.action == "result"){
        this.service.getQuestionResult(this.swork_id, this.mainQ_id).then(res => {
          this.startQuestion = "result";
          this.percent = res.info.percent;
        });
      }else{
        if(this.selectedChoice.correct){
          alert('恭喜答对了！');
          //this.answeredQuestions.push(this.nowQuestions[0]);
          this.service.getNextChoice(this.selectedChoice.next).then(nextQuestion => {
            this.answeredQuestions.push(nextQuestion.info);
            this.nowQuestions = [nextQuestion.info];
            this.nowQ_id = nextQuestion.info.q_id;
            this.choice_id = "";
            this.selectedChoice = null;
            MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
            MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
          })
        }else{
          if(this.selectedChoice.action == "hint"){
            alert(this.selectedChoice.hint);
          }else{
            alert('请重新审题！');
          }
        }
      }
      });
    }
  }

  getQuestionResult(swork_id: string, q_id: string) {
    this.service.getQuestionResult(swork_id, q_id).then(result => {
      if(result["code"]=="900"){
        // this._data = result["info"];
        // this.updateView();
        console.log(result);
      }
      else{
        alert(result["msg"]);
      }
    });  
  }

  gotoNextQuestion(): void {
    this.getNextQuestion(this.swork_id);
  }























  // onQuestionClick(s_id: string, s_work: string, type: string) {

  //   this.localS.store("question_q_id", "5787472286bd1c83791522b1");
  //   // this.localS.store("feedback_s_id", s_id);
  //   // this.localS.store("feedback_s_work", s_work);
  //   // this.localS.store("feedback_type", type);

  //   let config = new MdDialogConfig();
  //   config.viewContainerRef = this.viewContainerRef;
  //   this.dialogRef = this.dialog.open(QuestionComponent, config);
  //   this.dialogRef.afterClosed().subscribe(result => {
  //     this.dialogRef = null;

  //     // this.localS.clear("feedback_schedule_id");
  //     // this.localS.clear("feedback_s_id");
  //     // this.localS.clear("feedback_s_work");
  //     // this.localS.clear("feedback_type");

  //     // if (result == "addMoreHomework") {

  //     //   this.router.navigate(['selectBook', "this.selected_schedule_id, s_id, this.stat.class_id"]);
  //     // }
  //   });
  // }
}
