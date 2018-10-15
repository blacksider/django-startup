import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthReq} from "./auth-req";
import {NgForm} from "@angular/forms";
import {LocalStorage} from "@ngx-pwa/local-storage";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  authReq: AuthReq = new AuthReq;
  errorMsg: string;
  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private authService: AuthService, private router: Router,
              private localStorage: LocalStorage) {
  }

 doLogin(): void {
    if (!this.validate()) {
      return;
    }
    this.authService.login(this.authReq)
      .subscribe(authInfo => {
        if (!!authInfo) {
            this.router.navigate(['/main']);
        }
      });
  }

  validate(): boolean {
    const unErr = !this.authReq.username;
    const pwdErr = !this.authReq.password;
    let error = null;
    if (unErr && pwdErr) {
      error = '请输入用户名和密码';
    } else if (unErr) {
      error = '请输入用户名';
    } else if (pwdErr) {
      error = '请输入密码';
    }
    this.errorMsg = error;
    setTimeout(() => {
      this.errorMsg = null;
    }, 3000);
    return !error;
  }

}
