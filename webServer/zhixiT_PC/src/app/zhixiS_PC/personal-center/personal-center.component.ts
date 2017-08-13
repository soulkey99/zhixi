import { Component, OnInit } from '@angular/core';
import { IndexSService } from '../index-s/index-s.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {

  avatar: string = "";
  nick: string = "";
  school: string = "";
  classes = [];
  parents = [];
  classCode: string = "";
  joinMsg: string = "";
  dialogRef = null;
  qrCodeUrl: string = "http://api.test.zx.soulkey99.com/common/index?action=bind_parents&s_id="+localStorage.getItem('userID');

  editName: string = "";
  editNick: string = "";
  editSchool: string = "";
  editGrade: string = "";
  editBook: string = "";

  constructor(
    private indexSService: IndexSService,
    private router: Router
  ) { }

  ngOnInit() {
    this.avatar = localStorage.getItem('avatar');
    this.nick = localStorage.getItem('nick');
    this.school = localStorage.getItem('school');
    this.indexSService.loadJoinedClasses().then(res => {
      this.classes = res.list;
    });
    this.indexSService.loadBoundParents().then(res => {
      this.parents = res.list;
    });
  }

  joinClass(): void {
    if(this.classCode == ""){
      alert("请填写班级码！");
    }else{
      this.indexSService.joinClass(this.classCode,this.joinMsg).then(res => {
        if(res.status == "pending"){
          alert("申请成功，请等待审核！");
        }else if(res.status == "verified"){
          alert("您已加入此班级！");
        }
      });
    }
  }

  onDialogShow(dialogRef): void {
    this.dialogRef = dialogRef;
    this.classCode = "";
  }

  onDialogHide(): void {
    this.classCode = "";
  }

  loadUserInfo(): void {
    this.indexSService.loadUserInfo().then(res => {
      this.editName = res.info.name;
      this.editNick = res.info.nick;
      this.editSchool = res.info.userInfo.school;
      this.editGrade = res.info.userInfo.grade;
      this.editBook = res.info.userInfo.version;
    });
  }

  subEdit(): void {
    this.indexSService.editStudentInfo(this.editName,this.editNick,this.editSchool,this.editGrade,this.editBook).then(res => {
      if(res.code == 900){
        this.nick = this.editNick;
        this.school = this.editSchool;
        alert("修改成功！");
      }else{
        alert("修改失败！"+res.msg);
      }
    });
  }

  myWrong(ver_id: string, sec_id: string) {
    this.router.navigate(['indexS/myWrong']);
  }

  myHomework(ver_id: string, sec_id: string) {
    this.router.navigate(['indexS/myHomework']);
  }
}
