import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-async-button',
  templateUrl: './async-button.component.html',
  styleUrls: ['./async-button.component.scss'],
})
export class AsyncButtonComponent implements OnInit {

  displaySuccessMessage: boolean;
  @Input() processing;
  @Input() success: boolean;
  @Input() successMessage = 'Your changes have been saved succesfully';

  constructor() {}

  ngOnInit() {
    this.displaySuccessMessage = this.success !== undefined && this.success !== null;
  }

  onContentClick(event: MouseEvent) {
    if (this.processing) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
