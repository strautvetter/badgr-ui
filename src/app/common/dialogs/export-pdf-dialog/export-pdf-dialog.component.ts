import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';

import { BaseDialog } from '../base-dialog';
import { RecipientBadgeInstance } from '../../../recipient/models/recipient-badge.model';

import { jsPDF } from "jspdf";
import { ApiRecipientBadgeClass, ApiRecipientBadgeIssuer } from '../../../recipient/models/recipient-badge-api.model';
import { RecipientBadgeCollection } from '../../../recipient/models/recipient-badge-collection.model';
import { UserProfile } from '../../model/user-profile.model';

@Component({
	selector: 'export-pdf-dialog',
	templateUrl: 'export-pdf-dialog.component.html',
	styleUrls: ['export-pdf-dialog.component.css']
})
export class ExportPdfDialog extends BaseDialog {
	badge: RecipientBadgeInstance | null = null;
	collection: RecipientBadgeCollection | null = null;
	badgeResults: BadgeResult[] | null = null;
	badgePdf: string | null = null;
	doc: jsPDF = null;

	@ViewChild('outputPdf', {static: false}) outputElement: ElementRef; 

	resolveFunc: () => void;
	rejectFunc: () => void;

	constructor(
		componentElem: ElementRef<HTMLElement>,
		renderer: Renderer2,
	) {
		super(componentElem, renderer);
	}


	async openDialog(badge: RecipientBadgeInstance): Promise<void> {
		this.badge = badge;
		this.showModal();

		this.generateSingleBadgePdf(this.badge)

		return new Promise<void>((resolve, reject) => {
			this.resolveFunc = resolve;
			this.rejectFunc = reject;
		});
	}

	async openDialogForCollections(collection: RecipientBadgeCollection): Promise<void> {
		this.collection = collection;
		this.showModal();

		this.generateBadgeCollectionPdf(this.collection)

		return new Promise<void>((resolve, reject) => {
			this.resolveFunc = resolve;
			this.rejectFunc = reject;
		});
	}

	async openDialogForBackpack(badgeResults: BadgeResult[], profile: UserProfile): Promise<void> {
		this.badgeResults = badgeResults;
		this.showModal();

		this.generateBackpackPdf(this.badgeResults, profile)

		return new Promise<void>((resolve, reject) => {
			this.resolveFunc = resolve;
			this.rejectFunc = reject;
		});
	}

	closeDialog() {
		this.closeModal();
		this.resolveFunc();
	}

