import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TodolistService } from './todolist.service';
import { Util } from '../../assets/Util';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css'],
  providers: [TodolistService]
})
export class TodolistComponent implements OnInit {

  todolist: any;
  util: Util;

  constructor(
    private todolistService: TodolistService,
    private router: Router
  ) { }

  getTodolist(): void {
    this.todolistService.loadList().then(todolist => {
      console.log(todolist);
      this.todolist = todolist.list;
    });
  }

  ngOnInit(): void {
    this.getTodolist();
    this.util = new Util;
  }

  onAssignHomework(todo):void{
    this.router.navigate(['indexT/selectBook', todo.class_id]);
  }

  onCheckHomeworkList(todo):void{
    this.router.navigate(['indexT/class', todo.class_id, 'stat']);
  }

  onSelectHomeworkDetails(todo): void{
    this.router.navigate(['indexT/class', todo.class_id, 'stat']);
  }
}
