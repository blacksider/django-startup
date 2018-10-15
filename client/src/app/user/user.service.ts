import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

   getUserInfo(): Observable<User> {
    return this.http.get<User>(`/api/user/`);
  }
}
