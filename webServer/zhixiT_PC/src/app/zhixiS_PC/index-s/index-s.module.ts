import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { IndexSRoutingModule } from './index-s-routing.module';
import { MdlModule } from 'angular2-mdl';
import { IndexSService } from './index-s.service';
import { LearnComponent } from '../learn/learn.component';
import { DoHomeworkComponent } from '../do-homework/do-homework.component';
import { QuestionComponent } from '../select-question/question/question.component';
import { MyHomeworkComponent } from '../my/my-homework/my-homework.component';
import { MyHomeworkQuestionComponent } from '../my/my-homework/my-homework-question/my-homework-question.component';
import { HomeworkQuestionDetailComponent } from '../my/my-homework/my-homework-question/homework-question-detail/homework-question-detail.component';
import { MyWrongComponent } from '../my/my-wrong/my-wrong.component';
import { WrongQuestionDetailComponent } from '../my/my-wrong//wrong-question-detail/wrong-question-detail.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IndexSRoutingModule,
    MdlModule
  ],
  declarations: [
    
    LearnComponent, DoHomeworkComponent, QuestionComponent,
    MyHomeworkComponent, MyHomeworkQuestionComponent,  HomeworkQuestionDetailComponent, 
    MyWrongComponent, WrongQuestionDetailComponent
  ],
  providers: [
      IndexSService
  ],
  entryComponents: [
     HomeworkQuestionDetailComponent,
     WrongQuestionDetailComponent
  ],
})
export class IndexSModule {}