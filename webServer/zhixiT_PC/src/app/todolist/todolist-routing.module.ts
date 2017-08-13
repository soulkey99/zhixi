import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeworkDetailsComponent }    from './homework-details/homework-details.component';
import { HomeworkReviewComponent }  from './homework-review/homework-review.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'homework-details/:schedule_id',  component: HomeworkDetailsComponent },
      { path: 'homework-review', component: HomeworkReviewComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class TodolistRoutingModule { }