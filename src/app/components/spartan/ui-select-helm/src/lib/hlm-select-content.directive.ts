import { Directive, Input, computed, input, signal } from '@angular/core';
import { hlm, injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSelectContent], hlm-select-content',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': '_stateProvider?.state() ?? "open"',
		'[attr.data-side]': '_sideProvider?.side() ?? "bottom"',
	},
})
export class HlmSelectContentDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _stateProvider = injectExposesStateProvider({ optional: true });
	protected readonly _sideProvider = injectExposedSideProvider({ optional: true });

	protected readonly _computedClass = computed(() =>
		hlm(
			'tw-w-full tw-relative tw-z-50 tw-min-w-[8rem] tw-overflow-hidden tw-rounded-md tw-border tw-border-border tw-border-solid tw-border-purple tw-bg-popover tw-text-popover-foreground tw-shadow-md tw-p-1 data-[side=bottom]:tw-top-[2px] data-[side=top]:tw-bottom-[2px] data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0 data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95 data-[side=bottom]:tw-slide-in-from-top-2 data-[side=left]:tw-slide-in-from-right-2 data-[side=right]:tw-slide-in-from-left-2 data-[side=top]:tw-slide-in-from-bottom-2',
			this.userClass(),
		),
	);

	private readonly _stickyLabels = signal(false);
	@Input()
	set stickyLabels(value: boolean) {
		this._stickyLabels.set(value);
	}
	get stickyLabels() {
		return this._stickyLabels();
	}
}