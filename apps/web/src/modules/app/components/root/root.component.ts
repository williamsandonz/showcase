import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService, StorageService } from './../../../shared/providers';

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
  ) {}

  ngOnInit() {
    this.cognitoService.onAppInit();
    this.storageService.onAppInit();
  }
}
