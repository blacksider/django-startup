import {Component, OnInit} from "@angular/core";
import {UserService} from "./user.service";
import {User} from "./user";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  loading: boolean;
  data: User;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.loading = true;
    this.userService.getUserInfo().subscribe(res => {
      this.data = res;
      this.loading = false;
    });
  }

}
