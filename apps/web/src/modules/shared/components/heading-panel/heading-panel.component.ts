import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-heading-panel',
  templateUrl: './heading-panel.component.html',
  styleUrls: ['./heading-panel.component.scss'],
})
export class HeadingPanelComponent {
  @Input() title: string;
}
