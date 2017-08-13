import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard }  from '../../auth-guard.service';
import { IndexSComponent }  from './index-s.component';
import { SelectBookComponent }  from '../select-book/select-book.component';
import { SelectQuestionComponent }  from '../select-question/select-question.component';
import { LearnComponent } from '../learn/learn.component';
import { DoHomeworkComponent } from '../do-homework/do-homework.component';
import { QuestionComponent } from '../select-question/question/question.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { PersonalCenterComponent } from '../personal-center/personal-center.component';
import { MyWrongComponent } from '../my/my-wrong/my-wrong.component';
import { MyHomeworkComponent } from '../my/my-homework/my-homework.component';
import { MyHomeworkQuestionComponent } from '../my/my-homework/my-homework-question/my-homework-question.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'indexS', component: IndexSComponent,
        children: [
          {
            path: '',
            children: [
              {
                  path: '',
                  component: QuestionComponent,
                  canActivate: [AuthGuard]
              },
              {
                  path: 'selectBook',
                  component: SelectBookComponent,
                  canActivate: [AuthGuard]
              },
              {
                path: 'selectQuestion/:ver_id/:sec_id',
                component: SelectQuestionComponent,
                canActivate: [AuthGuard]
              },
              {
                path: 'selectQuestion/:ver_id',
                component: SelectQuestionComponent,
                canActivate: [AuthGuard]
              },
              {
                  path: 'learn',
                  component: LearnComponent,
                  canActivate: [AuthGuard]
              },
              {
                  path: 'doHomework/:swork_id',
                  component: DoHomeworkComponent,
                  canActivate: [AuthGuard]
              },
              {
                  path: 'myWrong',
                  component: MyWrongComponent,
                  canActivate: [AuthGuard]
              },
              {
                  path: 'myHomework',
                  component: MyHomeworkComponent,
                  canActivate: [AuthGuard]
              },
              {
                  path: 'myHomeworkQuestion/:swork_id',
                  component: MyHomeworkQuestionComponent,
                  canActivate: [AuthGuard]
              },
              {
                  path: 'statistics',
                  component: StatisticsComponent,
                  canActivate: [AuthGuard]
              },
              {
                  path: 'personalCenter',
                  component: PersonalCenterComponent,
                  canActivate: [AuthGuard]
              }
            ]
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class IndexSRoutingModule { }
