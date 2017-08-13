import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-index-t',
  templateUrl: './index-t.component.html',
  styleUrls: ['./index-t.component.css']
})
export class IndexTComponent implements OnInit {

  isLoggedIn = true;

  constructor(
    private router: Router,
    private localS: SessionStorageService
  ) { }

  ngOnInit() {
      this.isLoggedIn = this.localS.retrieve("isLoggedIn");
  }

  onSelectTodolist(): void {
      this.router.navigate(['indexT/todolist']);
  }

  onSelectClassManagement(): void {
      this.router.navigate(['indexT/classmanagement']);
  }

  onSelectMyTools(): void {
      this.router.navigate(['indexT/mytools']);
  }

  onSelectPersonalCenter(): void {
      this.router.navigate(['indexT/personalcenter']);
  }

  onSelectLogin(): void {
      this.router.navigate(['']);
  }

}
