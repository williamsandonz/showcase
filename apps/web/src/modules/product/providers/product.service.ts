import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ProductService {

  activeProduct$ = new ReplaySubject<IActiveProduct>();

  constructor() {}

}

export interface IActiveProduct {
  heroPanelTitle: string;
  heroPanelDescription: string;
  pageTitle: string;
  pathways: IGettingStartedPathway[];
  uriPath: string;
}

export interface IGettingStartedPathway {
  conclusion?: string;
  docsPath: string;
  iconPath?: string;
  name?: string;
  steps: IGettingStartedStep[];
  uriPath: string;
}
export interface IGettingStartedStep {
  preamble: string;
  code: string;
}
