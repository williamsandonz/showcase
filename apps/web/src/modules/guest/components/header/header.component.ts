import { Component } from '@angular/core';

@Component({
  selector: 'app-header-guest',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderGuestComponent {
  links = [
    {
      text: 'Product',
      path: '/product'
    },
    {
      text: 'Pricing',
      path: '/pricing'
    },
    {
      text: 'Docs',
      path: '/documentation'
    },
    {
      text: 'Login',
      path: '/login'
    },
    {
      text: 'Sign up',
      path: '/sign-up'
    }
  ];
  constructor() {}
}
