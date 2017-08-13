import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IndexSService } from '../index-s/index-s.service';
import { Choice, SubQuestion } from '../index-s/index-s.model';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import { QuestionComponent } from './question/question.component';
import { MdlDialogService, MdlDialogReference, MdlSnackbarService } from 'angular2-mdl';

@Component({
  selector: 'app-select-question',
  templateUrl: './select-question.component.html',
  styleUrls: ['./select-question.component.css']
})
export class SelectQuestionComponent implements OnInit {

  dialogRef: MdDialogRef<QuestionComponent>;

  chapters = [];
  questions = [];
  cha_id: string = "";
  isShow: boolean = false;
  proportion = "";
  finished = 0;
  total = 0;
  showProp = false;
  startQuestion = "questionList";

  mainQuestion = "";
  mainQuestionDiff = 0;
  answeredQuestions: SubQuestion[] = [];
  nowQuestions: SubQuestion[] = [];
  choice_id = "";
  selectedChoice: Choice;

  e_id = "";
  sec_id = "";
  nowQ_id = "";
  mainQ_id = "";

  percent = "";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private indexSService: IndexSService,
    public viewContainerRef: ViewContainerRef,
    private dialog: MdDialog,
    private localS: SessionStorageService,
    private mdlDialogService: MdlDialogService,
    private mdlSnackbarService: MdlSnackbarService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.filter(function (value: Params, index: number) {
      if(index == 0){
        return true;
      }
    }).forEach((params: Params) => {
        this.indexSService.loadChapter(params["ver_id"]).then(chapters => {
          this.chapters = chapters.list;
          if(params["sec_id"] != "" && params["sec_id"] != null && params["sec_id"] != undefined){
            for(let i=0;i<this.chapters.length;i++){
              for(let j=0;j<this.chapters[i].sections.length;j++){
                if(this.chapters[i].sections[j].sec_id == params["sec_id"]){
                  this.showChapter(this.chapters[i]);
                  this.selectChapter(this.chapters[i].sections[j]);
                  break;
                }
              }
            }
          }
        })
    });
  }

  selectChapter(section): void {
    this.startQuestion = "questionList";
    this.sec_id = section.sec_id;
    this.indexSService.loadQuestion(section.sec_id,1,9999).then(questions => {
      this.questions = questions.list;
      this.total = this.questions.length;
      this.finished = 0;
      for(let i=0;i<this.questions.length;i++){
        if(this.questions[i].finished){
          this.finished += 1;
        }
      }
      this.proportion = (this.finished/this.total*100).toFixed(2);
      this.showProp = true;
    })
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
  }

  showChapter(chapter): void {
    if(this.cha_id == chapter.cha_id){
      this.isShow = !this.isShow;
    }else{
      this.isShow = true;
      this.cha_id = chapter.cha_id;
    }
  }

  startAnswerQuestion(question): void {
    this.startQuestion = "startQuestion";
    this.indexSService.createAnswerStep(this.sec_id, question.q_id).then(res => {
      this.e_id = res.e_id;
    });
    this.mainQ_id = question.q_id;
    this.answeredQuestions = [];
    this.nowQuestions = [];
    this.mainQuestion = question.content.split('$$').join('$');
    this.mainQuestionDiff = question.difficulty;
    this.indexSService.loadNextQuestion(question.next).then(nextQuestion => {
      this.nowQuestions.push(nextQuestion.info);
      this.answeredQuestions.push(nextQuestion.info);
      this.nowQ_id = nextQuestion.info.q_id;
      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
    })
  }

  selectChoice(choice): void {
    this.selectedChoice = choice;
    this.choice_id = choice.choice_id;
  }

  subChoice(): void {
    if(this.choice_id == ""){
      this.mdlDialogService.alert('请选择正确的选项！');
    }else{
      this.indexSService.saveAnswerStep(this.selectedChoice.choice_id, this.nowQuestions[0].q_id, this.e_id).then(res => {
        if(this.selectedChoice.action == "result"){
          this.indexSService.loadExerciseResult(this.e_id).then(res => {
            this.startQuestion = "result";
            this.percent = res.info.percent;
          });
        }else{
          if(this.selectedChoice.correct){
            this.mdlDialogService.alert('恭喜答对了！');
            //this.answeredQuestions.push(this.nowQuestions[0]);
            this.indexSService.loadNextQuestion(this.selectedChoice.next).then(nextQuestion => {
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
              this.mdlDialogService.alert(this.selectedChoice.hint);
            }else{
              this.mdlDialogService.alert('请重新审题！');
            }
          }
        }
      });
    }
  }

  oldQuestion(oldQuestion): void {
    this.nowQuestions[0] = oldQuestion;
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
  }

  questionClick(q_id: any){
    this.localS.store("question_q_id", q_id);

    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;
    this.dialogRef = this.dialog.open(QuestionComponent, config);
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;

      this.localS.clear("question_q_id");

      // if (result == "addMoreHomework") {

      //   this.router.navigate(['selectBook', "this.selected_schedule_id, s_id, this.stat.class_id"]);
      // }
    });
  }

  gotoNextQuestion(): void {
    this.indexSService.loadNextMainQuestion(this.sec_id, this.mainQ_id).then(res => {
      if (res.info.q_id == undefined) {
        this.mdlDialogService.alert('本章题目已全部做完！');
        this.indexSService.loadNextSection(this.sec_id).then(res => {
          if (res.info.sec_id == "") {
            this.mdlDialogService.alert('本册题目已全部做完！');
          } else {
            this.startAnswerQuestion(res.info);
          }
        });
      } else {
        this.startAnswerQuestion(res.info);
      }
    });
  }
}
