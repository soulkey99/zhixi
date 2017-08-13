import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { SetHomeworkService } from '../set-homework.service';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import {  } from '@types/mathjax';

@Component({
  selector: 'app-selected-question',
  templateUrl: './selected-question.component.html',
  styleUrls: ['./selected-question.component.css']
})
export class SelectedQuestionComponent implements OnInit {

  questions = [];
  q_ids = [];

  constructor(
    private setHomeworkService: SetHomeworkService,
    public dialogRef: MdDialogRef<SelectedQuestionComponent>,
    private localS: SessionStorageService
  ) { }

  ngOnInit() {
    if(this.localS.retrieve("q_ids")!=null && this.localS.retrieve("q_ids")!=undefined && this.localS.retrieve("q_ids")!=""){
      this.q_ids = this.localS.retrieve("q_ids").toString().split(",");
      this.setHomeworkService.loadSelectedQuestion(this.q_ids.join(",")).then(questions => {
        this.questions = questions.list;
      });
      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'MathJax']);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'MathJax']);
    }
  }

  delQuestion(question): void {
    this.questions.splice(this.questions.indexOf(question),1);
    this.q_ids.splice(this.q_ids.indexOf(question.q_id),1);
    this.localS.store("q_ids",this.q_ids);
  }

}