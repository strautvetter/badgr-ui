import { Component, OnInit, inject } from '@angular/core';
import { LinkEntry } from '../../../common/components/bg-breadcrumbs/bg-breadcrumbs.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BadgeClassManager } from '../../services/badgeclass-manager.service';
import { BaseAuthenticatedRoutableComponent } from '../../../common/pages/base-authenticated-routable.component';
import { SessionService } from '../../../common/services/session.service';
import { BadgeClass } from '../../models/badgeclass.model';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { BadgeRequestApiService } from '../../services/badgerequest-api.service';
import { HlmDialogService } from '../../../components/spartan/ui-dialog-helm/src/lib/hlm-dialog.service';
import { SuccessDialogComponent } from '../../../common/dialogs/oeb-dialogs/success-dialog.component';
import { DangerDialogComponent } from '../../../common/dialogs/oeb-dialogs/danger-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { QrCodeApiService } from '../../services/qrcode-api.service';
import { DatePipe } from '@angular/common';
import { MenuItem } from '../../../common/components/badge-detail/badge-detail.component.types';
import { QRCodeElementType, FixMeLater } from 'angularx-qrcode';

@Component({
	selector: 'badgeclass-generate-qr',
	templateUrl: './badgeclass-generate-qr.component.html',
	styleUrls: ['../../../public/components/about/about.component.css'],
	standalone: false,
})
export class BadgeClassGenerateQrComponent extends BaseAuthenticatedRoutableComponent implements OnInit {
	static datePipe = new DatePipe('de');

	get issuerSlug() {
		return this.route.snapshot.params['issuerSlug'];
	}

	get badgeSlug() {
		return this.route.snapshot.params['badgeSlug'];
	}

	get qrSlug() {
		return this.route.snapshot.params['qrCodeId'];
	}

	badgeLoadingImageUrl = '../../../../breakdown/static/images/badge-loading.svg';
	badgeFailedImageUrl = '../../../../breakdown/static/images/badge-failed.svg';

	badgeClass: BadgeClass;

	badgeClassLoaded: Promise<unknown>;
	crumbs: LinkEntry[];

	qrData: string;
	qrTitle: string;
	qrCodeCSS: string =
		'tw-border-solid tw-border-purple tw-border-[3px] tw-p-2 tw-rounded-2xl tw-max-w-[265px] md:tw-max-w-[350px]';
	issuer: string;
	creator: string;
	valid: boolean = true;
	validity: string;
	valid_from: Date;
	expires_at: Date;
	baseUrl: string;
	badgeRequested: boolean = false;
	editQrCodeLink: string = `/issuer/issuers/${this.issuerSlug}/badges/${this.badgeSlug}/qr/${this.qrSlug}/edit`;
	qrCodeWidth = 244;
	public qrCodeDownloadLink: SafeUrl = '';
	public elementType: QRCodeElementType = 'canvas';

	pdfSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');

	qrCodeMenu: MenuItem[] = [
		{
			title: 'General.edit',
			icon: 'lucidePencil',
			routerLink: [this.editQrCodeLink],
		},
		{
			title: 'General.delete',
			icon: 'lucideTrash2',
			action: () => {
				this.openDangerDialog();
			},
		},
	];

	constructor(
		route: ActivatedRoute,
		router: Router,
		sessionService: SessionService,
		protected badgeClassManager: BadgeClassManager,
		protected badgeRequestApiService: BadgeRequestApiService,
		protected translate: TranslateService,
		protected qrCodeApiService: QrCodeApiService,
		protected sanitizer: DomSanitizer,
	) {
		super(router, route, sessionService);

		this.badgeClassLoaded = this.badgeClassManager
			.badgeByIssuerSlugAndSlug(this.issuerSlug, this.badgeSlug)
			.then((badgeClass) => {
				this.badgeClass = badgeClass;

				let im = this.badgeClass.issuerManager;
				im.issuerBySlug(this.issuerSlug).then((issuer) => {
					this.issuer = issuer.name;
				});

				this.crumbs = [
					{ title: 'Issuers', routerLink: ['/issuer'] },
					{
						// title: issuer.name,
						title: 'issuer',
						routerLink: ['/issuer/issuers', this.issuerSlug],
					},
					{
						title: 'badges',
						routerLink: ['/issuer/issuers/' + this.issuerSlug + '/badges/'],
					},
					{
						title: badgeClass.name,
						routerLink: ['/issuer/issuers', this.issuerSlug, 'badges', badgeClass.slug],
					},
					{
						title: 'Award Badge',
						routerLink: ['/issuer/issuers', this.issuerSlug, 'badges', badgeClass.slug, 'qr'],
					},
					{
						title: 'Generate QR',
					},
				];
			});
		this.badgeRequestApiService.getBadgeRequestsByQrCode(this.qrSlug).then((r) => {
			this.badgeRequested = r.body['requested_badges'].length > 0 ? true : false;
		});
	}

