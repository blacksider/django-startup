import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {BsDropdownModule, PaginationModule} from "ngx-bootstrap";

import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {AppRoutingModule} from "./app-routing.module";
import {MainComponent} from "./main/main.component";
import {AuthInterceptor} from "./auth-interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { TreeComponent } from './tree/tree.component';
import { SettingComponent } from './setting/setting.component';
import { UserComponent } from './user/user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TreeListComponent } from './tree/tree-list/tree-list.component';
import { TreeDetailComponent } from './tree/tree-detail/tree-detail.component';
import { TreeEditComponent } from './tree/tree-edit/tree-edit.component';

const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    TreeComponent,
    SettingComponent,
    UserComponent,
    PageNotFoundComponent,
    TreeListComponent,
    TreeDetailComponent,
    TreeEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true,
      maxOpened: 3,
      autoDismiss: true,
      timeOut: 2000
    }),
    AppRoutingModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
