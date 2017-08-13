import { Component, OnInit, Input, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { } from '@types/mathjax';
import { StatService } from './stat.service';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { HomeworkDetailComponent } from '../homework-detail/homework-detail.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';

import {
  ScheduleHomeworkStat,
  WrongQuestionInfo,
  StudentStat,
  SimpleStudentInfo,
  SworkItem,
  ScheduleInfo
} from './model';

import { Util } from '../../assets/Util';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css'],
  providers: [StatService]
})
export class StatComponent implements OnInit {
  schedule_list: ScheduleInfo[];
  stat: ScheduleHomeworkStat;
  unfinished_student: SimpleStudentInfo[];
  wrong_question_stat: WrongQuestionInfo[];
  wrong_question_info: WrongQuestionInfo;
  additional_swork: SworkItem[];
  all_student_stat: StudentStat[];
  util: Util;
  dialogRef: MdDialogRef<HomeworkDetailComponent>;
  selected_schedule_id: string;
  current_wrong_q_id: string;
  finished_percent: number;
  @ViewChild('modalcontent') modalcontent: ElementRef;


  constructor(private router: Router, private statService: StatService, private route: ActivatedRoute, private location: Location,
    private dialog: MdDialog,
    private modalService: NgbModal,
    public viewContainerRef: ViewContainerRef,
    private localS: SessionStorageService) {
    this.schedule_list = [];
    this.reset();
    this.util = new Util();
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['class_id']) {
        this.load(params['class_id']);
      }
    });
  }

  reset() {
    this.stat = new ScheduleHomeworkStat();
    this.unfinished_student = [];
    this.wrong_question_stat = [];
    this.additional_swork = [];
    this.all_student_stat = [];
    this.finished_percent = 0;
    this.wrong_question_info = new WrongQuestionInfo({});
    this.current_wrong_q_id = "";
  }

  load(class_id: string) {
    this.statService.getHistoryScheduleList(class_id).then(list => {
      this.schedule_list = list;
      if (list.length > 0) {
        this.selected_schedule_id = list[0].schedule_id;
        this.loadStat(this.selected_schedule_id);
      } else {
        this.open(this.modalcontent);
      }
      //
    });
  }

  onScheduleChange(schedule_id: string) {
    // console.log('on select change: ' + schedule_id);
    this.reset();
    this.loadStat(schedule_id);
  }


  loadStat(schedule_id: string) {
    this.statService.getScheduleHomeworkStat(schedule_id).then(stat => {
      this.stat = stat;
      if (stat.student_total == 0) {
        this.finished_percent = 0;
      } else {
        this.finished_percent = Number.parseInt(((stat.student_finished / stat.student_total) * 100).toFixed(0));
      }
      // {
      //   let pb = document.getElementById("progressbar");
      //   console.log(pb);
      //   pb.addEventListener('mdl-componentupgraded', function () {
      //     console.log('update');
      //     this.MaterialProgress.setProgress(88);
      //   });
      // }
      for (let i = 0; i < stat.question_stat.length; i++) {
        stat.question_stat[i].seq = i + 1;
      }
      if (stat.question_stat.length > 0) {
        this.current_wrong_q_id = stat.question_stat[0].q_id;
        this.onWrongQuestion(this.current_wrong_q_id);
      }
    });
    this.statService.getSworkList(schedule_id, 'schedule', 'timeout,timeoutFinished').then(list => this.unfinished_student = list);
    this.statService.getSworkList(schedule_id, 'additional').then(list => this.additional_swork = list);
    this.statService.getStudentStat(schedule_id).then(list => this.all_student_stat = list);
  }

  onWrongQuestion(q_id: string) {
    this.current_wrong_q_id = q_id;
    this.statService.getWrongQuestionInfo(this.selected_schedule_id, q_id).then(info => {
      this.wrong_question_info = info;
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'question_content']);
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'question_content']);
    });
    // console.log(`wrong question: ${q_id}`);
  }
  onWrongQuestionChanged(q_id: string) {
    console.log('on changed: q_id: ' + q_id);
  }

  onStudentStatisticClick(s_id: string, type: string) {
    this.onStudentlClick(s_id, '', type);
  }

  onStudentAdditionalClick(s_id: string, s_work: string, type: string) {
    this.onStudentlClick(s_id, s_work, type);
  }

  onStudentlClick(s_id: string, s_work: string, type: string) {

    this.localS.store("feedback_schedule_id", this.selected_schedule_id);
    this.localS.store("feedback_s_id", s_id);
    this.localS.store("feedback_s_work", s_work);
    this.localS.store("feedback_type", type);

    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;
    this.dialogRef = this.dialog.open(HomeworkDetailComponent, config);
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;

      this.localS.clear("feedback_schedule_id");
      this.localS.clear("feedback_s_id");
      this.localS.clear("feedback_s_work");
      this.localS.clear("feedback_type");

      if (result == "addMoreHomework") {

        this.router.navigate(['selectBook', this.selected_schedule_id, s_id, this.stat.class_id]);
      }
    });
  }
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.location.back();
    }, (reason) => {
      this.location.back();
    });
  }


}
