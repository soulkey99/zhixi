import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { SetHomeworkComponent }    from './set-homework.component';
import { SelectBookComponent } from './select-book/select-book.component';
import { SelectedQuestionComponent } from './selected-question/selected-question.component';

import { SetHomeworkRoutingModule } from './set-homework-routing.module';
import { SetHomeworkService } from './set-homework.service';

import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SetHomeworkRoutingModule,
    MaterialModule.forRoot()
  ],
  declarations: [
    SetHomeworkComponent,
    SelectBookComponent,
    SelectedQuestionComponent
  ],
  providers: [
      SetHomeworkService
  ],
  entryComponents: [
  ],
})
export class SetHomeworkModule {}