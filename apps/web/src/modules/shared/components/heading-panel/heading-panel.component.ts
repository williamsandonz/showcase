import { Component, HostBinding, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heading-panel',
  templateUrl: './heading-panel.component.html',
  styleUrls: ['./heading-panel.component.scss'],
})
export class HeadingPanelComponent {

  @HostBinding('class.has-back-button') @Input() backButtonUri: string;
  @Input() backButtonText: string;
  @Input() title: string;
  @HostBinding('class.has-sub-heading') @Input() subHeading: string;

  constructor(
    private router: Router
  ) {

  }

  onBackButtonClicked() {
    this.router.navigate([this.backButtonUri]);
  }

}
