import {Directive, ElementRef, Renderer} from '@angular/core';

export class StyledDirective {
    constructor(public el: ElementRef, public renderer: Renderer) {

        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');
    }
}