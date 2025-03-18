import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppConfigService } from '../../app-config.service';
import { CmsApiService } from '../../services/cms-api.service';
import { CmsManager } from '../../services/cms-manager.service';

@Component({
	selector: 'cms-content',
	template: `
	<div class="oeb">
		<div class="page-padding">
			<div class="tw-overflow-hidden">
				<h1 class="tw-font-black tw-text-purple md:tw-leading-[55.2px] md:tw-text-[46px] tw-leading-[36px] tw-text-[30px] tw-mb-6">{{headline}}</h1>
				<shadow-dom [content]="_content" [styleUrls]="styleUrls" [styles]="styles" />
			</div>
		</div>
	</div>
	`
})
export class CmsContentComponent {

	@Input() headline: string;
	@Input() content: string;
	_content: string

	styles: string;
	styleUrls: string[];

	constructor(
		// private configService: AppConfigService,
		private cmsManager: CmsManager,
	) {
		// styles for <link> elements
		// this.styleUrls = [
		// 	`${this.configService.apiConfig.baseUrl}/cms/style`
		// ];

		// styles as <style> element
		cmsManager.styles$.subscribe((s) => {
			this.styles = s;
		})
	}

	ngOnChanges() {
		if (this.content) {
			// make sure styles were loaded first
			this.cmsManager.styles$.subscribe((s) => {
				this._content = `
					${this.content}
				`;
			});
		}
	}
}
