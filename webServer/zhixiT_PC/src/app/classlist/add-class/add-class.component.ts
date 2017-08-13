import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { AddClassService } from './services/add-class.service'
import { TextbookInfo } from './model/textbookInfo.model'

@Component({
    selector: 'app-add-class',
    templateUrl: './add-class.component.html',
    styleUrls: ['./add-class.component.css'],
    providers: [AddClassService]
})
export class AddClassComponent implements OnInit {
    textbooks: string[] = [];
    grades: string[][] = [];
    durations: string[] = ['60', '90', '120', '150', '180'];
    startTimes: string[] = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];
    weekdays: string[] = ['一', '二', '三', '四', '五', '六', '日'];
    weekdaysStatus: boolean[] = [false, false, false, false, false, false, false];

    textbookIndex: number = 0;

    className: string = '';
    grade: string = '';
    subject: string = '数学';
    textbook: string = '';
    startDate: string = '';
    endDate: string = '';
    duration: string = this.durations[0];
    startTime: string = this.startTimes[0];
    startTimeRange: string = '';
    startTimeHour: string = '';
    startTimeMinute: string = '';
    weekday: string = '';
    weekFrequency = 'every';

    // @Input() needToShow: boolean = true;
    // @Output() needToHide = new EventEmitter<boolean>();

    constructor(private addClassService: AddClassService, public dialogRef: MdDialogRef<AddClassComponent>) { }

    ngOnInit() {
        this.getTextbookList();
    }

    onTextbookChange() {
        console.log('textbook change to: ' + this.textbook);
        this.textbookIndex = this.textbooks.indexOf(this.textbook);

    }
    onGradeChange() {
        console.log('grade change to: ' + this.grade);
    }

    onDurationChange() {
        console.log('duration change to: ' + this.duration);
    }

    onStartTimeChange() {
        console.log('start time change to: ' + this.startTime);
    }

    weekdaySelected(weekday: string) {
        console.log('weekday selected: ' + weekday);

        let index = this.weekdays.indexOf(weekday);
        this.weekdaysStatus[index] = !this.weekdaysStatus[index];

        console.log('index: ' + index + ' ' + this.weekdaysStatus[index]);
    }

    isWeekdaySelected(weekday: string): boolean {
        let index = this.weekdays.indexOf(weekday);
        return this.weekdaysStatus[index];
    }

    everyWeekSelected(isEveryWeek: boolean) {
        this.weekFrequency = isEveryWeek ? 'every' : 'double';
    }

    isEveryWeekSelected() {
        return this.weekFrequency === 'every';
    }

    getTextbookList() {
        this.addClassService.getTextbookList()
            .then(res => {
                res.list.map(textbookInfo => {
                    this.textbooks.push(textbookInfo.name);
                    this.grades.push(textbookInfo.grades);
                });

                this.textbook = this.textbooks[0];
                this.grade = this.grades[0][0];
            });
    }

    addClass() {
        this.startTimeHour = this.startTime.split(':')[0];
        this.startTimeMinute = this.startTime.split(':')[1];
        this.startTimeRange = +this.startTimeHour < 12 ? "before" : "after";

        this.weekday = '';
        for (let i = 0; i < this.weekdaysStatus.length; i++) {
            if (this.weekdaysStatus[i]) {
                this.weekday += `${i},`;
            }
        }
        this.weekday = this.weekday.slice(0, this.weekday.lastIndexOf(','));

        if (this.className.length <= 0) {
            alert('请输入班级名称');
            return;
        }

        if (this.startDate.length <= 0) {
            alert('请选择开班时间');
            return;
        }

        if (this.endDate.length <= 0) {
            alert('请选择结束时间');
            return;
        }

        if (this.weekday.length <= 0) {
            alert('请选择课时安排');
            return;
        }

        console.log('class name: ' + this.className);
        console.log('grade: ' + this.grade);
        console.log('subject: ' + this.subject);
        console.log('textbook: ' + this.textbook);
        console.log('start date: ' + this.startDate);
        console.log('end date: ' + this.endDate);
        console.log('duration: ' + this.duration);
        console.log('startTime: ' + this.startTime);
        console.log('startTimeRange: ' + this.startTimeRange);
        console.log('startTimeHour: ' + this.startTimeHour);
        console.log('startTimeMinute: ' + this.startTimeMinute);
        console.log('weekday: ' + this.weekday);
        console.log('frequency:' + this.weekFrequency);

        this.addClassService.addClass(this.className, this.grade, this.subject, this.textbook, this.duration, this.startDate, this.endDate, this.weekFrequency, this.weekday, this.startTimeRange, this.startTimeHour, this.startTimeMinute)
            .then(res => {
                console.log('Code: ' + res.code);
                // this.needToHide.emit(true);
                this.dialogRef.close(true);
            });

    }
}
