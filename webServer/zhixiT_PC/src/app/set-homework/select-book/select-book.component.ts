import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import { SetHomeworkService } from '../set-homework.service';

@Component({
  selector: 'app-select-book',
  templateUrl: './select-book.component.html',
  styleUrls: ['./select-book.component.css']
})
export class SelectBookComponent implements OnInit {

  books = [];
  classtimes = [];
  ver: string = "";
  grade: string = "";
  schedule_id: string;
  homework_type: string;
  q_ids = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private setHomeworkService: SetHomeworkService,
    private localS: SessionStorageService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.filter(function (value: Params, index: number) {
      console.log(value);
      if(index == 0){
        return true;
      }
    }).forEach((params: Params) => {
        if(params["class_id"]!=null && params["class_id"]!=""){
          this.homework_type = "first";
          this.localS.store("homework_type","first");
          this.localS.store("class_id",params["class_id"]);
          this.setHomeworkService.loadClasstime(params["class_id"]).then(classtimes => {
            this.classtimes = classtimes.list;
            this.schedule_id = this.classtimes[0].schedule_id;
          });
        }else{
          this.homework_type = "second";
          this.localS.store("homework_type","second");
          this.localS.store("schedule_id",params["schedule_id"]);
          this.localS.store("s_id",params["s_id"]);
          this.localS.store("c_id",params["c_id"]);
        }
    });
    this.loadBooks();
    if(this.localS.retrieve("q_ids")!="" && this.localS.retrieve("q_ids")!=null){
      this.q_ids = this.localS.retrieve("q_ids");
    }
  }

  loadBooks() {
    this.setHomeworkService.loadBooks(this.ver,this.grade).then(books => {
      this.books = books.list
    });
  }

  selectBook(book): void{
    if(this.localS.retrieve("homework_type") == "first"){
      this.localS.store("schedule_id",this.schedule_id);
    }
    this.localS.store("cover",book.cover);
    this.router.navigate(['indexT/setHomenwork',book.ver_id]);
  }

  onSelectChangeVer(): void {
    this.loadBooks();
  }

  onSelectChangeGrade(): void {
    this.loadBooks();
  }

  onSelectTime(): void {
    this.q_ids = [];
    this.localS.store("q_ids",[]);
    this.localS.store("schedule_id",this.schedule_id);
  }

  saveQuestions(): void {
    if(this.localS.retrieve("endAt") == ""){
      alert("请选择作业截止日期");
    }else{
      if(this.localS.retrieve("homework_type") == "first"){
        this.setHomeworkService.saveQuestionsFirst(this.localS.retrieve("schedule_id"), this.localS.retrieve("q_ids"), this.localS.retrieve("endAt")).then(res => {
          if(res.code == 900){
            this.q_ids = [];
            this.localS.store("q_ids",[]);
            alert("布置作业成功");
            this.router.navigate(['indexT/classmanagement']);
          }
        })
      }else if(this.localS.retrieve("homework_type") == "second"){
        this.setHomeworkService.saveQuestionsSecond(this.localS.retrieve("schedule_id"), this.localS.retrieve("s_id"), this.localS.retrieve("q_ids"), this.localS.retrieve("endAt")).then(res => {
          if(res.code == 900){
            this.q_ids = [];
            this.localS.store("q_ids",[]);
            alert("补留作业成功");
            this.router.navigate(['indexT/class/'+ this.localS.retrieve("c_id") +'/stat']);
          }
        })
      }
    }
  }

}
