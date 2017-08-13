import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { TodolistComponent }    from './todolist.component';

import { TodolistRoutingModule } from './todolist-routing.module';
import { HomeworkDetailsComponent } from './homework-details/homework-details.component';
import { HomeworkReviewComponent } from './homework-review/homework-review.component';

@NgModule({
  imports: [
    CommonModule,
    TodolistRoutingModule
  ],
  declarations: [
    TodolistComponent,
    HomeworkDetailsComponent,
    HomeworkReviewComponent
  ],
  providers: []
})
export class TodolistModule {}