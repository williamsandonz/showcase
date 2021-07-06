import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-platforms',
  templateUrl: './platforms.component.html',
  styleUrls: ['./platforms.component.scss'],
})
export class PlatformsComponent implements OnInit {

  platforms: any[];

  constructor(
  ) {}

  ngOnInit() {
    const basePath = '/docs/platform';
    this.platforms = [
      {
        imagePath: 'https://via.placeholder.com/50x50',
        name: 'Node.js',
        path: `${basePath}/node`,
      },
      {
        imagePath: 'https://via.placeholder.com/50x50',
        name: '.NET',
        path: `${basePath}/dot-net`,
      },
    ];
  }

}
