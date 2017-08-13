import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { IndexTComponent }    from './index-t.component';
import { HeaderComponent } from '../header/header.component';
import { TodolistComponent } from '../todolist/todolist.component';
import { AuthGuard }  from '../auth-guard.service';
import { HomeworkDetailsComponent }  from '../todolist/homework-details/homework-details.component';
import { HomeworkDetailComponent }  from '../homework-detail/homework-detail.component';
import { StatComponent } from '../stat/stat.component';
import { ClassListComponent } from '../classlist/classlist.component';

import { SetHomeworkComponent } from '../set-homework/set-homework.component';
import { SelectBookComponent } from '../set-homework/select-book/select-book.component';
import { SelectedQuestionComponent } from '../set-homework/selected-question/selected-question.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'indexT', component: IndexTComponent,
        children: [
            {   
                path: 'todolist',  
                component: TodolistComponent,
                canActivate: [AuthGuard]
            },
            {   
                path: 'homeworkDetail',  
                component: HomeworkDetailComponent,
                canActivate: [AuthGuard]
            },
            {   
                path: 'homework-details/:schedule_id',  
                component: HomeworkDetailsComponent,
                canActivate: [AuthGuard]
            },
            {   
                path: 'class/:class_id/stat',  
                component: StatComponent,
                canActivate: [AuthGuard]
            },
            {   
                path: 'classmanagement',  
                component: ClassListComponent,
                canActivate: [AuthGuard]
            },
            {   
                path: 'setHomenwork/:ver_id',
                component: SetHomeworkComponent,
                canActivate: [AuthGuard]
            },
            { 
                path: 'selectBook/:class_id',  
                component: SelectBookComponent,
                canActivate: [AuthGuard]
            },
            { 
                path: 'selectBook/:schedule_id/:s_id/:c_id',  
                component: SelectBookComponent,
                canActivate: [AuthGuard]
            },
            { 
                path: 'selectedQuestion',  
                component: SelectedQuestionComponent,
                canActivate: [AuthGuard]
            }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class IndexTRoutingModule { }