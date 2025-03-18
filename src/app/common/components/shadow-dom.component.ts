import { Component,  Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'shadow-dom',
	template: `
		<link *ngFor="let url of styleUrls" rel="stylesheet" href="http://ui.badgr.test:8000/cms/style" (load)="stylesOnLoad($event)">
		<div #styleWrap></div>
		<div *ngIf="!styleUrls || stylesLoaded >= styleUrls.length" [innerHTML]="_content"></div>
	`,
	encapsulation: ViewEncapsulation.ShadowDom
})
export class ShadowDomComponent {

	@Input() content: string;
	_content: SafeHtml = "";

	@Input() styleUrls: string[] = [];
	stylesLoaded = 0;

	@Input() styles: string;

	@ViewChild('styleWrap') styleWrap;
	styleEl: HTMLStyleElement;

	constructor(
		private domSanitizer: DomSanitizer,
	) {
	}

	ngOnChanges() {
		if (this.styles) {
			// create style tag via js api, because angular won't allow it in template
			if (!this.styleEl) {
				this.styleEl = document.createElement('style');
				this.styleEl.setAttribute('type', 'text/css');
				this.styleWrap.nativeElement.appendChild(this.styleEl);
			}
			this.styleEl.innerHTML = '';
			this.styleEl.appendChild(document.createTextNode(this.styles));
		}
		if (this.content) {
			this._content = this.domSanitizer.bypassSecurityTrustHtml(this.content);
		}
	}

	stylesOnLoad() {
		this.stylesLoaded += 1
	}
}