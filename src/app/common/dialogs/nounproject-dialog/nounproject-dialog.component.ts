import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { AppConfigService } from '../../app-config.service';
import { BadgeClass } from '../../../issuer/models/badgeclass.model';
import { BaseDialog } from '../base-dialog';
import { NounprojectService } from '../../services/nounproject.service';
import { NounProjectIcon } from '../../model/nounproject.model';

@Component({
	selector: 'nounproject-dialog',
	templateUrl: 'nounproject-dialog.component.html',
	styleUrls: ['./nounproject-dialog.component.css']
})
export class NounprojectDialog extends BaseDialog {
	Array = Array;
	resolveFunc: (BadgeClass) => void;
	rejectFunc: () => void;

	icons: any[] = null;
	maxDisplayedResults = 10;
	order = 'asc';
	
	iconsLoaded: Promise<unknown>;
	iconResults: IconResult[];

	private _searchQuery = "";
	get searchQuery() { return this._searchQuery; }
	set searchQuery(query) {
		this._searchQuery = query;
		this.searchIcons(query);
	}

	constructor(
		protected messageService: MessageService,
		protected configService: AppConfigService,
		componentElem: ElementRef<HTMLElement>,
		protected nounprojectService: NounprojectService,
		renderer: Renderer2,
	) {
		super(componentElem, renderer);
	}

	async openDialog(): Promise<NounProjectIcon> {
		this.showModal();

		return new Promise<NounProjectIcon>((resolve, reject) => {
			this.resolveFunc = resolve;
			this.rejectFunc = reject;
		});
	}

	searchIcons(searchTerm: string) {
		return new Promise(async (resolve, reject) => {
			this.nounprojectService.getNounProjectIcons(searchTerm, 1).then(
				(results) => {
					this.icons = results;
					console.log(results);
					resolve(results);
				},
			);
		});
	}

	closeDialog() {
		this.closeModal();
		this.rejectFunc();
	}

	selectIcon(icon: NounProjectIcon) {
		this.closeModal();
		this.resolveFunc(icon);
	}

	private updateResults(searchTerm: string) {

		// Clear Results
		this.iconResults = [];

		const addBadgeToResults = (icon: any) => {
			// Restrict Length
			if (this.iconResults.length > this.maxDisplayedResults) {
				return false;
			}

			if (!this.iconResults.find(r => r.icon === icon)) {
				// appending the results to the badgeResults array bound to the view template.
				this.iconResults.push(new IconResult(icon, searchTerm));
			}

			return true;
		};
		
		this.icons
			.forEach(addBadgeToResults);
	}
}

class IconResult {
	constructor(public icon: BadgeClass, public issuerName: string) {}
}
