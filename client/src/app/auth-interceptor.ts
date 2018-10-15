import {Injectable, Injector} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {switchMap, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Observable, timer} from "rxjs/index";
import {AuthService} from "./auth.service";

/** Pass untouched request through to the next request handler. */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private router: Router,
              private toastr: ToastrService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    return authService.getAuthorizationToken()
      .pipe(switchMap<string, HttpEvent<any>>(res => {
        let authReq;
        if (!!res) {
          authReq = req.clone({
            headers: req.headers.set('Authorization', `Token ${res}`)
          });
        } else {
          authReq = req;
        }
        return next.handle(authReq)
          .pipe(
            tap((event: HttpEvent<any>) => {
              // do nothing
            }, (err: any) => {
              if (err.status === 403) {
                authService.removeAuthorizationToken().subscribe(_ => {
                  // jump later to avoid dead lock
                  const _timer = timer(500);
                  _timer.subscribe(t => {
                    if (this.router.routerState.snapshot.url !== '/login') {
                      this.router.navigate(['/login']);
                    }
                  });
                });
              }
            })
          );
      }));
  }
}
