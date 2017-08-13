import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { IndexTComponent } from './index-t/index-t.component';
import { IndexSComponent } from './zhixiS_PC/index-s/index-s.component';
//import { TodolistComponent } from './todolist/todolist.component';
//import { AuthGuard }  from './auth-guard.service';
//import { HomeworkDetailsComponent }  from './todolist/homework-details/homework-details.component';
//import { HomeworkDetailComponent }  from './homework-detail/homework-detail.component';
//import { StatComponent } from './stat/stat.component';
//import { ClassListComponent } from './classlist/classlist.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'indexT', component: IndexTComponent },
      { path: 'indexS', component: IndexSComponent }
      //{ path: 'todolist',  component: TodolistComponent, canActivate: [AuthGuard] },
      //{ path: 'homeworkDetail',  component: HomeworkDetailComponent },
      // {
      //   path: '', component: LoginComponent,
      //   children: [
      //     {
      //       path: '',
      //       children: [
      //         {
      //           path: 'todolist1',
      //           component: TodolistComponent,
      //         },
      //         {
      //           path: 'homework-details/:schedule_id',
      //           component: HomeworkDetailsComponent,
      //         }
      //       ]
      //     }
      //   ]
      // },
      //{ path: 'class/:class_id/stat', component: StatComponent, canActivate: [AuthGuard] },
      //{ path: 'classmanagement', component: ClassListComponent, canActivate: [AuthGuard] },
    ], { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

