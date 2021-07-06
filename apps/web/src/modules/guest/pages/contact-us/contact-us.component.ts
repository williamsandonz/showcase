import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'apps/web/src/environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {

  salesEmail = environment.email.sales.replace('@',' {at} ');

  constructor(public titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(`Contact us`);
  }
}
