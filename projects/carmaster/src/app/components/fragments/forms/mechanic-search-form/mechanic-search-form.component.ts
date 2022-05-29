import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'carmaster-mechanic-search-form',
  templateUrl: './mechanic-search-form.component.html',
  styleUrls: ['./mechanic-search-form.component.scss']
})
export class MechanicSearchFormComponent implements OnInit {
  @ViewChild('formElm') formElm!: ElementRef<HTMLFormElement>;

  @Output() formSubmit = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
