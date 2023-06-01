import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';

import { BaseDialog } from '../base-dialog';
import { RecipientBadgeInstance } from '../../../recipient/models/recipient-badge.model';

import { jsPDF } from 'jspdf';
import { ApiRecipientBadgeClass, ApiRecipientBadgeIssuer } from '../../../recipient/models/recipient-badge-api.model';
import { RecipientBadgeCollection } from '../../../recipient/models/recipient-badge-collection.model';
import { UserProfile } from '../../model/user-profile.model';
import { loadImageURL, readFileAsDataURL } from '../../util/file-util';
import { UserProfileManager } from '../../services/user-profile-manager.service';
import { MessageService } from '../../services/message.service';

@Component({
	selector: 'export-pdf-dialog',
	templateUrl: 'export-pdf-dialog.component.html',
	styleUrls: ['export-pdf-dialog.component.css'],
})
export class ExportPdfDialog extends BaseDialog {
	badge: RecipientBadgeInstance | null = null;
	collection: RecipientBadgeCollection | null = null;
	badgeResults: BadgeResult[] | null = null;
	badgePdf: string | null = null;
	doc: jsPDF = null;
	themeColor: string;
	pdfError: Error;

	profile: UserProfile;

	imageLoader: (file: File | string) => Promise<string> = basicImageLoader;

	@ViewChild('outputPdf', { static: false }) outputElement: ElementRef;

	resolveFunc: () => void;
	rejectFunc: () => void;

	constructor(
		componentElem: ElementRef<HTMLElement>,
		renderer: Renderer2,
		protected profileManager: UserProfileManager,
		protected messageService: MessageService
	) {
		super(componentElem, renderer);
		var r = document.querySelector(':root');
		var rs = getComputedStyle(r);
		this.themeColor = rs.getPropertyValue('--color-interactive1');

		this.profileManager.userProfilePromise.then(
			(profile) => {
				this.profile = profile;
			},
			(error) => this.messageService.reportAndThrowError('Failed to load userProfile', error)
		);
	}

	async openDialog(badge: RecipientBadgeInstance): Promise<void> {
		this.badge = badge;
		this.showModal();

		this.generateSingleBadgePdf(this.badge);

		return new Promise<void>((resolve, reject) => {
			this.resolveFunc = resolve;
			this.rejectFunc = reject;
		});
	}

	async openDialogForCollections(collection: RecipientBadgeCollection): Promise<void> {
		this.collection = collection;
		this.showModal();

		this.generateBadgeCollectionPdf(this.collection);

		return new Promise<void>((resolve, reject) => {
			this.resolveFunc = resolve;
			this.rejectFunc = reject;
		});
	}

