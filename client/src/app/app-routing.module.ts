import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {MainComponent} from "./main/main.component";
import {AuthValidatorService} from "./auth-validator.service";
import {TreeComponent} from "./tree/tree.component";
import {SettingComponent} from "./setting/setting.component";
import {UserComponent} from "./user/user.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {TreeListComponent} from "./tree/tree-list/tree-list.component";
import {TreeDetailComponent} from "./tree/tree-detail/tree-detail.component";
import {TreeEditComponent} from "./tree/tree-edit/tree-edit.component";
import {TreeDetailResolverService} from "./tree/tree-detail/tree-detail-resolver";
import {TreeEditDetailResolverService} from "./tree/tree-edit/tree-edit-detail-resolver";

const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {
    path: 'main', component: MainComponent,
    canActivate: [AuthValidatorService],
    children: [
      {path: '', redirectTo: 'tree', pathMatch: 'full'},
      {
        path: 'tree', component: TreeComponent,
        canActivate: [AuthValidatorService],
        canActivateChild: [AuthValidatorService],
        children: [
          {path: '', redirectTo: 'list', pathMatch: 'full'},
          {
            path: 'list', component: TreeListComponent
          },
          {
            path: 'edit', component: TreeEditComponent,
            resolve: {
              tree: TreeEditDetailResolverService
            }
          },
          {
            path: 'detail', component: TreeDetailComponent,
            resolve: {
              tree: TreeDetailResolverService
            }
          }
        ]
      },
      {
        path: 'setting', component: SettingComponent,
        canActivate: [AuthValidatorService],
        canActivateChild: [AuthValidatorService]
      },
      {
        path: 'user', component: UserComponent,
        canActivate: [AuthValidatorService],
        canActivateChild: [AuthValidatorService]
      }
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
