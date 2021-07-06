import { Component, Input } from '@angular/core';
import Player from '@vimeo/player';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-vimeo-video',
  templateUrl: './vimeo-video.component.html',
  styleUrls: ['./vimeo-video.component.scss'],
})
export class VimeoVideoComponent {

  displayVideo = false;
  @Input() id: number;
  targetElementId = uuidv4();

  constructor(
  ) {

  }

  onImageClicked() {
    const player = new Player(this.targetElementId, {
      autoplay: true,
      id: this.id,
      responsive: true,
    });
    this.displayVideo = true;
  }

}