	generateSingleBadgePdf(badge: RecipientBadgeInstance) {
		const badgeClass: ApiRecipientBadgeClass = badge.badgeClass
		this.doc = new jsPDF();

		let yPos = 20;
		let xMargin = 10;

		const pageWidth = this.doc.internal.pageSize.getWidth();
		const pageHeight = this.doc.internal.pageSize.getHeight();

		// image
		const canvasWidth = 120;
		const canvasHeight = 120;
		const marginXImage = (pageWidth - canvasWidth) / 2;
		this.doc.addImage(badgeClass.image, 'png', marginXImage, yPos, canvasWidth, canvasHeight);

		// title
		yPos += 140;
		this.doc.setFontSize(35);
		this.doc.setFont('Helvetica', 'bold');
		this.doc.text(badgeClass.name, pageWidth/2, yPos, {
			align: 'center'
		});

		// subtitle
		yPos += 20
		this.doc.setFontSize(28);
		this.doc.setFont('Helvetica', 'normal');
		this.doc.text(badgeClass.description, pageWidth/2, yPos, {
			align: 'center'
		});

		// line
		yPos += 15
		this.doc.setDrawColor(0, 0, 255);
		this.doc.line(25, yPos, pageWidth-25, yPos)

		// edge line
		let edgeLineOffset = 8
		this.doc.roundedRect(edgeLineOffset, edgeLineOffset, pageWidth-edgeLineOffset*2, pageHeight-edgeLineOffset*2, 5, 5)

		// awarded to
		yPos += 20
		this.doc.setFontSize(18);
		this.doc.setFont('Helvetica', 'normal');
		let awardedToContentLength = this.doc.getTextWidth("Paula Scharf");
		this.doc.setFontSize(20);
		this.doc.setFont('Helvetica', 'bold');
		let awardedToLength = this.doc.getTextWidth("Awarded to: ");
		this.doc.text("Awarded to: ", pageWidth/2 - (awardedToLength+awardedToContentLength)/4, yPos, {
			align: 'center'
		});
		this.doc.setFontSize(18);
		this.doc.setFont('Helvetica', 'normal');
		this.doc.text("Paula Scharf", pageWidth/2 - (awardedToLength+awardedToContentLength)/4 + awardedToLength, yPos, {
			align: 'center'
		});

		// issued by
		yPos += 15
		this.doc.setFontSize(18);
		this.doc.setFont('Helvetica', 'normal');
		let issuedByContentLength = this.doc.getTextWidth(badgeClass.issuer.name);
		this.doc.setFontSize(20);
		this.doc.setFont('Helvetica', 'bold');
		let issuedByLength = this.doc.getTextWidth("Issued by: ..");
		this.doc.text("Issued by: ", pageWidth/2 - (issuedByLength+issuedByContentLength)/4, yPos, {
			align: 'center'
		});
		this.doc.setFontSize(18);
		this.doc.setFont('Helvetica', 'normal');
		this.doc.text(badgeClass.issuer.name, pageWidth/2 - (issuedByLength+issuedByContentLength)/4 + issuedByLength, yPos, {
			align: 'center'
		});

		// issued on
		yPos += 15
		this.doc.setFontSize(18);
		this.doc.setFont('Helvetica', 'normal');
		let issuedOnContentLength = this.doc.getTextWidth(badge.issueDate.getDate() + "." + badge.issueDate.getMonth() + "." + badge.issueDate.getFullYear());
		this.doc.setFontSize(20);
		this.doc.setFont('Helvetica', 'bold');
		let issuedOnLength = this.doc.getTextWidth("Issued on: ");
		this.doc.text("Issued on: ", pageWidth/2 - (issuedOnLength+issuedOnContentLength)/4, yPos, {
			align: 'center'
		});
		this.doc.setFontSize(18);
		this.doc.setFont('Helvetica', 'normal');
		this.doc.text(badge.issueDate.getDate() + "." + badge.issueDate.getMonth() + "." + badge.issueDate.getFullYear(), 
			pageWidth/2 - (issuedOnLength+issuedOnContentLength)/4 + issuedOnLength, yPos, {
			align: 'center'
		});

		// TODO: logo

		this.badgePdf = this.doc.output('datauristring');
		this.outputElement.nativeElement.src = this.badgePdf
	}

	generateBadgeCollectionPdf(collection: RecipientBadgeCollection) {
		const badges: RecipientBadgeInstance[] = collection.badges
		this.doc = new jsPDF();

		let yPos = 20;
		let xMargin = 10;

		// title
		this.doc.setFontSize(30);
		this.doc.setFont('Helvetica', 'bold');
		this.doc.text(collection.name, xMargin, yPos, {
			align: 'justify'
		});

		// subtitle
		yPos += 15;
		this.doc.setFontSize(21);
		this.doc.setFont('Helvetica', 'normal');
		this.doc.text(collection.description, xMargin, yPos, {
			align: 'justify'
		});

		// Badges table title
		yPos += 20;
		this.doc.setFontSize(17);
		this.doc.setFont('Helvetica', 'bold');
		let badgeText = "" + badges.length + " Badge"
		if(badges.length > 1) {
			badgeText += "s:"
		} else {
			badgeText += ":"
		}
		this.doc.text(badgeText, xMargin, yPos, {
			align: 'justify'
		});
		this.doc.line(xMargin,yPos+1,xMargin+this.doc.getTextWidth(badgeText),yPos+1);

		// Badges table header
		this.doc.setFontSize(14);
		yPos += 12;
		let headings = [{
				name:"Badge",
				width: 80
			}, {
				name:"Institution",
				width:60
			}, {
				name:"Vergeben",
				width:60
			}];
		let xPos = xMargin;
		headings.forEach((heading, i) => {
			this.doc.text(heading.name, xPos, yPos, {
				align: 'justify',
			});
			xPos += heading.width;
		})

		// Badges table content
		yPos += 12;
		this.doc.setFontSize(14);
		this.doc.setFont('Helvetica', 'normal');
		badges.forEach((badge, i) => {
			let badgeClass = badge.badgeClass
			let xPos = xMargin;
			this.doc.addImage(badgeClass.image, 'png', xPos, yPos - 7, 11, 11);
			xPos += 13;
			let name = badgeClass.name;
			let cutoff = 50;
			if(this.doc.getTextWidth(name) > cutoff) {
				// while(this.doc.getTextWidth(name) > 30) {
				// 	name = name.substring(0, name.length - 1);
				// }
				name = name.substring(0, name.length - (this.doc.getTextWidth(name)-cutoff)/2);
				name += "..."
			}
			this.doc.text(name, xPos, yPos, {
				align: 'justify',
			});
			xPos += 80*(12/14);
			let institution = badgeClass.issuer.name;
			cutoff = 50;
			if(this.doc.getTextWidth(institution) > cutoff) {
				// while(this.doc.getTextWidth(institution) > 30) {
				// 	institution = institution.substring(0, institution.length - 1);
				// }
				institution = institution.substring(0, institution.length - (this.doc.getTextWidth(institution)-cutoff)/2);
				institution += "..."
			}
			this.doc.text(institution, xPos, yPos, {
				align: 'justify',
			});
			xPos += 70*(12/14);
			let datum = badge.issueDate.getDate() + "." + badge.issueDate.getMonth() + "." + badge.issueDate.getFullYear();
			this.doc.text(datum, xPos, yPos, {
				align: 'justify',
			});
			yPos += 13
		})

		this.badgePdf = this.doc.output('datauristring');
		this.outputElement.nativeElement.src = this.badgePdf
	}

