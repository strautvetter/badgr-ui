import { ApiEntityRef } from '../../common/model/entity-ref';

export type IssuerSlug = string;
export type IssuerUrl = string;

export interface IssuerRef {
	'@id': IssuerUrl;
	slug: IssuerSlug;
}

export interface ApiIssuerJsonld {
	'@context': string;
	type: string;
	id: IssuerUrl;

	name: string;
	description: string;
	email: string;
	url: string;
	image: string;
}

export interface ApiIssuer {
	name: string;
	slug: IssuerSlug;
	description: string;
	image: string;

	created_at: string;
	created_by: string;
	staff: ApiIssuerStaff[];

	badgeClassCount: number;
	learningPathCount: number;
	json: ApiIssuerJsonld;

	verified: boolean;

	source_url?: string;

	category?: string;
	street?: string;
	streetnumber?: string;
	zip?: string;
	city?: string;

	lat?: number;
	lon?: number;
	intendedUseVerified: boolean;
	ownerAcceptedTos: boolean;
}

export type IssuerStaffRoleSlug = 'owner' | 'editor' | 'staff';
export interface ApiIssuerStaff {
	role: IssuerStaffRoleSlug;
	user: {
		first_name: string;
		last_name: string;
		email?: string;
		telephone?: string | string[];
		url?: string | string[];
		agreed_terms_version: number;
		latest_terms_version: number;
	};
}

export interface IssuerStaffRef extends ApiEntityRef {}

export interface ApiIssuerStaffOperation {
	action: 'add' | 'modify' | 'remove';
	username?: string;
	email?: string;
	role?: IssuerStaffRoleSlug;
}

export interface ApiIssuerForCreation {
	name: string;
	description: string;
	image?: string;
	email: string;
	url: string;
	category?: string;
	street?: string;
	streetnumber?: string;
	zip?: string;
	city?: string;

	intendedUseVerified: boolean;

	lat?: number;
	lon?: number;
}

export interface ApiIssuerForEditing {
	name: string;
	description: string;
	image?: string;
	email: string;
	url: string;
	category?: string;
	street?: string;
	streetnumber?: string;
	zip?: string;
	city?: string;

	intendedUseVerified: boolean;

	lat?: number;
	lon?: number;
}
