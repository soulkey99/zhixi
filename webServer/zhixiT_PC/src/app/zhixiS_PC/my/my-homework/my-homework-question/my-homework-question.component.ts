import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { MyHomeworkQuestionService } from './my-homework-question.service';
import { HomeworkQuestionDetailComponent } from './homework-question-detail/homework-question-detail.component';

@Component({
  selector: 'app-my-homework-question',
  templateUrl: './my-homework-question.component.html',
  styleUrls: ['./my-homework-question.component.css'],
  providers: [MyHomeworkQuestionService]
})
export class MyHomeworkQuestionComponent implements OnInit {

  dialogRef: MdDialogRef<HomeworkQuestionDetailComponent>;

  private swork_id: String;
  private homeworks: any;

  constructor(
    private route: ActivatedRoute,
    private service: MyHomeworkQuestionService,
    private localS: SessionStorageService,
    private dialog: MdDialog,
    public viewContainerRef: ViewContainerRef,
    ) { }

  ngOnInit() {
    this.route.params.filter(function (value: Params, index: number) {
      if(index == 0){
        return true;
      }
    }).forEach((params: Params) => {
      if (params['swork_id']) {
        this.swork_id = params['swork_id'];
        this.getHomeworkDetail();
      }
    });
  }

  getHomeworkDetail() {
    this.service.getHomeworkDetail(this.swork_id).then(result => {
      this.homeworks = result.list;
    });
  }

  onSelectHomework(q_id: string) {
    this.localS.store("homework_question_swork_id", this.swork_id);
    this.localS.store("homework_question_q_id", q_id);

    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;
    this.dialogRef = this.dialog.open(HomeworkQuestionDetailComponent, config);
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;

      this.localS.clear("homework_question_swork_id");
      this.localS.clear("homework_question_q_id");

      // if (result == "addMoreHomework") {

      //   this.router.navigate(['selectBook', this.selected_schedule_id, s_id, this.stat.class_id]);
      // }
    });
  }
}