	async openDialogForBackpack(badgeResults: BadgeResult[], profile: UserProfile): Promise<void> {
		this.badgeResults = badgeResults;
		this.showModal();

		this.generateBackpackPdf(this.badgeResults, profile);

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
		this.pdfError = undefined;
		const badgeClass: ApiRecipientBadgeClass = badge.badgeClass;
		this.doc = new jsPDF();

		let yPos = 20;
		let xMargin = 10;

		const pageWidth = this.doc.internal.pageSize.getWidth();
		const pageHeight = this.doc.internal.pageSize.getHeight();
		let cutoff = pageWidth - 27;

		try {
			// image
			const canvasWidth = 120;
			const canvasHeight = 120;
			const marginXImage = (pageWidth - canvasWidth) / 2;
			let badge_img = new Image();
			badge_img.src = badgeClass.image;
			this.doc.addImage(badge_img, 'JPEG', marginXImage, yPos, canvasWidth, canvasHeight);

			// title
			yPos += canvasHeight + 20;
			this.doc.setFontSize(35);
			this.doc.setFont('Helvetica', 'bold');
			let title = badgeClass.name;
			if (this.doc.getTextWidth(title) > cutoff) {
				title = title.substring(0, title.length - (this.doc.getTextWidth(title) - cutoff) / 2);
				title += '...';
			}
			this.doc.text(title, pageWidth / 2, yPos, {
				align: 'center',
			});

			// subtitle
			yPos += 20;
			this.doc.setFontSize(28);
			this.doc.setFont('Helvetica', 'normal');
			let subtitle = badgeClass.description;
			if (this.doc.getTextWidth(subtitle) > cutoff) {
				subtitle = subtitle.substring(0, subtitle.length - (this.doc.getTextWidth(subtitle) - cutoff) / 4.2);
				subtitle += '...';
			}
			this.doc.text(subtitle, pageWidth / 2, yPos, {
				align: 'center',
			});

			// line
			yPos += 15;
			this.doc.setDrawColor(this.themeColor);
			this.doc.setLineWidth(1.5);
			this.doc.line(25, yPos, pageWidth - 25, yPos);

			// edge line
			let edgeLineOffset = 8;
			this.doc.roundedRect(
				edgeLineOffset,
				edgeLineOffset,
				pageWidth - edgeLineOffset * 2,
				pageHeight - edgeLineOffset * 2,
				5,
				5
			);

			// awarded to
			yPos += 20;
			if (
				this.profile &&
				((this.profile.firstName && this.profile.firstName.length > 0) ||
					(this.profile.lastName && this.profile.lastName.length > 0))
			) {
				let name = '';
				if (this.profile.firstName) {
					name += this.profile.firstName + ' ';
				}
				if (this.profile.lastName) {
					name += this.profile.lastName;
				}
				this.doc.setFontSize(20);
				this.doc.setFont('Helvetica', 'bold');
				let awardedToContentLength = this.doc.getTextWidth(name);
				this.doc.setFontSize(18);
				this.doc.setFont('Helvetica', 'normal');
				let awardedToLength = this.doc.getTextWidth('Awarded to: ');
				if (awardedToContentLength + awardedToLength > cutoff) {
					name = name.substring(0, name.length - (awardedToContentLength + awardedToLength - cutoff) / 2);
					name += '...';
					this.doc.setFontSize(20);
					this.doc.setFont('Helvetica', 'bold');
					awardedToContentLength = this.doc.getTextWidth(name);
					this.doc.setFontSize(18);
					this.doc.setFont('Helvetica', 'normal');
				}
				this.doc.text('Awarded to: ', pageWidth / 2 - (awardedToContentLength + awardedToLength) / 2, yPos, {});
				this.doc.setFontSize(20);
				this.doc.setFont('Helvetica', 'bold');
				this.doc.text(
					name,
					pageWidth / 2 + (awardedToContentLength + awardedToLength) / 2 - awardedToContentLength,
					yPos,
					{}
				);
			}

			// issued by
			yPos += 15;
			let issuedBy = badgeClass.issuer.name;
			this.doc.setFontSize(20);
			this.doc.setFont('Helvetica', 'bold');
			let issuedByContentLength = this.doc.getTextWidth(issuedBy);
			this.doc.setFontSize(18);
			this.doc.setFont('Helvetica', 'normal');
			let issuedByLength = this.doc.getTextWidth('Issued by: ..');
			if (issuedByContentLength + issuedByLength > cutoff) {
				issuedBy = issuedBy.substring(
					0,
					issuedBy.length - (issuedByContentLength + issuedByLength - cutoff) / 2
				);
				issuedBy += '...';
				this.doc.setFontSize(20);
				this.doc.setFont('Helvetica', 'bold');
				issuedByContentLength = this.doc.getTextWidth(issuedBy);
				this.doc.setFontSize(18);
				this.doc.setFont('Helvetica', 'normal');
			}
			this.doc.text('Issued by: ', pageWidth / 2 - (issuedByLength + issuedByContentLength) / 2, yPos, {});
			this.doc.setFontSize(18);
			this.doc.setFont('Helvetica', 'bold');
			this.doc.text(
				issuedBy,
				pageWidth / 2 + (issuedByLength + issuedByContentLength) / 2 - issuedByContentLength,
				yPos,
				{}
			);

			// issued on
			yPos += 15;
			this.doc.setFontSize(20);
			this.doc.setFont('Helvetica', 'bold');
			let issuedOnContentLength = this.doc.getTextWidth(badge.issueDate.toLocaleDateString('uk-UK'));
			this.doc.setFontSize(18);
			this.doc.setFont('Helvetica', 'normal');
			let issuedOnLength = this.doc.getTextWidth('Issued on: ');
			this.doc.text('Issued on: ', pageWidth / 2 - (issuedOnLength + issuedOnContentLength) / 2, yPos, {});
			this.doc.setFontSize(20);
			this.doc.setFont('Helvetica', 'bold');
			this.doc.text(
				badge.issueDate.toLocaleDateString('uk-UK'),
				pageWidth / 2 + (issuedOnLength + issuedOnContentLength) / 2 - issuedOnContentLength,
				yPos,
				{}
			);

			// logo
			yPos += 11;
			const logoWidth = 20;
			const logoHeight = 20;
			this.doc.setFontSize(14);
			this.doc.setFont('Helvetica', 'normal');
			let logoTextOnContentLength = this.doc.getTextWidth('bereitgestellt von my badges');
			const marginXImageLogo = (pageWidth - logoWidth) / 2;
			var img = new Image();
			img.src = 'assets/logos/Badges_Entwurf-15.png';
			this.doc.addImage(img, 'PNG', marginXImageLogo, yPos, logoWidth, logoHeight);
			yPos += 13;
			this.doc.textWithLink(
				'bereitgestellt von myBadges',
				(pageWidth - logoTextOnContentLength) / 2,
				yPos + (logoHeight * 2) / 3,
				{
					url: 'https://mybadges.org/public/start',
				}
			);

			this.badgePdf = this.doc.output('datauristring');
			this.outputElement.nativeElement.src = this.badgePdf;

			this.outputElement.nativeElement.setAttribute('style', 'overflow: auto');
		} catch (e) {
			this.pdfError = e;
			console.log(e);
		}
	}

