/**
 * Created by Snart on 2018/10/15.
 */
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {TreeService} from "../tree.service";
import {Observable, of} from "rxjs/index";
import {TreeDetail} from "../tree-detail/tree-detail";

@Injectable({
  providedIn: 'root',
})
export class TreeEditDetailResolverService implements Resolve<TreeDetail> {
  constructor(private treeService: TreeService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TreeDetail> | Observable<never> {
    let id = Number.parseInt(route.queryParamMap.get('id'));
    if (Number.isNaN(id)) {
      return of(new TreeDetail());
    }
    return this.treeService.getDetail(id);
  }
}
