import { Component,  Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
	selector: 'shadow-dom',
	template: `
		<link *ngFor="let url of styleUrls" rel="stylesheet" href="http://ui.badgr.test:8000/cms/style" (load)="stylesOnLoad($event)">
		<div #styleWrap></div>
		<div #contentWrap *ngIf="!styleUrls || stylesLoaded >= styleUrls.length" [innerHTML]="_content"></div>
	`,
	encapsulation: ViewEncapsulation.ShadowDom,
	standalone: false,
})
export class ShadowDomComponent {

	@Input() content: string;
	_content: SafeHtml = "";

	@Input() styleUrls: string[] = [];
	stylesLoaded = 0;

	@Input() styles: string;

	@ViewChild('styleWrap') styleWrap;
	styleEl: HTMLStyleElement;

	@ViewChild('contentWrap') contentWrap;

	constructor(
		private domSanitizer: DomSanitizer,
		private router: Router,
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
			this.contentWrap.nativeElement.removeEventListener('click', this.bindLinks.bind(this));
			this.contentWrap.nativeElement.addEventListener('click', this.bindLinks.bind(this));
		}
	}

	stylesOnLoad() {
		this.stylesLoaded += 1
	}

	bindLinks(e: MouseEvent) {
		if ((e.target as HTMLElement).nodeName == 'A') {
			const a = e.target as HTMLAnchorElement;
			if (a.href) {
				const url = new URL(a.href);
				if (url.origin == location.origin) {
					this.router.navigate([url.pathname]);
					e.preventDefault();
				}
			}
		}
	}
}
