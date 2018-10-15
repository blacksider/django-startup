import {Injectable} from "@angular/core";
import {AuthInfo} from "./auth-info";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {LocalStorage} from "@ngx-pwa/local-storage";
import {ToastrService} from "ngx-toastr";
import {AppConstants} from "./app-constants";
import {Observable, of} from "rxjs/index";
import {catchError, switchMap, tap} from "rxjs/internal/operators";
import {AuthReq} from "./login/auth-req";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authInfo: AuthInfo;

  constructor(private http: HttpClient, private localStorage: LocalStorage, private toastr: ToastrService) {
  }

  login(req: AuthReq): Observable<AuthInfo> {
    const cloned = Object.assign({}, req);
    // cloned.password = window.btoa(req.password);
    return this.http.post<AuthInfo>('/api/login/', cloned)
      .pipe(
        switchMap((res: any) => {
          if (!!res) {
            const authToken = res['token'];
            return this.localStorage.setItem(AppConstants.AUTH_CACHE_KEY, authToken)
              .pipe(switchMap<boolean, AuthInfo>(_ => {
                return this.loginInfo();
              }));
          }
          return of(null);
        }),
        catchError(_ => this.logError('登录失败'))
      );
  }

  loginInfo(): Observable<AuthInfo> {
    return this.http.get<AuthInfo>('/api/user/')
      .pipe(
        catchError(_ => of(null)),
        tap(res => {
          if (!!res) {
            this.authInfo = res;
          }
        })
      );
  }

  logout(): Observable<boolean> {
    return this.http.post('/api/logout/', {}, {observe: 'response'})
      .pipe(
        catchError(_ => this.logError('退出失败')),
        switchMap<HttpResponse<any>, boolean>(res => {
          if (res.status === 200) {
            return this.removeAuthorizationToken();
          }
          return of(false);
        })
      );
  }

  removeAuthorizationToken(): Observable<boolean> {
    this.authInfo = null;
    return this.localStorage.removeItem(AppConstants.AUTH_CACHE_KEY);
  }

  getAuthorizationToken(): Observable<string> {
    return this.localStorage.getItem(AppConstants.AUTH_CACHE_KEY);
  }

  private logError(msg: string) {
    this.toastr.error(msg);
    return of(null);
  }

}
