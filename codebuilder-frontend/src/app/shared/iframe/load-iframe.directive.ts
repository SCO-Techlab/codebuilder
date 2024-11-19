import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLoadIframe]'
})

export class LoadIframeDirective {

  @Output() loadIframe: EventEmitter<boolean>;

  constructor(private elementRef: ElementRef) { 
    this.loadIframe = new EventEmitter<boolean>();
  }

  @HostListener('load')
  public onLoad() {
    if (!this.elementRef.nativeElement.contentDocument || this.elementRef.nativeElement.contentDocument.body.children.length > 0) {
      this.loadIframe.emit(true);
    }
  }
}