	generateBackpackPdf(badgeResults: BadgeResult[], profile: UserProfile) {
		this.doc = new jsPDF();

		let yPos = 20;
		let xMargin = 10;

		// title
		this.doc.setFontSize(30);
		this.doc.setFont('Helvetica', 'bold');
		let title = "Rucksack"
		if(profile.firstName != "") {
			title += " von " + profile.firstName + " " + profile.lastName
		}
		this.doc.text(title, xMargin, yPos, {
			align: 'justify'
		});

		// Badges table title
		this.doc.setFontSize(17);
		let badgeText = "" + badgeResults.length + " Badge"
		if(badgeResults.length > 1) {
			badgeText += "s:"
		} else {
			badgeText += ":"
		}
		yPos += 15;
		this.doc.text(badgeText, xMargin, yPos, {
			align: 'justify'
		});
		this.doc.line(xMargin,yPos+1,xMargin+this.doc.getTextWidth(badgeText),yPos+1);

		// Badges table header
		this.doc.setFontSize(14);
		yPos += 12;
		let headings = [{
			name:"Badge",
			width: 80
		}, {
			name:"Institution",
			width:60
		}, {
			name:"Vergeben",
			width:60
		}];
		let xPos = xMargin;
		headings.forEach((heading, i) => {
			this.doc.text(heading.name, xPos, yPos, {
				align: 'justify',
			});
			xPos += heading.width;
		})

		// Badges table content
		this.doc.setFont('Helvetica', 'normal');
		yPos += 12;
		badgeResults.forEach((badgeResult, _) => {
			let badgeClass = badgeResult.badge.badgeClass
			let xPos = xMargin;
			this.doc.addImage(badgeClass.image, 'png', xPos, yPos - 7, 11, 11);
			xPos += 13;
			let name = badgeClass.name;
			let cutoff = 60;
			if(this.doc.getTextWidth(name) > cutoff) {
				// while(this.doc.getTextWidth(name) > 30) {
				// 	name = name.substring(0, name.length - 1);
				// }
				name = name.substring(0, name.length - (this.doc.getTextWidth(name)-cutoff)/2);
				name += "..."
			}
			this.doc.text(name, xPos, yPos, {
				align: 'justify',
			});
			xPos += 80*(12/14);
			let institution = badgeClass.issuer.name;
			cutoff = 50;
			if(this.doc.getTextWidth(institution) > cutoff) {
				// while(this.doc.getTextWidth(institution) > 30) {
				// 	institution = institution.substring(0, institution.length - 1);
				// }
				institution = institution.substring(0, institution.length - (this.doc.getTextWidth(institution)-cutoff)/2);
				institution += "..."
			}
			this.doc.text(institution, xPos, yPos, {
				align: 'justify',
			});
			xPos += 70*(12/14);
			let datum = badgeResult.badge.issueDate.getDate() + "." + badgeResult.badge.issueDate.getMonth() + "." + badgeResult.badge.issueDate.getFullYear();
			this.doc.text(datum, xPos, yPos, {
				align: 'justify',
			});
			yPos += 12
		})

		this.badgePdf = this.doc.output('datauristring');
		this.outputElement.nativeElement.src = this.badgePdf
	}

	downloadPdf() {
		this.doc.save(this.badge.badgeClass.name + ".pdf");
	}

}

class BadgeResult {
	constructor(public badge: RecipientBadgeInstance, public issuer: ApiRecipientBadgeIssuer) {}
}