	// disclaimer: unfinished
	generateBadgeCollectionPdf(collection: RecipientBadgeCollection) {
		this.pdfError = undefined;
		const badges: RecipientBadgeInstance[] = collection.badges;
		this.doc = new jsPDF();

		let yPos = 20;
		let xMargin = 10;

		try {
			// title
			this.doc.setFontSize(30);
			this.doc.setFont('Helvetica', 'bold');
			this.doc.text(collection.name, xMargin, yPos, {
				align: 'justify',
			});

			// subtitle
			yPos += 15;
			this.doc.setFontSize(21);
			this.doc.setFont('Helvetica', 'normal');
			this.doc.text(collection.description, xMargin, yPos, {
				align: 'justify',
			});

			// Badges table title
			yPos += 20;
			this.doc.setFontSize(17);
			this.doc.setFont('Helvetica', 'bold');
			let badgeText = '' + badges.length + ' Badge';
			if (badges.length > 1) {
				badgeText += 's:';
			} else {
				badgeText += ':';
			}
			this.doc.text(badgeText, xMargin, yPos, {
				align: 'justify',
			});
			this.doc.line(xMargin, yPos + 1, xMargin + this.doc.getTextWidth(badgeText), yPos + 1);

			// Badges table header
			this.doc.setFontSize(14);
			yPos += 12;
			let headings = [
				{
					name: 'Badge',
					width: 80,
				},
				{
					name: 'Institution',
					width: 60,
				},
				{
					name: 'Vergeben',
					width: 60,
				},
			];
			let xPos = xMargin;
			headings.forEach((heading, i) => {
				this.doc.text(heading.name, xPos, yPos, {
					align: 'justify',
				});
				xPos += heading.width;
			});

			// Badges table content
			yPos += 12;
			this.doc.setFontSize(14);
			this.doc.setFont('Helvetica', 'normal');
			badges.forEach((badge, i) => {
				let badgeClass = badge.badgeClass;
				let xPos = xMargin;
				this.doc.addImage(badgeClass.image, 'png', xPos, yPos - 7, 11, 11);
				xPos += 13;
				let name = badgeClass.name;
				let cutoff = 50;
				if (this.doc.getTextWidth(name) > cutoff) {
					// while(this.doc.getTextWidth(name) > 30) {
					// 	name = name.substring(0, name.length - 1);
					// }
					name = name.substring(0, name.length - (this.doc.getTextWidth(name) - cutoff) / 2);
					name += '...';
				}
				this.doc.text(name, xPos, yPos, {
					align: 'justify',
				});
				xPos += 80 * (12 / 14);
				let institution = badgeClass.issuer.name;
				cutoff = 50;
				if (this.doc.getTextWidth(institution) > cutoff) {
					// while(this.doc.getTextWidth(institution) > 30) {
					// 	institution = institution.substring(0, institution.length - 1);
					// }
					institution = institution.substring(
						0,
						institution.length - (this.doc.getTextWidth(institution) - cutoff) / 2
					);
					institution += '...';
				}
				this.doc.text(institution, xPos, yPos, {
					align: 'justify',
				});
				xPos += 70 * (12 / 14);
				let datum =
					badge.issueDate.getDate() + '.' + badge.issueDate.getMonth() + '.' + badge.issueDate.getFullYear();
				this.doc.text(datum, xPos, yPos, {
					align: 'justify',
				});
				yPos += 13;
			});

			this.badgePdf = this.doc.output('datauristring');
			this.outputElement.nativeElement.src = this.badgePdf;

			this.outputElement.nativeElement.setAttribute('style', 'overflow: auto');
		} catch (e) {
			this.pdfError = e;
			console.log(e);
		}
	}

