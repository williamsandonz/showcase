import { Component, ElementRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePlatform, PlatformDocsService } from '../../providers/platform-docs.service';

@Component({
  selector: 'app-platform-navigation',
  templateUrl: './platform-navigation.component.html',
  styleUrls: ['./platform-navigation.component.scss'],
})
export class PlatformNavigationComponent {

  activePlatform: IActivePlatform;
  subscription1: Subscription;

  constructor(
    private elementRef: ElementRef,
    private platformDocsService: PlatformDocsService,
  ) {}

  ngOnInit() {
    this.subscription1 = this.platformDocsService.activePlatform$.subscribe((platform: IActivePlatform) => {
      this.activePlatform = platform;
    });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onResize() {
    const scrollY = window.scrollY;
    const threshold = 300;
    let top = '8px';
    if(scrollY > 300) {
      top = `${scrollY - threshold}px`;
    }
    this.elementRef.nativeElement.querySelector('div').style.top = top;
  }


}
