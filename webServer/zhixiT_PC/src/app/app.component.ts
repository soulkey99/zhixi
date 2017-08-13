import { Component, Inject, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SessionStorage, SessionStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private localS: SessionStorageService) {}
  
    @SessionStorage('isLoggedIn')
    @SessionStorage('redirectUrl')
    @SessionStorage('schedule_id')              //setHomework
    @SessionStorage('s_id')                     //setHomework
    @SessionStorage('class_id')                 //setHomework
    @SessionStorage('homework_type')            //setHomework
    @SessionStorage('q_ids')                    //setHomework
    @SessionStorage('selectedClasstime')        //setHomework
    public sessionBind;

    ngOnInit() {
        this.localS.store('isLoggedIn', false);
        this.localS.store('redirectUrl', '/login');
    }

}