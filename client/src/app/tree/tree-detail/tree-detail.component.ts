import {Component, OnInit} from "@angular/core";
import {TreeDetail} from "./tree-detail";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-tree-detail',
  templateUrl: './tree-detail.component.html',
  styleUrls: ['./tree-detail.component.less']
})
export class TreeDetailComponent implements OnInit {
  data: TreeDetail;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { tree: TreeDetail }) => {
        this.data = data.tree;
      });
  }

}
