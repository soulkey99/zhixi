import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdlModule } from 'angular2-mdl';
import { IndexTModule } from './index-t/index-t.module';
import { IndexSModule } from './zhixiS_PC/index-s/index-s.module';
import { ChartModule } from 'angular2-highcharts';
import { QRCodeModule } from 'angular2-qrcode';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { TodolistModule } from './todolist/todolist.module';
import { AuthGuard } from './auth-guard.service';
import { LoginService } from './login/login.service';
import { Ng2Webstorage } from 'ng2-webstorage';
import { ClassListComponent } from './classlist/classlist.component';
import { StatComponent } from './stat/stat.component';

import { SetHomeworkModule } from './set-homework/set-homework.module';
import { AddClassComponent } from './classlist/add-class/add-class.component';
import { HomeworkDetail } from './homework-detail/homework-detail.module';
import { SelectedClassComponent } from './classlist/selected-class/selected-class.component';
import { IndexSComponent } from './zhixiS_PC/index-s/index-s.component';
import { SelectBookComponent } from './zhixiS_PC/select-book/select-book.component';
import { SelectQuestionComponent } from './zhixiS_PC/select-question/select-question.component';
import { StatisticsComponent } from './zhixiS_PC/statistics/statistics.component';
import { PersonalCenterComponent } from './zhixiS_PC/personal-center/personal-center.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClassListComponent,
    StatComponent,
    AddClassComponent,
    AddClassComponent,
    SelectedClassComponent,
    IndexSComponent,
    SelectBookComponent,
    SelectQuestionComponent,
    StatisticsComponent,
    PersonalCenterComponent,
  ],
  entryComponents: [
    AddClassComponent,
  ],
  imports: [
    MaterialModule.forRoot(),
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    TodolistModule,
    Ng2Webstorage,
    SetHomeworkModule,
    HomeworkDetail,
    MdlModule,
    IndexTModule,
    IndexSModule,
    ChartModule,
    QRCodeModule
  ],
  providers: [
    {
      provide: 'apiUrl', useValue: 'http://123.57.16.157:8051'
    },
    LoginService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
