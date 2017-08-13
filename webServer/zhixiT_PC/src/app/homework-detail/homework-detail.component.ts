import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { HomeworkDetailService } from './homework-detail.service';
import { Location }               from '@angular/common';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import {  } from '@types/mathjax';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-homework-detail',
  templateUrl: './homework-detail.component.html',
  styleUrls: ['./homework-detail.component.css'],
  providers: [HomeworkDetailService]
})
export class HomeworkDetailComponent implements OnInit {

  schedule_id: String;
  s_id: String;
  s_work: String;
  type: String;

  homeworks: any;
  s_info: any;
  showFeedback: boolean;
  showQuestions: boolean;

  feedbackContent: String;

  data: any;

  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private service: HomeworkDetailService,
    private location: Location,
    private localS: SessionStorageService,
    public dialogRef: MdDialogRef<HomeworkDetailComponent>

  ) { }

  ngOnInit() {

    this.schedule_id = this.localS.retrieve("feedback_schedule_id");
    this.s_id = this.localS.retrieve("feedback_s_id");
    this.s_work = this.localS.retrieve("feedback_s_work");
    this.type = this.localS.retrieve("feedback_type");

    this.showFeedback = false;
    this.showQuestions = false;

    this.s_info = {};
    this.homeworks=[];
    this.feedbackContent = '';
    this.data = {};
    
    if (this.type == "additional") {
      this.getHomeworkAdditional()
    }
    else if (this.type == "statistic") {
      this.getHomework()
    }
  }

  hideDiv() {
    this.dialogRef.close("close");
  }

//作业相关
  //获取作业列表
  getHomework() {
    this.service.getHomework(this.schedule_id, this.s_id).then(json => {
      this.setHomeworkInfo(json);
    });
  }

  //获取作业列表
  getHomeworkAdditional() {
    this.service.getHomeworkAdditional(this.s_work).then(json => {
      this.setHomeworkInfo(json);
    });
  }

  setHomeworkInfo(json:any) {
      this.s_info = json.info;
      this.homeworks = json.info.list;

      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'MathJax']);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'MathJax']);
  }

  //添加更多作业
  addMoreHomework(): void {
    this.dialogRef.close("addMoreHomework");
  }

  //info里的事件
  action(value) {
    if(value=="feedbackHomework"){
      this.showFeedback = true;
      this.showQuestions = false;

      this.getFeedback();
    }
    else if(value=="addMoreHomework"){
      this.dialogRef.close("addMoreHomework");
    }
    else if(value=="selectHomework"){
      this.dialogRef.close("addMoreHomework");
    }
  }

  //点击查看详情
  questionDetail(item: any){
    this.showFeedback = false;
    this.showQuestions = true;

    this.getQuestionDetail(item.swork_id, item.q_id);
  }

//意见反馈相关
  //获取是否有意见反馈
  getFeedback() {
    this.service.getFeedback(this.schedule_id, this.s_id).then(result => {
      if(result['code']=='900'){
        if(result['list'].length > 0) {
          this.feedbackContent = result.list[0].content;
        }
        else {
          this.feedbackContent = "";
        }
      }
      else{
        alert(result['msg']);
      }
    });
  }

  //作业反馈
  feedbackHomework(): void {
    this.showFeedback = true;
    this.showQuestions = false;
    this.getFeedback();
  }

  //隐藏意见反馈
  hideFeedback(): void {
    this.showFeedback = false;
    this.showQuestions = false;
  }

  //发送作业反馈
  sendFeedback(content: String) {
    if(content == ""){
      alert("请输入反馈内容");
      return;
    }

    this.service.sendFeedback(this.schedule_id, this.s_id, content).then(result => {
      if(result["code"]=="900"){
        this.getFeedback();
      }
      else{
        alert(result["msg"]);
      }
    });
  }

//作业详情
  //查询答题步骤
  getQuestionDetail(swork_id: String, q_id: String) {
    this.service.getQuestionSteps(swork_id, q_id).then(result => {
      
      if(result["code"]=="900"){
        this.data = result["info"];
      }
      else{
        alert(result["msg"]);
      }
    });
  }

  //隐藏问题详情
  hideQuestion(): void {
    this.showFeedback = false;
    this.showQuestions = false;
  }
}

