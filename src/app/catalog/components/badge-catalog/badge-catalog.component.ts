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
import { BadgeClass } from '../../../issuer/models/badgeclass.model';
import { BadgeClassManager } from '../../../issuer/services/badgeclass-manager.service';
import { StringMatchingUtil } from '../../../common/util/string-matching-util';

@Component({
	selector: 'app-badge-catalog',
	templateUrl: './badge-catalog.component.html',
	styleUrls: ['./badge-catalog.component.css'],
})
export class BadgeCatalogComponent extends BaseRoutableComponent implements OnInit {
	readonly issuerPlaceholderSrc = preloadImageURL(
		require('../../../../breakdown/static/images/placeholderavatar-issuer.svg') as string
	);
	readonly noIssuersPlaceholderSrc =
		require('../../../../../node_modules/@concentricsky/badgr-style/dist/images/image-empty-issuer.svg') as string;

	Array = Array;

	// issuers: Issuer[] = null;
	badges: BadgeClass[] = null;
	badgeResults: BadgeClass[] = null;
	order = 'asc';
	//issuerToBadgeInfo: {[issuerId: string]: IssuerBadgesInfo} = {};

	// issuersLoaded: Promise<unknown>;
	badgesLoaded: Promise<unknown>;

	showLegend = false;

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
			'=1': '1 Badge',
			other: '# Badges',
		},
		recipient: {
			'=0': 'No Recipients',
			'=1': '1 Recipient',
			other: '# Recipients',
		},
	};

	private _searchQuery = "";
	get searchQuery() { return this._searchQuery; }
	set searchQuery(query) {
		this._searchQuery = query;
		// this.saveDisplayState();
		this.updateResults();
	}

	constructor(
		protected title: Title,
		protected messageService: MessageService,
		// protected issuerManager: IssuerManager,
		protected configService: AppConfigService,
		protected badgeClassService: BadgeClassManager,
		// loginService: SessionService,
		router: Router,
		route: ActivatedRoute
	) {
		super(router, route);
		title.setTitle(`Badges - ${this.configService.theme['serviceName'] || 'Badgr'}`);

		// subscribe to issuer and badge class changes
		this.badgesLoaded = this.loadBadges();
	}

	async loadBadges() {
		return new Promise(async (resolve, reject) => {
			this.badgeClassService.allPublicBadges$.subscribe(
				(badges) => {
					this.badges = badges.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
					this.badgeResults = this.badges;
					resolve(badges);
				},
				(error) => {
					this.messageService.reportAndThrowError('Failed to load badges', error);
				}
			);
		});
	}

	async getIssuer(badge: BadgeClass): Promise<Issuer> {
		const im = badge.issuerManager;
		const issuer = await im.issuerBySlug(badge.issuerSlug);

		return issuer;
	}

	ngOnInit() {
		super.ngOnInit();
	}

	changeOrder(order){
		if(order === 'asc'){
			this.badgeResults.sort((a,b) => a.name.localeCompare(b.name))
		} else {
			this.badgeResults.sort((a,b) => b.name.localeCompare(a.name))
		}
	}

	private updateResults() {

		let that = this;
		// Clear Results
		this.badgeResults = [];

		var addIssuerToResults = function(item){
			that.badgeResults.push(item);
		}
		this.badges
			.filter(MatchingAlgorithm.issuerMatcher(this.searchQuery))
			.forEach(addIssuerToResults);

		// this.allBadges
		// 	.filter(MatchingAlgorithm.badgeMatcher(this._searchQuery))
		// 	.forEach(addBadgeToResults);

		this.badgeResults.sort((a,b) => a.name.localeCompare(b.name))
	}

	openLegend(){
		this.showLegend = true;
	}

	closeLegend() {
		this.showLegend = false;
	}
}


class MatchingAlgorithm {
	static issuerMatcher(inputPattern: string): (badge) => boolean {
		const patternStr = StringMatchingUtil.normalizeString(inputPattern);
		const patternExp = StringMatchingUtil.tryRegExp(patternStr);

		return badge => (
			StringMatchingUtil.stringMatches(badge.name, patternStr, patternExp)
		);
	}
}
