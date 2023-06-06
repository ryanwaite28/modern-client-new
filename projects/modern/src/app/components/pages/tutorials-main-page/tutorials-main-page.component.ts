import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'modern-tutorials-main-page',
  templateUrl: './tutorials-main-page.component.html',
  styleUrls: ['./tutorials-main-page.component.scss']
})
export class TutorialsMainPageComponent implements OnInit {

  tutorial_pages = [
    { text: `Installing the App`, href: ['/', 'tutorials', 'installing'] },
    { text: `Initial Screen`, href: ['/', 'tutorials', 'initial-screen'] },
    { text: `Sign Up`, href: ['/', 'tutorials', 'signup'] },
    { text: `Log In`, href: ['/', 'tutorials', 'login'] },
    { text: `Setting up Stripe Connect`, href: ['/', 'tutorials', 'setting-up-stripe-connect'] },
    { text: `Verifying your identity with Stripe Identity`, href: ['/', 'tutorials', 'stripe-identity-verification'] },
    { text: `Using Stripe Customer Account`, href: ['/', 'tutorials', 'stripe-customer-account'] },
    { text: `Creating/Managing a Delivery Listing (Customer)`, href: ['/', 'tutorials', 'create-manage-delivery-listing'] },
    { text: `Search for and Fulfilling a Delivery Listing (Service Provider)`, href: ['/', 'tutorials', 'search-fulfill-delivery-listing'] },
    { text: `View Stripe Connected Account Profile`, href: ['/', 'tutorials', 'stripe-connect-account-profile'] },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
