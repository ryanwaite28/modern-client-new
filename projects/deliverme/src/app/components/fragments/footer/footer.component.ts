import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'deliverme-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear = (new Date()).getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
