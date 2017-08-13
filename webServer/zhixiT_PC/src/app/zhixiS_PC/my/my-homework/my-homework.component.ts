import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';
import { MyHomeworkService } from './my-homework.service';
import { QuestionComponent } from '../../select-question/question/question.component';

@Component({
  selector: 'app-my-homework',
  templateUrl: './my-homework.component.html',
  styleUrls: ['./my-homework.component.css'],
  providers: [MyHomeworkService]
})
export class MyHomeworkComponent implements OnInit {

  private homeworks: any;
  hasMore: boolean = true;
  pageSize: number = 20;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MyHomeworkService,
    ) { }

  ngOnInit() {

    this.getMyHomework(0);
  }
  
  getMore(){
    this.getMyHomework(this.homeworks.length / this.pageSize);
  }

  getMyHomework(page: number) {
    this.service.getMyHomework(page, this.pageSize).then(result=>{
      if(page==0){
        this.homeworks = result.list;
      }
      else
      {
        result.list.forEach(element => {
          this.homeworks.push(element);
        });
      }

      if(result.list.length < this.pageSize){
        this.hasMore = false;
      }
    });
  }

  startHomework(swork_id: string) {
    this.router.navigate(['indexS/myHomeworkQuestion/' + swork_id]);
  }
}
