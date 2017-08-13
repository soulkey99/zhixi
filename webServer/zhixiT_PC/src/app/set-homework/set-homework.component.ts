import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SetHomeworkService } from './set-homework.service';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { SelectedQuestionComponent } from './selected-question/selected-question.component';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import {  } from '@types/mathjax';

@Component({
  selector: 'app-set-homework',
  templateUrl: './set-homework.component.html',
  styleUrls: ['./set-homework.component.css']
})

export class SetHomeworkComponent implements OnInit {

  chapters = [];
  questions = [];
  dialogRef: MdDialogRef<SelectedQuestionComponent>;
  q_ids = [];
  homework_type = "";
  name = "";
  cover = "";
  endAt = "";
  cha_id = "";
  isShow = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private setHomeworkService: SetHomeworkService,
    private dialog: MdDialog,
    public viewContainerRef: ViewContainerRef,
    private localS: SessionStorageService
  ) { }

  ngOnInit() {
    this.homework_type = this.localS.retrieve("homework_type");
    this.cover = this.localS.retrieve("cover");
    if(this.localS.retrieve("q_ids")!= null && this.localS.retrieve("q_ids")!=""){
      this.q_ids = this.localS.retrieve("q_ids");
    }
    this.activatedRoute.params.filter(function (value: Params, index: number) {
      console.log(value);
      if(index == 0){
        return true;
      }
    }).forEach((params: Params) => {
        this.setHomeworkService.loadChapter(params["ver_id"]).then(chapters => {
          this.chapters = chapters.list;
        })
    });
    this.loadTimeSelectedQuestions();
    if(this.localS.retrieve("homework_type") == "first"){
      this.setHomeworkService.loadClassInfo(this.localS.retrieve("class_id")).then(classInfo => {
        this.name = classInfo.info.class_name;
      })
    }else{
      this.setHomeworkService.loadStudentInfo(this.localS.retrieve("s_id")).then(studentInfo => {
        this.name = studentInfo.info.s_name;
      })
    }
  }

  selectChapter(section): void {
    console.log(section.sec_id);
    this.setHomeworkService.loadQuestion(section.sec_id,1,9999).then(questions => {
      this.questions = questions.list;
    })
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'content']);
  }

  openSelectedQuestion() {
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;
    this.dialogRef = this.dialog.open(SelectedQuestionComponent, config);
    this.dialogRef.afterClosed().subscribe(result => {
      this.initQuestionStatus();
      this.dialogRef = null;
    });
  }

  initQuestionStatus(): void {
    if(this.localS.retrieve("q_ids") != null){
      if(this.localS.retrieve("q_ids").length == 0){
        this.q_ids = [];
      }else{
        this.q_ids = this.localS.retrieve("q_ids");
      }
      for(let i=0;i<this.questions.length;i++){
        if(this.q_ids.indexOf(this.questions[i].q_id) >= 0){
          this.questions[i].isAdd = false;
        }else{
          this.questions[i].isAdd = undefined;
        }
      }
    }
  }
  
  addQuestion(question): void {
    if(this.q_ids.indexOf(question.q_id) >= 0){
      this.q_ids.splice(this.q_ids.indexOf(question.q_id),1);
      question.isAdd = undefined;
    }else{
      this.q_ids.push(question.q_id);
      question.isAdd = false;
    }
    this.localS.store("q_ids",this.q_ids);
  }

  loadTimeSelectedQuestions(): void {
    if(this.localS.retrieve("homework_type") == "first"){
      this.setHomeworkService.loadTimeSelectedQuestions(this.localS.retrieve("schedule_id")).then(questions => {
        if(questions.list.length > 0){
          for(let i=0;i<questions.list.length;i++){
            if(this.q_ids.indexOf(questions.list[i].q_id)<0){
              this.q_ids.push(questions.list[i].q_id);
            }
          }
          this.localS.store("q_ids",this.q_ids);
        }
      })
    }
  }

  saveQuestions(): void {
    if(this.localS.retrieve("q_ids") == null || this.localS.retrieve("q_ids").length <= 0){
      alert("请选择题目");
    }else if(this.endAt == ""){
      alert("请选择作业截止日期");
    }else if(new Date(this.endAt).getTime() <= new Date().getTime()){
      alert("请选择正确的作业截止日期");
    }else{
      if(this.localS.retrieve("homework_type") == "first"){
        this.setHomeworkService.saveQuestionsFirst(this.localS.retrieve("schedule_id"),this.localS.retrieve("q_ids").join(","),this.endAt).then(res => {
          if(res.code == 900){
            this.q_ids = [];
            this.localS.store("q_ids",[]);
            alert("已成功布置作业");
            this.router.navigate(['indexT/classmanagement']);
          }
        })
      }else if(this.localS.retrieve("homework_type") == "second"){
        this.setHomeworkService.saveQuestionsSecond(this.localS.retrieve("schedule_id"), this.localS.retrieve("s_id"), this.localS.retrieve("q_ids").join(","), this.endAt).then(res => {
          if(res.code == 900){
            this.q_ids = [];
            this.localS.store("q_ids",[]);
            alert("已成功补留作业");
            this.router.navigate(['indexT/classmanagement']);
          }
        })
      }
    }
  }

  moreBooks(): void {
    if(this.homework_type == "first"){
      this.router.navigate(['indexT/selectBook',this.localS.retrieve("class_id")]);
    }else if(this.homework_type == "second"){
      this.router.navigate(['indexT/selectBook',this.localS.retrieve("schedule_id"), this.localS.retrieve("s_id"), this.localS.retrieve("c_id")]);
    }
  }

  saveEndat(): void {
    this.localS.store("endAt",this.endAt);
  }

  showChapter(chapter): void {
    if(this.cha_id == chapter.cha_id){
      this.isShow = !this.isShow;
    }else{
      this.isShow = true;
      this.cha_id = chapter.cha_id;
    }
  }
 
}