import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { productFaqs } from './faqs';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FAQsComponent implements OnInit {

  expandedPanelIndex: number;
  items = productFaqs;

  constructor(
  ) {}

  ngOnInit() {
  }

  onPanelOpened(index?: number) {
    this.expandedPanelIndex = index;
  }

  onPanelClosed(index?: number) {
    if(this.expandedPanelIndex === index) {
      this.expandedPanelIndex = null;
    }

  }

}
