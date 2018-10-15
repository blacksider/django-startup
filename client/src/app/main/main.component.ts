import {Component, OnInit} from "@angular/core";
import {AuthService} from "../auth.service";
import {AuthInfo} from "../auth-info";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  authInfo: AuthInfo;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.authInfo = this.authService.authInfo;
  }

  logout() {
    this.authService.logout().subscribe(res => {
      if (res) {
        this.router.navigate(['/login']);
      }
    });
  }

}
