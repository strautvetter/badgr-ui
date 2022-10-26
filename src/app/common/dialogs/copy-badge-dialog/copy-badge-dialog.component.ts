import { Component, ElementRef, OnInit, Renderer2, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../common/services/message.service';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from '../../../common/app-config.service';
import { BaseRoutableComponent } from '../../../common/pages/base-routable.component';
import { BadgeClass } from '../../../issuer/models/badgeclass.model';
import { BadgeClassManager } from '../../../issuer/services/badgeclass-manager.service';
import { BaseDialog } from '../base-dialog';

// somehow this is always constructed??

@Component({
	selector: 'copy-badge-dialog',
	templateUrl: 'copy-badge-dialog.component.html',
})
export class CopyBadgeDialog extends BaseDialog {
	Array = Array;
	resolveFunc: (BadgeClass) => void;
	rejectFunc: () => void;

	badges: BadgeClass[] = null;
	badgeResults: BadgeClass[] = null;
	order = 'asc';
	
	badgesLoaded: Promise<unknown>;

	private _searchQuery = "";
	get searchQuery() { return this._searchQuery; }
	set searchQuery(query) {
		this._searchQuery = query;
		this.updateResults();
	}

	constructor(
		protected messageService: MessageService,
		protected configService: AppConfigService,
		protected badgeClassService: BadgeClassManager,
		componentElem: ElementRef<HTMLElement>,
		renderer: Renderer2,
	) {
		super(componentElem, renderer);
	}

	async openDialog(): Promise<void> {
		this.badgesLoaded = this.loadBadges();
		this.showModal();

		return new Promise<void>((resolve, reject) => {
			this.resolveFunc = resolve;
			this.rejectFunc = reject;
		});
	}

	closeDialog() {
		this.closeModal();
		this.rejectFunc();
	}

	copyBadge(badge) {
		this.closeModal();
		this.resolveFunc(badge);
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

	private updateResults() {

		let that = this;
		// Clear Results
		this.badgeResults = [];

		var addIssuerToResults = function(item){
			that.badgeResults.push(item);
		}
		this.badges
			.forEach(addIssuerToResults);

		this.badgeResults.sort((a,b) => a.name.localeCompare(b.name))
	}
}

