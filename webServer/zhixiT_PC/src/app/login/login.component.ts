import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  time: number;
  loginType: string;
  userPhone: string;
  password1: string;
  password2: string;
  msgCode: string;
  btnText: string;
  int: any;
  sign: string;
  userType: string = "t";

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.time = 0;
    this.sign = "login";
    this.btnText = "发送短信";
    this.userPhone = '';
    this.password1 = '';
  }

  login(): void {
    if(this.userPhone == ""){
      alert("请填写手机号码");
    }else if(this.password1 == ""){
      alert("请填写登陆密码");
    }else if(this.msgCode == ""){
      alert("请填写短信验证码");
    }else{
      //TODO: 这个地方跳转todo list 以后，header tab也得选择todo list
      this.loginService.login(this.userPhone,this.password1,this.userType).then(userInfo => {
        localStorage.setItem("userType",this.userType);
        if(this.userType == "t"){
          this.router.navigate(['/indexT']);
        }else if(this.userType == "s"){
          this.router.navigate(['/indexS']);
        } 
      });
    }
  }

  sendMsg(): void {
    if(this.userPhone != ""){
      this.loginService.sendMsg(this.userPhone).then( result => {
      this.time = 60;
      this.int = setInterval(() => {
            if(this.time >= 1){
              this.time -= 1
              this.btnText = "已发送"+"("+this.time+")";
            }else{
              window.clearInterval(this.int);
              this.btnText = "发送短信";
            }
          },1000
        );
      });
    }else{
      alert("请填写手机号码");
    }
  }

  regedit(): void {
    if(this.userPhone == ""){
      alert("请填写用户名");
    }else if(this.password1 == ""){
      alert("请填写密码");
    }else if(this.password2 == ""){
      alert("请填写确认密码");
    }else if(this.password1 != this.password2){
      alert("请确保两次输入的密码相同");
    }else if(this.msgCode == ""){
      alert("请填写短信验证码");
    }else{
      this.loginService.regedit(this.userPhone, this.password1, this.msgCode).then(result => {
        console.log(result);
        if(result.code == 900){
          alert("注册成功");
          this.sign = "login";
        }else{
          alert(result.code);
        }
      });
    }
  }

  resetPwd(): void {
    if(this.userPhone == ""){
      alert("请填写用户名");
    }else if(this.password1 == ""){
      alert("请填写密码");
    }else if(this.msgCode == ""){
      alert("请填写短信验证码");
    }else{
      this.loginService.resetPwd(this.userPhone, this.password1, this.msgCode).then(result => {
        if(result.code == 900){
          alert("修改成功");
          this.sign = "login";
        }else{
          alert(result.code);
        }
      });
    }
  }

  gotoRegedit(): void {
    this.userPhone = '';
    this.password1 = '';
    this.sign = "regedit";
  }

  gotoLogin(): void {
    this.userPhone = '';
    this.password1 = '';
    this.sign = "login";
  }

  gotoResetpwd(): void {
    this.userPhone = '';
    this.password1 = '';
    this.sign = "resetPwd";
  }

}