	// disclaimer: unfinished
	generateBackpackPdf(badgeResults: BadgeResult[], profile: UserProfile) {
		this.pdfError = undefined;
		this.doc = new jsPDF();

		let yPos = 20;
		let xMargin = 10;

		try {
			// title
			this.doc.setFontSize(30);
			this.doc.setFont('Helvetica', 'bold');
			let title = 'Rucksack';
			if (profile.firstName != '') {
				title += ' von ' + profile.firstName + ' ' + profile.lastName;
			}
			this.doc.text(title, xMargin, yPos, {
				align: 'justify',
			});

			// Badges table title
			this.doc.setFontSize(17);
			let badgeText = '' + badgeResults.length + ' Badge';
			if (badgeResults.length > 1) {
				badgeText += 's:';
			} else {
				badgeText += ':';
			}
			yPos += 15;
			this.doc.text(badgeText, xMargin, yPos, {
				align: 'justify',
			});
			this.doc.line(xMargin, yPos + 1, xMargin + this.doc.getTextWidth(badgeText), yPos + 1);

			// Badges table header
			this.doc.setFontSize(14);
			yPos += 12;
			let headings = [
				{
					name: 'Badge',
					width: 80,
				},
				{
					name: 'Institution',
					width: 60,
				},
				{
					name: 'Vergeben',
					width: 60,
				},
			];
			let xPos = xMargin;
			headings.forEach((heading, i) => {
				this.doc.text(heading.name, xPos, yPos, {
					align: 'justify',
				});
				xPos += heading.width;
			});

			// Badges table content
			this.doc.setFont('Helvetica', 'normal');
			yPos += 12;
			badgeResults.forEach((badgeResult, _) => {
				let badgeClass = badgeResult.badge.badgeClass;
				let xPos = xMargin;
				this.doc.addImage(badgeClass.image, 'png', xPos, yPos - 7, 11, 11);
				xPos += 13;
				let name = badgeClass.name;
				let cutoff = 60;
				if (this.doc.getTextWidth(name) > cutoff) {
					// while(this.doc.getTextWidth(name) > 30) {
					// 	name = name.substring(0, name.length - 1);
					// }
					name = name.substring(0, name.length - (this.doc.getTextWidth(name) - cutoff) / 2);
					name += '...';
				}
				this.doc.text(name, xPos, yPos, {
					align: 'justify',
				});
				xPos += 80 * (12 / 14);
				let institution = badgeClass.issuer.name;
				cutoff = 50;
				if (this.doc.getTextWidth(institution) > cutoff) {
					// while(this.doc.getTextWidth(institution) > 30) {
					// 	institution = institution.substring(0, institution.length - 1);
					// }
					institution = institution.substring(
						0,
						institution.length - (this.doc.getTextWidth(institution) - cutoff) / 2
					);
					institution += '...';
				}
				this.doc.text(institution, xPos, yPos, {
					align: 'justify',
				});
				xPos += 70 * (12 / 14);
				let datum = dateToString(this.badge.issueDate, '.');
				this.doc.text(datum, xPos, yPos, {
					align: 'justify',
				});
				yPos += 12;
			});

			this.badgePdf = this.doc.output('datauristring');
			this.outputElement.nativeElement.src = this.badgePdf;
			this.outputElement.nativeElement.setAttribute('style', 'overflow: auto');
		} catch (e) {
			this.pdfError = e;
			console.log(e);
		}
	}

	downloadPdf() {
		debugger;
		this.doc.save(this.badge.badgeClass.name + ' - ' + dateToString(this.badge.issueDate, '') + '.pdf');
	}
}

class BadgeResult {
	constructor(public badge: RecipientBadgeInstance, public issuer: ApiRecipientBadgeIssuer) {}
}

// TODO: put this in a service??
// file can either be file or url to a file
export function basicImageLoader(file: File | string): Promise<string> {
	if (typeof file == 'string') {
		return loadImageURL(file)
			.then(() => file)
			.catch((e) => {
				throw new Error(`${file} is not a valid image file`);
			});
	} else {
		return readFileAsDataURL(file)
			.then((url) => loadImageURL(url).then(() => url))
			.catch((e) => {
				throw new Error(`${file.name} is not a valid image file`);
			});
	}
}

function dateToString(date: Date, seperator: string) {
	return (
		('0' + date.getDate()).slice(-2) +
		seperator +
		('0' + (date.getMonth() + 1)).slice(-2) +
		seperator +
		date.getFullYear()
	);
}
