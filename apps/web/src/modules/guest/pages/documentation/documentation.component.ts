import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants } from '@monorepo/web-api-client';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
})
export class DocumentationComponent implements OnInit {
  constructor(public titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Documentation`);
  }
}
