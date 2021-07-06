import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PlatformDocsService {

  activePlatform$ = new Subject<IActivePlatform>();

  constructor() {}

}

export interface IActivePlatform {
  headingPanelTitle: string;
  pageTitle: string;
  path: string;
  sections: IActivePlatformSection[];
}
export interface IActivePlatformSection {
  fragment: string;
  title: string;
}
