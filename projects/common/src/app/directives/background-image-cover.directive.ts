import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[bgImgCover]'
})
export class BackgroundImageCoverDirective implements OnInit {
  @Input() bgImgCover: any;
  @Input() height?: string;

  constructor(
    private el: ElementRef
  ) {}
  
  ngOnInit() {
    this.el.nativeElement.style.backgroundImage = `url('${this.bgImgCover}')`;
    this.el.nativeElement.style.backgroundRepeat = `no-repeat`;
    this.el.nativeElement.style.backgroundSize = `cover`;
    this.el.nativeElement.style.backgroundPosition = `center center`;

    if (this.height) {
      this.el.nativeElement.style.height = this.height;
    }
  }
}
