import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../common/services/session.service';
import { BaseAuthenticatedRoutableComponent } from '../../../common/pages/base-authenticated-routable.component';
import { MessageService } from '../../../common/services/message.service';
import { IssuerManager } from '../../../issuer/services/issuer-manager.service';
//import {BadgeClassManager} from '../../services/badgeclass-manager.service';
import { Issuer } from '../../../issuer/models/issuer.model';
//import {BadgeClass} from '../../models/badgeclass.model';
import { Title } from '@angular/platform-browser';
import { preloadImageURL } from '../../../common/util/file-util';
import { AppConfigService } from '../../../common/app-config.service';
import { BaseRoutableComponent } from '../../../common/pages/base-routable.component';

@Component({
	selector: 'app-issuer-catalog',
	templateUrl: './issuer-catalog.component.html',
	styleUrls: ['./issuer-catalog.component.css'],
})
export class IssuerCatalogComponent extends BaseRoutableComponent implements OnInit {
	readonly issuerPlaceholderSrc = preloadImageURL(
		require('../../../../breakdown/static/images/placeholderavatar-issuer.svg') as string
	);
	readonly noIssuersPlaceholderSrc =
		require('../../../../../node_modules/@concentricsky/badgr-style/dist/images/image-empty-issuer.svg') as string;

	Array = Array;

	issuers: Issuer[] = null;
	//badges: BadgeClass[] = null;
	//issuerToBadgeInfo: {[issuerId: string]: IssuerBadgesInfo} = {};

	issuersLoaded: Promise<unknown>;
	//badgesLoaded: Promise<unknown>;

	get theme() {
		return this.configService.theme;
	}
	get features() {
		return this.configService.featuresConfig;
	}

	plural = {
		issuer: {
			'=0': 'No Issuers',
			'=1': '1 Issuer',
			other: '# Issuers',
		},
		badges: {
			'=0': 'No Badges',
			'=1': '<strong class="u-text-bold">1</strong> Badge',
			other: '<strong class="u-text-bold">#</strong> Badges',
		},
		recipient: {
			'=0': 'No Recipients',
			'=1': '1 Recipient',
			other: '# Recipients',
		},
	};

	constructor(
		protected title: Title,
		protected messageService: MessageService,
		protected issuerManager: IssuerManager,
		protected configService: AppConfigService,
		//protected badgeClassService: BadgeClassManager,
		// loginService: SessionService,
		router: Router,
		route: ActivatedRoute
	) {
		super(router, route);
		title.setTitle(`Issuers - ${this.configService.theme['serviceName'] || 'Badgr'}`);

		// subscribe to issuer and badge class changes
		this.issuersLoaded = this.loadIssuers();
	}

	async loadIssuers() {
		return new Promise(async (resolve, reject) => {
			this.issuerManager.getAllIssuers().subscribe(
				(issuers) => {
					console.log(issuers);
					this.issuers = issuers.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
					resolve(issuers);
				},
				(error) => {
					this.messageService.reportAndThrowError('Failed to load issuers', error);
				}
			);
		});
	}

	ngOnInit() {
		super.ngOnInit();
	}
}
