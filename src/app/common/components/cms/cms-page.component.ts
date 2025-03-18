import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CmsApiService } from '../../services/cms-api.service';
import { CmsApiPage, CmsApiPost } from '../../model/cms-api.model';
import { AppConfigService } from '../../app-config.service';

@Component({
	selector: 'cms-page',
	template: `
		<cms-content [headline]="headline" [content]="content" />
	`
})
export class CmsPageComponent implements OnInit {

	headline: SafeHtml;
	content: SafeHtml;

	constructor(
		private route: ActivatedRoute,
		protected cmsApiService: CmsApiService,
	) {

	}

	ngOnInit() {
		const slug = this.route.snapshot.params['slug'];
		this.route.data.subscribe(async (data) => {
			let type = 'page';
			if (data.cmsContentType) {
				type = data.cmsContentType;
			}
			let content: CmsApiPage|CmsApiPost;
			if (type == 'page') {
				content = await this.cmsApiService.getPageBySlug(slug);
			} else if (type == 'post') {
				content = await this.cmsApiService.getPostBySlug(slug);
			}
			if (content) {
				this.headline = content.post_title;
				this.content = content.post_content;
			}
		});

	}
}
