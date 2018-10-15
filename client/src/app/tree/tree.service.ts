import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {Page} from "../common/page";
import {TreeDetail} from "./tree-detail/tree-detail";
import {QueryPage} from "../common/query-page";

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor(private http: HttpClient) {
  }

  getDetail(id: number): Observable<TreeDetail> {
    return this.http.get<TreeDetail>(`/api/tree/${id}`);
  }

  save(data: TreeDetail): Observable<TreeDetail> {
    return this.http.post<TreeDetail>('/api/tree/', data);
  }

  deleteData(id: number): Observable<any> {
    return this.http.delete<any>(`/api/tree/${id}/del`);
  }

  list(queryPage: QueryPage): Observable<Page<TreeDetail>> {
    return this.http.get<Page<TreeDetail>>(`/api/trees/?page=${queryPage.page}&size=${queryPage.size}`);
  }
}
