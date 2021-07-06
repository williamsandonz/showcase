import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oauth-logout-callback',
  templateUrl: './oauth-logout-callback.component.html',
  styleUrls: ['./oauth-logout-callback.component.scss'],
})
export class OAuthLogoutCallbackComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {
    this.router.navigate(['/']);
  }
}
