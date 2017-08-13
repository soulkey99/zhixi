
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { routing} from './homework-detail.routes'

import { HomeworkDetailComponent } from './homework-detail.component';
import { DetailComponent } from './detail/detail.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { QuestionComponent } from './question/question.component';
import { HomeworkDetailService } from './homework-detail.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    routing
  ],
  declarations: [
    HomeworkDetailComponent,
    DetailComponent,
    FeedbackComponent,
    QuestionComponent
  ],
  providers: [
    {
        provide: 'homeworkDetail', useClass: HomeworkDetailService}
    ]
})
export class HomeworkDetail {}