import { Component, OnInit } from '@angular/core';
import { IActivePlatformSection, PlatformDocsService } from '../../providers/platform-docs.service';
import { platformDotNetCodeSnippets } from './platform-dot-net-code-snippets';

@Component({
  selector: 'app-platform-dot-net',
  templateUrl: './platform-dot-net.component.html',
  styleUrls: ['./platform-dot-net.component.scss'],
})
export class PlatformDotNetComponent implements OnInit {

  sections: IActivePlatformSection[] = [
    {
      fragment: 'getting-started',
      title: 'Getting started'
    },
  ];;
  snippets = platformDotNetCodeSnippets;

  constructor(
    private platformDocsService: PlatformDocsService,
  ) {}

  ngOnInit() {
    this.platformDocsService.activePlatform$.next({
      headingPanelTitle: '.NET docs',
      pageTitle: '.NET docs',
      path: 'dot-net',
      sections: this.sections
    });
  }

  getSection(fragment: string) {
    return this.sections.find(s => s.fragment === fragment);
  }

}

