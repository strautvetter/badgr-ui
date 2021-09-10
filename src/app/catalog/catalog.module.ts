import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BadgrCommonModule, COMMON_IMPORTS} from '../common/badgr-common.module';

import {CommonEntityManagerModule} from '../entity-manager/entity-manager.module';
//import {PublicApiService} from './services/public-api.service';
import {BadgrRouteData} from '../common/services/navigation.service';
import {BadgeCatalogComponent} from './components/badge-catalog/badge-catalog.component';
import {IssuerCatalogComponent} from './components/issuer-catalog/issuer-catalog.component';

export const routes: Routes = [
	/**{
		path: '',
		component: PublicComponent,
		data: {
			publiclyAccessible: true,
		} as BadgrRouteData
	},
  */
  {
		path: "badges",
		component: BadgeCatalogComponent
	},
  {
		path: "issuers",
		component: IssuerCatalogComponent
	},
	{
		path: '**',
		redirectTo: "badges",
		data: {
			publiclyAccessible: true,
		} as BadgrRouteData
	},
];


@NgModule({
  declarations: [
    BadgeCatalogComponent,
    IssuerCatalogComponent
  ],
  imports: [
    ...COMMON_IMPORTS,
		BadgrCommonModule,
		CommonEntityManagerModule,
    RouterModule.forChild(routes)
  ]
})
export class CatalogModule { }
