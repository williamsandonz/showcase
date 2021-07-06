import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../providers';
import { productDotNetGettingStartedCode } from './product-dot-net-getting-started-code';

@Component({
  selector: 'app-product-dot-net',
  templateUrl: './product-dot-net.component.html',
  styleUrls: ['./product-dot-net.component.scss'],
})
export class ProductDotNetComponent implements OnInit {

  constructor(
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.productService.activeProduct$.next({
      heroPanelTitle: '.NET',
      heroPanelDescription: 'Nulla vulputate sodales ante, ut semper magna ultricies id. Curabitur eu bibendum eros, in tincidunt mi.',
      pageTitle: '.NET',
      pathways: [
        {
          docsPath: 'dot-net',
          iconPath: productDotNetGettingStartedCode.stepOne,
          name: 'TODO',
          steps: [
            {
              preamble: '<p>Add <a href="https://www.google.com" target="_blank">@sentry/node</a> as a dependency:</p>',
              code: productDotNetGettingStartedCode.stepOne,
            },
            {
              preamble: '<p>Initialize the Sentry SDK and install the on error hook:</p>',
              code: productDotNetGettingStartedCode.stepTwo,
            }
          ],
          uriPath: 'dot-net',
        }
      ],
      uriPath: 'dot-net',
    });
  }

}
