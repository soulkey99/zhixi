import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { SetHomeworkComponent } from './set-homework.component';
import { SelectBookComponent } from './select-book/select-book.component';
import { SelectedQuestionComponent } from './selected-question/selected-question.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/setHomenwork', pathMatch: 'full' },
      { path: 'setHomenwork/:ver_id',  component: SetHomeworkComponent },
      { path: 'selectBook/:class_id',  component: SelectBookComponent },
      { path: 'selectBook/:schedule_id/:s_id/:c_id',  component: SelectBookComponent },
      { path: 'selectedQuestion',  component: SelectedQuestionComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SetHomeworkRoutingModule { }