import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClassInfo, StudentInfo } from '../classlist.model'
import { Util } from '../../../assets/Util';

@Component({
  selector: 'app-selected-class',
  templateUrl: './selected-class.component.html',
  styleUrls: ['./selected-class.component.css']
})
export class SelectedClassComponent {

  @Input() classInfo: ClassInfo = new ClassInfo();
  _classMates : StudentInfo[] = [];
  util: Util = new Util();
  @Input()
  set classMates(classMates:StudentInfo[]){
    this._classMates = [...classMates];
  }

  get classMates(){
    return this._classMates;
  }
  @Output() onRemoveStudentTriggered = new EventEmitter<StudentInfo>();
  @Output() onAcceptStudentTriggered = new EventEmitter<StudentInfo>();
  @Output() onAssignHomeworkTriggered = new EventEmitter<string>();
  @Output() onCheckHomeworkTriggered = new EventEmitter<string>();
  @Output() onCloseSelectedClassTriggered = new EventEmitter<boolean>();

  onCheckHomework(class_id: string): void {
    console.log("onCheckHomework class_id is: " + class_id);
    this.onCheckHomeworkTriggered.emit(class_id);
  }

  onAssignHomework(class_id: string): void {
    this.onAssignHomeworkTriggered.emit(class_id);
  }

  onStudentManagement(student: StudentInfo): void {
    if (student.cs_id) {
      //do accept
      console.log("onStudentManagement: do accept");
      this.onAcceptStudentTriggered.emit(student);
    }
    else {
      //do remove
      console.log("onStudentManagement: do remove");
      this.onRemoveStudentTriggered.emit(student);
    }
  }

  onCloseSelectedClass(){
    this.onCloseSelectedClassTriggered.emit(true);
  }

}
