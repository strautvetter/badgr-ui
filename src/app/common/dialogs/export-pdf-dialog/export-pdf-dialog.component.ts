import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';

import { BaseDialog } from '../base-dialog';
import { RecipientBadgeInstance } from '../../../recipient/models/recipient-badge.model';

import { jsPDF } from "jspdf";
import { ApiRecipientBadgeClass } from 'src/app/recipient/models/recipient-badge-api.model';

@Component({
	selector: 'export-pdf-dialog',
	templateUrl: 'export-pdf-dialog.component.html',
	styleUrls: ['export-pdf-dialog.component.css']
})
export class ExportPdfDialog extends BaseDialog {
	badge: RecipientBadgeInstance | null = null;
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

	closeDialog() {
		this.closeModal();
		this.resolveFunc();
	}

	generateSingleBadgePdf(badge: RecipientBadgeInstance) {
		const badgeClass: ApiRecipientBadgeClass = this.badge.badgeClass
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
		console.log(this.doc.getFontList())
		this.outputElement.nativeElement.src = this.badgePdf
	}

	downloadPdf() {
		this.doc.save("a4.pdf");
	}

}
