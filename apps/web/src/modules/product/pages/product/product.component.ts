import { AfterContentChecked, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants } from '@monorepo/web-api-client';
import { Subscription } from 'rxjs';
import { IActiveProduct, ProductService } from '../../providers';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy, AfterContentChecked {

  activeProduct: IActiveProduct;
  appName = constants.appName;
  subscription1: Subscription;
  @HostBinding('class') cssClass;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private productService: ProductService,
    public titleService: Title,
  ) {}

  ngOnInit() {
    this.subscription1 = this.productService.activeProduct$.subscribe((product: IActiveProduct) => {
      this.activeProduct = product;
      this.cssClass = `platform-page platform-${this.activeProduct.uriPath}`;
      this.titleService.setTitle(`${constants.appName} for ${this.activeProduct.pageTitle}`);
    });
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

}
