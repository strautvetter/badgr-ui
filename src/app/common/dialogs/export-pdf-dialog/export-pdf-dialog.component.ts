import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';

import { BaseDialog } from '../base-dialog';
import { RecipientBadgeInstance } from '../../../recipient/models/recipient-badge.model';

import { jsPDF } from "jspdf";
import { ApiRecipientBadgeClass, ApiRecipientBadgeIssuer } from '../../../recipient/models/recipient-badge-api.model';
import { RecipientBadgeCollection } from 'src/app/recipient/models/recipient-badge-collection.model';

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

	async openDialogForBackpack(badgeResults: BadgeResult[]): Promise<void> {
		this.badgeResults = badgeResults;
		this.showModal();

		this.generateBackpackPdf(this.badgeResults)

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

		const pageWidth = this.doc.internal.pageSize.getWidth();
		const pageHeight = this.doc.internal.pageSize.getHeight();

		const canvasWidth = 120;
		const canvasHeight = 120;
		const marginX = (pageWidth - canvasWidth) / 2;
		this.doc.addImage(badgeClass.image, 'png', marginX, 10, canvasWidth, canvasHeight);

		this.doc.setFontSize(30);
		this.doc.setFont('Helvetica', 'bold');
		this.doc.text(badgeClass.name, 60, 140, {
			align: 'justify'
		});

		this.doc.setFontSize(20);
		this.doc.setFont('Helvetica', 'normal');
		this.doc.text(badgeClass.description, 10, 155, {
			align: 'justify'
		});

		if (badgeClass.criteria != undefined) {
			this.doc.setFontSize(12);
			this.doc.setFont('Helvetica', 'normal');
			this.doc.text("criteria: " + badgeClass.criteria, 10, 170, {
				align: 'justify'
			});
		}

		this.badgePdf = this.doc.output('datauristring');
		this.outputElement.nativeElement.src = this.badgePdf
	}

	generateBadgeCollectionPdf(collection: RecipientBadgeCollection) {
		const badges: RecipientBadgeInstance[] = collection.badges
		this.doc = new jsPDF();

		console.log(collection)

		this.doc.setFontSize(30);
		this.doc.setFont('Helvetica', 'bold');
		this.doc.text(collection.name, 10, 20, {
			align: 'justify'
		});

		this.doc.setFontSize(21);
		this.doc.setFont('Helvetica', 'normal');
		this.doc.text(collection.description, 10, 35, {
			align: 'justify'
		});

		this.doc.setFontSize(17);
		this.doc.text("" + badges.length + " Badge(s):", 10, 60, {
			align: 'justify'
		});
		this.doc.line(10,61,10+this.doc.getTextWidth("" + badges.length + " Badge(s):"),61);

		this.doc.setFontSize(14);
		this.doc.setFont('Helvetica', 'normal');
		badges.forEach((badge, i) => {
			let badgeClass = badge.badgeClass
			this.doc.text(badgeClass.name, 10, 70 + i*10, {
				align: 'justify'
			});
		})

		this.badgePdf = this.doc.output('datauristring');
		this.outputElement.nativeElement.src = this.badgePdf
	}

	generateBackpackPdf(badgeResults: BadgeResults) {
		this.doc = new jsPDF();

		this.doc.setFontSize(30);
		this.doc.setFont('Helvetica', 'bold');
		this.doc.text("___'s Rucksack", 10, 20, {
			align: 'justify'
		});

		this.doc.setFontSize(17);
		this.doc.text("" + badgeResults.length + " Badge(s):", 10, 60, {
			align: 'justify'
		});
		this.doc.line(10,61,10+this.doc.getTextWidth("" + badgeResults.length + " Badge(s):"),61);

		this.doc.setFontSize(14);
		this.doc.setFont('Helvetica', 'normal');
		badgeResults.forEach((badgeResult, i) => {
			let badgeClass = badgeResult.badge.badgeClass
			this.doc.text(badgeClass.name, 10, 70 + i*10, {
				align: 'justify'
			});
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