	ngOnInit() {
		this.baseUrl = window.location.origin;
		if (this.qrSlug) {
			console.log(this.qrSlug);
			this.qrCodeApiService.getQrCode(this.qrSlug).then((qrCode) => {
				this.qrTitle = qrCode.title;
				this.creator = qrCode.createdBy;
				this.valid_from = qrCode.valid_from;
				this.expires_at = qrCode.expires_at;
				if (
					//@ts-ignore
					(qrCode.expires_at && !isNaN(new Date(qrCode.expires_at))) ||
					//@ts-ignore
					(qrCode.valid_from && !isNaN(new Date(qrCode.valid_from)))
				) {
					if (
						new Date(this.valid_from) < new Date() &&
						new Date(this.expires_at) >= new Date(new Date().setHours(0, 0, 0, 0))
					) {
						this.valid = true;
					} else {
						this.valid = false;
					}

					this.validity =
						BadgeClassGenerateQrComponent.datePipe.transform(new Date(this.valid_from), 'dd.MM.yyyy') +
						' - ' +
						BadgeClassGenerateQrComponent.datePipe.transform(new Date(this.expires_at), 'dd.MM.yyyy');
				} else {
					this.validity = undefined;
				}

				if (this.valid) {
					this.qrData = `${this.baseUrl}/public/issuer/issuers/${this.issuerSlug}/badges/${this.badgeSlug}/request/${this.qrSlug}`;
				} else {
					this.qrData = 'Die Gültigkeit dieses Qr Codes ist abgelaufen.';
				}
			});
		}
	}

	private readonly _hlmDialogService = inject(HlmDialogService);
	public openSuccessDialog() {
		const dialogRef = this._hlmDialogService.open(SuccessDialogComponent, {
			context: {
				text: this.translate.instant('QrCode.downloadedSuccessfully'),
				qrCodeRequested: this.badgeRequested,
				variant: 'success',
			},
		});
	}

	async savePdf(parent: any) {
		let parentElement = null;

		parentElement = parent.qrcElement.nativeElement.querySelector('canvas').toDataURL('image/png');

		if (parentElement) {
			let data = await this.getQrCodePdf(parentElement);
		}
	}

	private convertBase64ToBlob(Base64Image: string) {
		// split into two parts
		const parts = Base64Image.split(';base64,');
		// hold the content type
		const imageType = parts[0].split(':')[1];
		// decode base64 string
		const decodedData = window.atob(parts[1]);
		// create unit8array of size same as row data length
		const uInt8Array = new Uint8Array(decodedData.length);
		// insert all character code into uint8array
		for (let i = 0; i < decodedData.length; ++i) {
			uInt8Array[i] = decodedData.charCodeAt(i);
		}
		// return blob image after conversion
		return new Blob([uInt8Array], { type: imageType });
	}

	// Code from https://github.com/Cordobo/angularx-qrcode/blob/9eab0cb688049d4cd42e0da2b76826aed64e3dd6/projects/demo-app/src/app/app.component.ts#L225
	saveAsImage(parent: FixMeLater) {
		let parentElement = null;

		if (this.elementType === 'canvas') {
			// fetches base 64 data from canvas
			parentElement = parent.qrcElement.nativeElement.querySelector('canvas').toDataURL('image/png');
		} else if (this.elementType === 'img' || this.elementType === 'url') {
			// fetches base 64 data from image
			// parentElement contains the base64 encoded image src
			// you might use to store somewhere
			parentElement = parent.qrcElement.nativeElement.querySelector('img').src;
		} else {
			alert("Set elementType to 'canvas', 'img' or 'url'.");
		}

		if (parentElement) {
			// converts base 64 encoded image to blobData
			let blobData = this.convertBase64ToBlob(parentElement);
			// saves as image
			const blob = new Blob([blobData], { type: 'image/png' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			// name of the file
			link.download = `${this.qrTitle}-qrcode.png`;
			link.click();
		}
	}

	public openDangerDialog() {
		const dialogRef = this._hlmDialogService.open(DangerDialogComponent, {
			context: {
				caption: this.translate.instant('QrCode.deleteQrAward'),
				text: this.translate.instant('QrCode.deleteQrAwardConfirm'),
				delete: this.deleteQrCode.bind(this),
				qrCodeRequested: this.badgeRequested,
				variant: 'danger',
			},
		});
	}

	deleteQrCode() {
		this.qrCodeApiService.deleteQrCode(this.issuerSlug, this.badgeSlug, this.qrSlug).then(() => {
			this.router.navigate(['/issuer/issuers', this.issuerSlug, 'badges', this.badgeSlug]);
		});
	}

	async getQrCodePdf(base64QrImage: string) {
		this.qrCodeApiService.getQrCodePdf(this.qrSlug, this.badgeClass.slug, base64QrImage).subscribe({
			next: (blob: Blob) => {
				this.qrCodeApiService.downloadQrCode(blob, this.qrTitle, this.badgeClass.name);
			},
			error: (error) => {
				console.error('Error downloading the QrCode', error);
			},
		});
	}

	onChangeURL(url: SafeUrl) {
		this.qrCodeDownloadLink = url;
	}
}
