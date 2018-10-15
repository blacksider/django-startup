/**
 * Created by Snart on 2018/10/15.
 */
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {TreeDetail} from "./tree-detail";
import {TreeService} from "../tree.service";
import {EMPTY, Observable, of} from "rxjs/index";
import {catchError, mergeMap} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root',
})
export class TreeDetailResolverService implements Resolve<TreeDetail> {
  constructor(private treeService: TreeService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TreeDetail> | Observable<never> {
    let id = Number.parseInt(route.queryParamMap.get('id'));
    if (Number.isNaN(id)) {
      this.router.navigate(['/main/tree/list']);
      return EMPTY;
    }
    return this.treeService.getDetail(id).pipe(
      catchError(e => {
        return of(null);
      }),
      mergeMap(crisis => {
        if (crisis) {
          return of(crisis);
        } else {
          this.router.navigate(['/main/tree/list']);
          return EMPTY;
        }
      })
    );
  }
}
