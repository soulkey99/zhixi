import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-s',
  templateUrl: './index-s.component.html',
  styleUrls: ['./index-s.component.css']
})
export class IndexSComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLearn(): void {
      this.router.navigate(['indexS/learn']);
  }

  onSelectQuestionBank(): void {
      this.router.navigate(['indexS/selectBook']);
  }

  onSelectStatistics(): void {
      this.router.navigate(['indexS/statistics']);
  }

  onSelectPersonalCenter(): void {
      this.router.navigate(['indexS/personalCenter']);
  }

  onSelectLogin(): void {
      this.router.navigate(['']);
  }

}
