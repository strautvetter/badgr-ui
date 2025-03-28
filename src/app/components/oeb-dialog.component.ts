import { Component, Input } from '@angular/core';
import { HlmButtonDirective } from './spartan/ui-button-helm/src';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import {
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogDescriptionDirective,
	HlmDialogFooterComponent,
	HlmDialogHeaderComponent,
	HlmDialogTitleDirective,
} from './spartan/ui-dialog-helm/src';
import { HlmInputDirective } from './spartan/ui-input-helm/src';
import { NgClass, NgIf } from '@angular/common';

@Component({
	selector: 'oeb-dialog',
	standalone: true,
	imports: [
		BrnDialogTriggerDirective,
		BrnDialogContentDirective,

		HlmDialogComponent,
		HlmDialogContentComponent,
		HlmDialogHeaderComponent,
		HlmDialogFooterComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,

		HlmInputDirective,
		HlmButtonDirective,
		NgIf,
		NgClass,
	],
	template: `
		<div
			class="tw-px-4 tw-py-6"
			[ngClass]="{
				' tw-border-red': variant === 'danger',
				' tw-border-link tw-rounded-[20px] tw-border-4 tw-bg-white tw-border-solid': variant === 'info',
				'tw-border-purple': variant === 'default'
			}"
		>
			<hlm-dialog-header *ngIf="title">
				<h3 hlmH3>{{ title }}</h3>
				<p hlmP hlmDialogDescription>{{ subtitle }}</p>
			</hlm-dialog-header>
			<ng-content></ng-content>
			<hlm-dialog-footer *ngIf="footer">
				<button hlmBtn type="submit">Save changes</button>
			</hlm-dialog-footer>
		</div>
	`,
})
export class OebDialogComponent {
	@Input() title: string;
	@Input() subtitle: string;
	@Input() type: string;
	@Input() footer: boolean = false;
	@Input() variant: string = 'default';
}
