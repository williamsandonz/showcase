import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

const baseProductPath = '/product/for';

@Component({
  selector: 'app-product-menu',
  templateUrl: './product-menu.component.html',
  styleUrls: ['./product-menu.component.scss'],
})
export class ProductMenuComponent implements OnChanges {

  @Input() exclude: string;
  @ViewChild(MatMenu, { static: true }) menu: MatMenu;

  originalProducts = [
    {
      title: '.NET',
      path: `${baseProductPath}/dot-net`
    },
    {
      title: 'Node',
      path: `${baseProductPath}/node`
    }
  ];
  products = [...this.originalProducts];

  constructor(
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.exclude.currentValue) {
      this.products = this.originalProducts.filter(p => !p.path.includes(this.exclude));
    }
  }

}

