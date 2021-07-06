export const platformDotNetCodeSnippets = {
  sample: `
  import { Component } from '@angular/core';
  import { Title } from '@angular/platform-browser';

  @Component({
    selector: 'app-platform-node',
    templateUrl: './platform-node.component.html',
    styleUrls: ['./platform-node.component.scss'],
  })
  export class PlatformNodeComponent {

    constructor(
      public titleService: Title,
    ) {}

    ngOnInit() {
      this.titleService.setTitle('Node getting started');
    }

  }
  `
};
