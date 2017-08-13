import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LearnService } from './learn.service';
import { Util } from '../../../assets/Util';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css'],
  providers: [LearnService]
})

export class LearnComponent implements OnInit {

  homeworks: any;
  recentlys: any;
  util: Util;

  constructor(
    private service: LearnService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.util = new Util;
    this.getHomework();
    this.getRecently();
  }

  getHomework() {
    this.service.getHomework().then(result=>{

      if(result["code"]=="900"){
        this.homeworks = result["list"];
        console.log("ho");
        console.log(result);
      }
      else{
        alert(result["msg"]);
      }
    });
  }

  getRecently() {
    this.service.getRecently().then(result=>{

      if(result["code"]=="900"){
        this.recentlys = result["list"];
        console.log("rec");
        console.log(result);
      }
      else{
        alert(result["msg"]);
      }
    });
  }


  startHomework(swork_id: string) {
    this.router.navigate(['indexS/doHomework/' + swork_id]);
  }

  startRecently(ver_id: string, sec_id: string) {
    this.router.navigate(['indexS/selectQuestion/'+ ver_id + "/" + sec_id]);
  }
}

