import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'common-modal-overlay',
  templateUrl: './modal-overlay.component.html',
  styleUrls: ['./modal-overlay.component.scss']
})
export class CommonModalOverlayComponent implements OnInit, AfterViewInit, OnDestroy {
  // example: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal

  @ViewChild('myModal') myModal?: ElementRef<HTMLDivElement>;
  @ViewChild('closeBtn') closeBtn?: ElementRef<HTMLSpanElement>;

  @Input() title: string = '';

  @Output() closeTriggered = new EventEmitter<void>();

  closeBtnCallback = (event: MouseEvent) => {
    event.stopPropagation();
    // console.log(`btn click from modal component.`, event);
    this.closeTriggered.emit();
  }
  windowClickCallback = (event: MouseEvent) => {
    event.stopPropagation();
    if (event.target == this.myModal?.nativeElement) {
      // console.log(`window click outside modal component.`, event);
      this.closeTriggered.emit();
    }
  }

  constructor() { }

  ngOnInit(): void {
    window.document.body.style.overflow = `hidden`;
  }

  ngAfterViewInit(): void {
    this.closeBtn?.nativeElement.addEventListener(`click`, this.closeBtnCallback);
    window.addEventListener(`click`, this.windowClickCallback);
  }

  ngOnDestroy(): void {
    // console.log(`Modal closing...`);
    window.document.body.style.overflow = `auto`;
    this.closeBtn?.nativeElement.removeEventListener(`click`, this.closeBtnCallback);
    window.removeEventListener(`click`, this.windowClickCallback);
  }
}
