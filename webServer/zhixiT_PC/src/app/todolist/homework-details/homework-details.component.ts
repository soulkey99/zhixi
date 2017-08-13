import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HomeworkDetailService } from './homework-details.service';
import { Location }               from '@angular/common';

@Component({
  selector: 'app-homework-details',
  templateUrl: './homework-details.component.html',
  styleUrls: ['./homework-details.component.css'],
  providers: [ HomeworkDetailService ]
})
export class HomeworkDetailsComponent implements OnInit {

  homeworkDetails = {};

  constructor(
    private route: ActivatedRoute,
    private homeworkDetailService: HomeworkDetailService,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.params.filter(function (value: Params, index: number) {
      console.log(value);
      if(index == 0){
        
        return true;
      }
    }).forEach((params: Params) => {
        this.homeworkDetailService.loadHomeworkDetails(params["schedule_id"]).then(homeworkDetails => {
          this.homeworkDetails = homeworkDetails.info;
        })
    });
  }

  goBack(): void {
    this.location.back();
  }

}