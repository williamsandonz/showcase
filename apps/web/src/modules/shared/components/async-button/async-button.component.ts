import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-async-button',
  templateUrl: './async-button.component.html',
  styleUrls: ['./async-button.component.scss'],
})
export class AsyncButtonComponent implements OnInit {
  @Input() processing;

  constructor() {}

  ngOnInit() {}

  onContentClick(event: MouseEvent) {
    if (this.processing) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
