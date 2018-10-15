import {Component, OnInit} from "@angular/core";
import {TreeDetail} from "../tree-detail/tree-detail";
import {ActivatedRoute, Router} from "@angular/router";
import {TreeService} from "../tree.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-tree-edit',
  templateUrl: './tree-edit.component.html',
  styleUrls: ['./tree-edit.component.less']
})
export class TreeEditComponent implements OnInit {
  data: TreeDetail;

  constructor(private route: ActivatedRoute, private treeService: TreeService,
              private router: Router, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { tree: TreeDetail }) => {
        this.data = data.tree;
      });
  }

  save() {
    this.treeService.save(this.data).subscribe(res => {
      if (res) {
        this.toastr.success('保存成功');
        this.router.navigate(['/main/tree/detail'], {queryParams: {id: res.id ? res.id : this.data.id}})
      }
    }, error => {
      this.toastr.error('保存失败');
    });
  }
}
