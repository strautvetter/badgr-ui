import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CmsApiService } from '../../services/cms-api.service';

@Component({
	selector: 'cms-page',
	template: `
		<cms-content [headline]="headline" [content]="content" />
	`
})
export class CmsPostListComponent implements OnInit {

	headline = 'News';
	content = '';

	constructor(
		protected cmsApiService: CmsApiService,
	) {

	}

	async ngOnInit() {
		const posts = await this.cmsApiService.getPosts();
		let content = '';
		posts.forEach((p) => {
			content += `
				<h2 class="tw-font-black tw-text-purple tw-text-[30px] tw-leading-[36px] md:tw-text-[46px] md:tw-leading-[55.2px]"><a href="${p.slug}">${p.post_title}</a></h2>
				<div>${p.post_excerpt || p.post_content}</div>
			`;
		});
		this.content = content;
	}
}
