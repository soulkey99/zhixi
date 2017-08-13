import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
}) 

export class HeaderComponent implements OnInit {

  isLoggedIn = true;

  constructor(
    private router: Router,
    private localS: SessionStorageService
  ) { }

  ngOnInit() {
      this.isLoggedIn = this.localS.retrieve("isLoggedIn");
  }

  onSelectTodolist(): void {
      this.router.navigate(['index/todolist']);
  }

  onSelectClassManagement(): void {
      this.router.navigate(['index/classmanagement']);
  }

  onSelectMyTools(): void {
      this.router.navigate(['index/mytools']);
  }

  onSelectPersonalCenter(): void {
      this.router.navigate(['index/personalcenter']);
  }

  onSelectLogin(): void {
      this.router.navigate(['']);
  }

}
