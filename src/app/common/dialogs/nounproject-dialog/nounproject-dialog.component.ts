import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { AppConfigService } from '../../app-config.service';
import { BadgeClass } from '../../../issuer/models/badgeclass.model';
import { BadgeClassManager } from '../../../issuer/services/badgeclass-manager.service';
import { BaseDialog } from '../base-dialog';
import { StringMatchingUtil } from '../../util/string-matching-util';
import { groupIntoArray, groupIntoObject } from '../../util/array-reducers';

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
		protected badgeClassService: BadgeClassManager,
		componentElem: ElementRef<HTMLElement>,
		renderer: Renderer2,
	) {
		super(componentElem, renderer);
	}

	async openDialog(): Promise<void> {
		this.showModal();

		return new Promise<void>((resolve, reject) => {
			this.resolveFunc = resolve;
			this.rejectFunc = reject;
		});
	}

	searchIcons(searchTerm: string) {
		return new Promise(async (resolve, reject) => {
			this.icons = placeholderIcons.icons;
			this.updateResults(searchTerm);
			resolve(placeholderIcons.icons)
		});
	}

	closeDialog() {
		this.closeModal();
		this.rejectFunc();
	}

	selectIcon(icon) {
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

const placeholderIcons = {
	"generated_at": "Mon, 28 Nov 2022 16:06:08 GMT",
	"icons": [
	  {
		"attribution": "Map by Deadtype from Noun Project",
		"collections": [],
		"date_uploaded": "2012-03-03",
		"icon_url": "https://static.thenounproject.com/noun-svg/1670.svg?Expires=1669655168&Signature=kBVCkSlQDyevH~fQmdCJUxoRyvi8aM5Bij7TSzHkodcTDq3CR-VGmvKfg2WqIiFWrZK-bXmbSvQSnXAviVlWyudl06S4n4P1Gr30nUhp1ERcFn-KGBO26XN~yXLZzKUN~9basEhxd0dUyVKlDmA8hUqSCuvNA3JurxjvZ7VuNao_&Key-Pair-Id=APKAI5ZVHAXN65CHVU2Q",
		"id": "1670",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "public-domain",
		"nounji_free": "0",
		"permalink": "/term/map/1670",
		"preview_url": "https://static.thenounproject.com/png/1670-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/1670-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/1670-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 1669,
			"slug": "adventure"
		  },
		  {
			"id": 739,
			"slug": "camping"
		  },
		  {
			"id": 1952,
			"slug": "direction"
		  },
		  {
			"id": 1542,
			"slug": "path"
		  },
		  {
			"id": 2251,
			"slug": "treasure"
		  },
		  {
			"id": 2449,
			"slug": "way-finding"
		  }
		],
		"term": "Map",
		"term_id": 672,
		"term_slug": "map",
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "",
		  "name": "Deadtype",
		  "permalink": "/Deadtype",
		  "username": "Deadtype"
		},
		"uploader_id": "3545",
		"year": 2012
	  },
	  {
		"attribution": "Map by Johan H. W. Basberg from Noun Project",
		"collections": [],
		"date_uploaded": "2012-03-08",
		"icon_url": "https://static.thenounproject.com/noun-svg/1733.svg?Expires=1669655168&Signature=kua4QGm21pvKFMXUq7jdSutONtyOjxH7lGOlr2h4WxY942zElm0b6PHKfVEtDU~8VGD3MoeAEm2BjTYINMEFO9S3QTikL2HzQemYQKTgi8EoUVH4cT28i~nfdRTiqKPcdnYan3RUvBJDx0CYkHImW44DwyCd9NegpGH6iivBAVo_&Key-Pair-Id=APKAI5ZVHAXN65CHVU2Q",
		"id": "1733",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "public-domain",
		"nounji_free": "0",
		"permalink": "/term/map/1733",
		"preview_url": "https://static.thenounproject.com/png/1733-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/1733-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/1733-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 739,
			"slug": "camping"
		  },
		  {
			"id": 140,
			"slug": "compass"
		  },
		  {
			"id": 1952,
			"slug": "direction"
		  },
		  {
			"id": 2738,
			"slug": "folded"
		  },
		  {
			"id": 444,
			"slug": "location"
		  },
		  {
			"id": 942,
			"slug": "navigation"
		  },
		  {
			"id": 469,
			"slug": "paper"
		  },
		  {
			"id": 1440,
			"slug": "print"
		  }
		],
		"term": "Map",
		"term_id": 672,
		"term_slug": "map",
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "Tower Hamlets, England, GB",
		  "name": "Johan H. W. Basberg",
		  "permalink": "/Gatada",
		  "username": "Gatada"
		},
		"uploader_id": "2161",
		"year": 2011
	  },
	  {
		"attribution": "Map by Travis from Noun Project",
		"collections": [],
		"date_uploaded": "2012-04-26",
		"icon_url": "https://static.thenounproject.com/noun-svg/2312.svg?Expires=1669655168&Signature=N4D4IsVA~TQ6HsWwYjNwCAI6VwtFx0CV9YR5P3iJc-7g~tuWKWOh1IKgxBThKjUG7MbbD6tjVyi8QcTB53C0tCFHXA2WngVOXx6ThcqUzU5ogj3FfNwkvB3-6Uh0JDgqNvufoWBBunnHh8o0lIs4486csVE1rfgU7kbxEODEEko_&Key-Pair-Id=APKAI5ZVHAXN65CHVU2Q",
		"id": "2312",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "public-domain",
		"nounji_free": "0",
		"permalink": "/term/map/2312",
		"preview_url": "https://static.thenounproject.com/png/2312-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/2312-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/2312-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 1952,
			"slug": "direction"
		  },
		  {
			"id": 444,
			"slug": "location"
		  },
		  {
			"id": 3494,
			"slug": "maps"
		  },
		  {
			"id": 651,
			"slug": "park"
		  },
		  {
			"id": 1542,
			"slug": "path"
		  }
		],
		"term": "Map",
		"term_id": 672,
		"term_slug": "map",
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "Carlsbad, California, US",
		  "name": "Travis",
		  "permalink": "/mr.yunis",
		  "username": "mr.yunis"
		},
		"uploader_id": "2418",
		"year": 2012
	  },
	  {
		"attribution": "Map by Stefan Zoll from Noun Project",
		"attribution_preview_url": "https://static.thenounproject.com/attribution/3710-600.png",
		"collections": [],
		"date_uploaded": "2012-07-20",
		"id": "3710",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "creative-commons-attribution",
		"nounji_free": "0",
		"permalink": "/term/map/3710",
		"preview_url": "https://static.thenounproject.com/png/3710-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/3710-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/3710-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 739,
			"slug": "camping"
		  },
		  {
			"id": 140,
			"slug": "compass"
		  },
		  {
			"id": 1952,
			"slug": "direction"
		  },
		  {
			"id": 444,
			"slug": "location"
		  },
		  {
			"id": 110,
			"slug": "travel"
		  }
		],
		"term": "Map",
		"term_id": 672,
		"term_slug": "map",
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "DE",
		  "name": "Stefan Zoll",
		  "permalink": "/thyinterface",
		  "username": "thyinterface"
		},
		"uploader_id": "7618",
		"year": 2012
	  },
	  {
		"attribution": "Map by Alessandro Suraci from Noun Project",
		"attribution_preview_url": "https://static.thenounproject.com/attribution/3995-600.png",
		"collections": [],
		"date_uploaded": "2012-08-07",
		"id": "3995",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "creative-commons-attribution",
		"nounji_free": "0",
		"permalink": "/term/map/3995",
		"preview_url": "https://static.thenounproject.com/png/3995-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/3995-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/3995-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 739,
			"slug": "camping"
		  },
		  {
			"id": 5400,
			"slug": "cartography"
		  },
		  {
			"id": 942,
			"slug": "navigation"
		  },
		  {
			"id": 651,
			"slug": "park"
		  },
		  {
			"id": 110,
			"slug": "travel"
		  }
		],
		"term": "Map",
		"term_id": 672,
		"term_slug": "map",
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "London, London, GB",
		  "name": "Alessandro Suraci",
		  "permalink": "/alessandro.suraci",
		  "username": "alessandro.suraci"
		},
		"uploader_id": "5431",
		"year": 2012
	  },
	  {
		"attribution": "Map by Nate Eul from Noun Project",
		"attribution_preview_url": "https://static.thenounproject.com/attribution/4864-600.png",
		"collections": [],
		"date_uploaded": "2012-09-14",
		"id": "4864",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "creative-commons-attribution",
		"nounji_free": "0",
		"permalink": "/term/map/4864",
		"preview_url": "https://static.thenounproject.com/png/4864-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/4864-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/4864-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 739,
			"slug": "camping"
		  },
		  {
			"id": 6282,
			"slug": "directions"
		  },
		  {
			"id": 2586,
			"slug": "fold"
		  },
		  {
			"id": 444,
			"slug": "location"
		  },
		  {
			"id": 469,
			"slug": "paper"
		  },
		  {
			"id": 651,
			"slug": "park"
		  },
		  {
			"id": 110,
			"slug": "travel"
		  },
		  {
			"id": 2449,
			"slug": "way-finding"
		  }
		],
		"term": "Map",
		"term_id": 672,
		"term_slug": "map",
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "Minneapolis, Minnesota, US",
		  "name": "Nate Eul",
		  "permalink": "/nateeul",
		  "username": "nateeul"
		},
		"uploader_id": "9399",
		"year": 2012
	  },
	  {
		"attribution": "Map by Jonathan Higley from Noun Project",
		"attribution_preview_url": "https://static.thenounproject.com/attribution/5260-600.png",
		"collections": [],
		"date_uploaded": "2012-09-28",
		"id": "5260",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "creative-commons-attribution",
		"nounji_free": "0",
		"permalink": "/term/map/5260",
		"preview_url": "https://static.thenounproject.com/png/5260-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/5260-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/5260-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 739,
			"slug": "camping"
		  },
		  {
			"id": 1952,
			"slug": "direction"
		  },
		  {
			"id": 2738,
			"slug": "folded"
		  },
		  {
			"id": 444,
			"slug": "location"
		  },
		  {
			"id": 6596,
			"slug": "pinpoint"
		  }
		],
		"term": "Map",
		"term_id": 672,
		"term_slug": "map",
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "Brooklyn, New York, US",
		  "name": "Jonathan Higley",
		  "permalink": "/jonathan",
		  "username": "jonathan"
		},
		"uploader_id": "10326",
		"year": 2012
	  },
	  {
		"attribution": "Map by Pieter J. Smits from Noun Project",
		"attribution_preview_url": "https://static.thenounproject.com/attribution/6856-600.png",
		"collections": [],
		"date_uploaded": "2012-10-25",
		"id": "6856",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "creative-commons-attribution",
		"nounji_free": "0",
		"permalink": "/term/map/6856",
		"preview_url": "https://static.thenounproject.com/png/6856-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/6856-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/6856-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 6282,
			"slug": "directions"
		  },
		  {
			"id": 444,
			"slug": "location"
		  },
		  {
			"id": 6415,
			"slug": "route"
		  },
		  {
			"id": 3795,
			"slug": "strategy"
		  },
		  {
			"id": 6916,
			"slug": "wayfinding"
		  }
		],
		"term": "Map",
		"term_id": 672,
		"term_slug": "map",
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "Enschede, Provincie Overijssel, NL",
		  "name": "Pieter J. Smits",
		  "permalink": "/pjsmits",
		  "username": "pjsmits"
		},
		"uploader_id": "13219",
		"year": 2012
	  },
	  {
		"attribution": "Map by Jong Hyuk Kwon from Noun Project",
		"collections": [],
		"date_uploaded": "2012-11-29",
		"icon_url": "https://static.thenounproject.com/noun-svg/8285.svg?Expires=1669655168&Signature=UnkNarfeNws2D5pH~2n-DWa~FH9SMhtMDmPErDvP7Ve5Ti2Qpgr519UrDBa9zweI8FrXac~g0kRw~115WXZf0P3MoLhYEqPLA6hZnI2s81ATo38Aer-BeaKwWSBGn4iykKGKMRiOCxtTUo6VbkzfB1eDxfjs9sSxpShvGFIyL1c_&Key-Pair-Id=APKAI5ZVHAXN65CHVU2Q",
		"id": "8285",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "public-domain",
		"nounji_free": "0",
		"permalink": "/term/map/8285",
		"preview_url": "https://static.thenounproject.com/png/8285-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/8285-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/8285-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 1669,
			"slug": "adventure"
		  },
		  {
			"id": 6282,
			"slug": "directions"
		  },
		  {
			"id": 444,
			"slug": "location"
		  },
		  {
			"id": 651,
			"slug": "park"
		  }
		],
		"term": "Map",
		"term_id": 672,
		"term_slug": "map",
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "seoul, KR",
		  "name": "Jong Hyuk Kwon",
		  "permalink": "/jonghyuk.kwon.56",
		  "username": "jonghyuk.kwon.56"
		},
		"uploader_id": "16947",
		"year": 2012
	  },
	  {
		"attribution": "Map by Cris Dobbins from Noun Project",
		"attribution_preview_url": "https://static.thenounproject.com/attribution/9169-600.png",
		"collections": [],
		"date_uploaded": "2012-12-20",
		"id": "9169",
		"is_active": "1",
		"is_explicit": "0",
		"license_description": "creative-commons-attribution",
		"nounji_free": "0",
		"permalink": "/term/map/9169",
		"preview_url": "https://static.thenounproject.com/png/9169-200.png",
		"preview_url_42": "https://static.thenounproject.com/png/9169-42.png",
		"preview_url_84": "https://static.thenounproject.com/png/9169-84.png",
		"sponsor": {},
		"sponsor_campaign_link": null,
		"sponsor_id": "",
		"tags": [
		  {
			"id": 672,
			"slug": "map"
		  },
		  {
			"id": 2572,
			"slug": "geography"
		  },
		  {
			"id": 444,
			"slug": "location"
		  },
		  {
			"id": 4732,
			"slug": "north-america"
		  },
		  {
			"id": 2691,
			"slug": "united-states"
		  }
		],
		"updated_at": "2019-04-22 19:22:17",
		"uploader": {
		  "location": "Los Angeles, California, US",
		  "name": "Cris Dobbins",
		  "permalink": "/crisdobbins",
		  "username": "crisdobbins"
		},
		"uploader_id": "19881",
		"year": 2012
	  }
	]
  }
