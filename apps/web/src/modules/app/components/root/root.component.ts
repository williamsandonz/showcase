import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Environments } from '@monorepo/common';
import { environment } from 'apps/web/src/environments/environment';
import { CognitoService, StorageService } from './../../../shared/providers';
import { UtilityService } from './../../../shared/providers';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  constructor(
    public cognitoService: CognitoService,
    public storageService: StorageService,
    public router: Router,
    public utilityService: UtilityService
  ) {}

  ngOnInit() {
    console.log(environment.environmentName === Environments.PRODUCTION ? environment.system : environment);
    this.cognitoService.onAppInit();
    this.storageService.onAppInit();
    this.utilityService.onAppInit(this.router);
  }
}
