import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActiveProduct, IGettingStartedPathway, ProductService } from '../../providers';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class GettingStartedComponent implements OnInit {

  activeProduct: IActiveProduct;
  selectedPathway: IGettingStartedPathway;
  subscription1: Subscription;

  constructor(
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.subscription1 = this.productService.activeProduct$.subscribe((p) => {
      this.activeProduct = p;
      for(const pathway of this.activeProduct.pathways) {
        for(const step of pathway.steps) {
          step.code = step.code.replace(/^\n/, '');
        }
      }
      this.selectedPathway = this.activeProduct.pathways[0];
    });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

  onClickPathway(pathway: IGettingStartedPathway) {
    this.selectedPathway = pathway;
  }

}
