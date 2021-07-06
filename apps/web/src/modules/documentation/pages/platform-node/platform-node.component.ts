import { Component, OnInit } from '@angular/core';
import { IActivePlatformSection, PlatformDocsService } from '../../providers/platform-docs.service';
import { platformNodeCodeSnippets } from './platform-node-code-snippets';

@Component({
  selector: 'app-platform-node',
  templateUrl: './platform-node.component.html',
  styleUrls: ['./platform-node.component.scss'],
})
export class PlatformNodeComponent implements OnInit {

  sections: IActivePlatformSection[] = [
    {
      fragment: 'getting-started',
      title: 'Getting started'
    },
    {
      fragment: 'configuration',
      title: 'Configuration'
    }
  ];;
  snippets = platformNodeCodeSnippets;

  constructor(
    private platformDocsService: PlatformDocsService,
  ) {}

  ngOnInit() {
    this.platformDocsService.activePlatform$.next({
      headingPanelTitle: 'Node docs',
      pageTitle: 'Node docs',
      path: 'node',
      sections: this.sections
    });
  }

  getSection(fragment: string) {
    return this.sections.find(s => s.fragment === fragment);
  }

}

