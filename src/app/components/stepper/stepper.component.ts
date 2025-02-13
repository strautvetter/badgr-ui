import { Component, OnInit, Input } from '@angular/core';
import { CdkStepper, STEPPER_GLOBAL_OPTIONS, CdkStep } from '@angular/cdk/stepper';


// @Component({
// 	selector: 'oeb-step',
//   template: '<ng-template><ng-content/></ng-template>',
// 	providers: [{
// 		provide: CdkStep, useExisting: StepComponent
// 	}, {
//     provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
//   }]
// })
// export class StepComponent extends CdkStep implements OnInit {
//		alternativeUrl: string;

//   ngOnInit() {
//   }
// }

@Component({
  selector: 'oeb-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  /* This custom stepper provides itself as CdkStepper so that it can be recognized
  / by other components. */
  providers: [{
    provide: CdkStepper, useExisting: StepperComponent
  }, {
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class StepperComponent extends CdkStepper implements OnInit {

	@Input()
	altRoutes: [];

	@Input()
	initialStep: number = 0;

  onClick(index: number): void {
		if (typeof this.altRoutes[index] === 'undefined') {
			this.selectedIndex = index;
		} else {
			window.location.pathname = this.altRoutes[index];
		}
  }

  ngOnInit() {
		if (this.initialStep !== 0) {
			this.selectedIndex = this.initialStep;
		}
  }

}
