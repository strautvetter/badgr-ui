import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BadgrCommonModule, COMMON_IMPORTS } from '../common/badgr-common.module';

import { CommonEntityManagerModule } from '../entity-manager/entity-manager.module';
//import {PublicApiService} from './services/public-api.service';
import { BadgrRouteData } from '../common/services/navigation.service';
import { BadgeCatalogComponent } from './components/badge-catalog/badge-catalog.component';
import { IssuerCatalogComponent } from './components/issuer-catalog/issuer-catalog.component';
import { BadgeClassManager } from '../issuer/services/badgeclass-manager.service';
import { BadgeClassApiService } from '../issuer/services/badgeclass-api.service';
import { BadgeInstanceApiService } from '../issuer/services/badgeinstance-api.service';
import { BadgeInstanceManager } from '../issuer/services/badgeinstance-manager.service';
import { IssuerApiService } from '../issuer/services/issuer-api.service';
import { IssuerManager } from '../issuer/services/issuer-manager.service';
import { TranslateModule } from '@ngx-translate/core';
import { LearningPathsCatalogComponent } from './components/learningpath-catalog/learningpath-catalog.component';
import { LearningPathManager } from '../issuer/services/learningpath-manager.service';
import { LearningPathApiService } from '../common/services/learningpath-api.service';

export const routes: Routes = [
	{
		path: 'badges',
		component: BadgeCatalogComponent,
	},
	{
		path: 'issuers',
		component: IssuerCatalogComponent,
	},
	{
		path: 'learningpaths',
		component: LearningPathsCatalogComponent,
	},
	{
		path: '**',
		redirectTo: 'badges',
		data: {
			publiclyAccessible: true,
		} as BadgrRouteData,
	},
];

@NgModule({
	declarations: [BadgeCatalogComponent, IssuerCatalogComponent, LearningPathsCatalogComponent],
	imports: [
		...COMMON_IMPORTS,
		BadgrCommonModule,
		CommonEntityManagerModule,
		RouterModule.forChild(routes),
		TranslateModule,
	],
	providers: [
		BadgeClassApiService,
		BadgeClassManager,
		BadgeInstanceApiService,
		BadgeInstanceManager,
		IssuerApiService,
		IssuerManager,
		LearningPathManager,
		LearningPathApiService,
	],
})
export class CatalogModule {}
