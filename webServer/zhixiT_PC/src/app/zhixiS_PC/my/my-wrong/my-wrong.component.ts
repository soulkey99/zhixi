import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { MyWrongService } from './my-wrong.service';
import { WrongQuestionDetailComponent } from './wrong-question-detail/wrong-question-detail.component';


@Component({
  selector: 'app-my-wrong',
  templateUrl: './my-wrong.component.html',
  styleUrls: ['./my-wrong.component.css'],
  providers: [MyWrongService]
})
export class MyWrongComponent implements OnInit {

  dialogRef: MdDialogRef<WrongQuestionDetailComponent>;

  // private e_id: String;
  private questions: any = [];
  hasMore: boolean = true;
  pageSize: number = 20;

  constructor(
    private route: ActivatedRoute,
    private service: MyWrongService,
    private localS: SessionStorageService,
    private dialog: MdDialog,
    public viewContainerRef: ViewContainerRef,
    ) { }

  ngOnInit() {
    this.getMyWrong(0);
  }
  
  getMore(){
    this.getMyWrong(this.questions.length / this.pageSize);
  }

  getMyWrong(page: number) {
    this.service.getMyWrong(page, this.pageSize).then(result=>{
      if(page==0){
        this.questions = result.list;
      }
      else
      {
        result.list.forEach(element => {
          this.questions.push(element);
        });
      }

      if(result.list.length < this.pageSize){
        this.hasMore = false;
      }
    });
  }

  onSelectQuestion(question: any) {
    this.localS.store("wrong_question_type", question.type);

    if(question.type=="homework"){
      this.localS.store("wrong_question_swork_id", question.swork_id);
      this.localS.store("wrong_question_q_id", question.q_id);
      this.localS.store("wrong_question_e_id", "");
    }
    else if(question.type=="exercise"){
      this.localS.store("wrong_question_e_id", question.e_id);
      this.localS.store("wrong_question_q_id", "");
      this.localS.store("wrong_question_swork_id", "");
    }

    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;
    this.dialogRef = this.dialog.open(WrongQuestionDetailComponent, config);
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;

      this.localS.clear("wrong_question_type");
      this.localS.clear("wrong_question_swork_id");
      this.localS.clear("wrong_question_e_id");
      this.localS.clear("wrong_question_q_id");

      // if (result == "addMoreHomework") {

      //   this.router.navigate(['selectBook', this.selected_schedule_id, s_id, this.stat.class_id]);
      // }
    });
  }
}
