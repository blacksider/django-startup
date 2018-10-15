import {Component, OnInit} from "@angular/core";
import {TreeService} from "../tree.service";
import {Page} from "../../common/page";
import {TreeDetail} from "../tree-detail/tree-detail";
import {QueryPage} from "../../common/query-page";

import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.less']
})
export class TreeListComponent implements OnInit {
  data = new Page<TreeDetail>();
  queryPage = new QueryPage();
  isLoading = true;

  constructor(private treeService: TreeService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.treeService.list(this.queryPage).subscribe(res => {
      this.data = res;
      this.isLoading = false;
    });
  }

  pageChanged(event: any) {
    this.queryPage.page = event.page;
    this.load();
  }

  deleteData(id: number) {
    this.treeService.deleteData(id).subscribe(ok => {
      this.toastr.success('删除成功');
      this.load();
    }, error => {
      console.log(error);
      this.toastr.error('删除失败');
    });
  }
}
