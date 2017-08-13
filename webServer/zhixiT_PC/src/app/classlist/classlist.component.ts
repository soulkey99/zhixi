import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClasslistService } from './classlist.service';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { AddClassComponent } from './add-class/add-class.component';
import { ClassItem, ClassInfo, StudentInfo } from './classlist.model'
import { Util } from '../../assets/Util';

@Component({
  selector: 'app-classlist',
  templateUrl: './classlist.component.html',
  styleUrls: ['./classlist.component.css'],
  providers: [ClasslistService]
})
export class ClassListComponent implements OnInit {

  selectedClass: ClassInfo;
  selectedClassMates: StudentInfo[];
  list: ClassItem[];
  util: Util;

  dialogRef: MdDialogRef<AddClassComponent>;

  constructor(
    private classlistService: ClasslistService,
    private router: Router,
    private dialog: MdDialog,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.getClasslist();
    this.util = new Util;
    this.list = [];
    this.selectedClassMates = [];
  }

  getClasslist(): void {
    this.classlistService.loadList().then(res => {
      this.list = [...this.list, ...res];
    });
  }

  getClassDetails(class_id: string): void {
    this.classlistService.getClassDetails(class_id).then(classInfo => {
      console.log(classInfo);
      this.selectedClass = classInfo;
    });

    this.getClassMatesList(class_id);
  }

  getClassMatesList(class_id: string): void {
    this.selectedClassMates = [];
    this.classlistService.getClassMates(class_id).then(list => {
      console.log(list);
      this.selectedClassMates = [...this.selectedClassMates, ...list];
    });

    this.classlistService.getNewClassMates(class_id).then(list => {
      console.log(list);
      this.selectedClassMates = [...list, ...this.selectedClassMates];
    });
  }

  onSelectClass(class_id: string) {
    if (this.selectedClass != null && this.selectedClass.class_id == class_id) {
      return;
    }
    this.getClassDetails(class_id);
  }

  onCloseClassDetails(): void {
    this.selectedClassMates = null;
    this.selectedClass = null;
  }

  onCreateClass(): void {
    console.log("On Create Class");
    this.selectedClassMates = null;
    this.selectedClass = null;

    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    this.dialogRef = this.dialog.open(AddClassComponent, config);
    this.dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === true) {
        this.list = [];
        this.getClasslist();
      }
      this.dialogRef = null;
    });
  }

  onCheckHomework(class_id: string): void {
    console.log("onCheckHomework class_id is: " + class_id);
    this.router.navigate(['indexT/class', this.selectedClass.class_id, 'stat']);
  }

  onAssignHomework(class_id: string): void {
    this.router.navigate(['indexT/selectBook', this.selectedClass.class_id]);
  }

  onRemoveStudent(student: StudentInfo): void {
    console.log("onStudentManagement: do remove");
    this.classlistService.removeStudent(this.selectedClass.class_id, student.s_id)
      .then(r => {
        if (r == 900) {
          this.getClassMatesList(this.selectedClass.class_id)
        }
      });
  }

    onAcceptStudent(student: StudentInfo): void {
    //do accept
      console.log("onStudentManagement: do accept");
      this.classlistService.acceptStudent(student.cs_id, "verified", "")
        .then(r => {
          if (r == 900) {
            this.getClassMatesList(this.selectedClass.class_id)
          }
        });
  }


}


