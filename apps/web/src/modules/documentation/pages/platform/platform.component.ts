import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { IActivePlatform, PlatformDocsService } from '../../providers/platform-docs.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss'],
})
export class PlatformComponent implements OnInit, OnDestroy, AfterContentChecked {

  activePlatform: IActivePlatform;
  headingPanelTitle: string;
  subscription1: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private platformDocsService: PlatformDocsService,
    public titleService: Title,
  ) {}

  ngOnInit() {
    this.subscription1 = this.platformDocsService.activePlatform$.subscribe((platform: IActivePlatform) => {
      this.activePlatform = platform;
      this.titleService.setTitle(this.activePlatform.pageTitle);
      this.headingPanelTitle = this.activePlatform.headingPanelTitle;
    });
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

}
