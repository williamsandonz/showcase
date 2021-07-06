import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../providers';
import { productNodeGettingStartedCode } from './product-node-getting-started-code';
import { productNodeGettingStartedIcons } from './product-node-getting-started-icons';

@Component({
  selector: 'app-product-node',
  templateUrl: './product-node.component.html',
  styleUrls: ['./product-node.component.scss'],
})
export class ProductNodeComponent implements OnInit {

  constructor(
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.productService.activeProduct$.next({
      heroPanelTitle: 'Node',
      heroPanelDescription: 'Nulla vulputate sodales ante, ut semper magna ultricies id. Curabitur eu bibendum eros, in tincidunt mi.',
      pageTitle: 'Node',
      pathways: [
        {
          docsPath: 'node',
          iconPath: productNodeGettingStartedIcons.koa,
          name: 'Koa',
          steps: [
            {
              preamble: '<p>Add <a href="https://www.google.com" target="_blank">@sentry/node</a> as a dependency:</p>',
              code: productNodeGettingStartedCode.koaStepOne
            },
            {
              preamble: '<p>Initialize the Sentry SDK and install the on error hook:</p>',
              code: productNodeGettingStartedCode.koaStepTwo
            }
          ],
          uriPath: 'node',
        },
        {
          docsPath: 'node',
          iconPath: productNodeGettingStartedIcons.express,
          name: 'express',
          steps: [
            {
              preamble: '<p>Add <a href="https://www.google.com" target="_blank">@sentry/node</a> as a dependency:</p>',
              code: productNodeGettingStartedCode.expressStepOne
            },
            {
              preamble: '<p>Sentry should be initialized as early in your app as possible:</p>',
              code: productNodeGettingStartedCode.expressStepTwo
            }
          ],
          uriPath: 'node',
        }
      ],
      uriPath: 'node',
    });
  }

}
