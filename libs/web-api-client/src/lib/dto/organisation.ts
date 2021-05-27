export interface IOrganisation {
  id: number;
  name: string;
}

export interface IOrganisationMembership {
  organisation: IOrganisation;
  permissions: IOrganisationPermission[];
  selected: boolean;
}

export interface IOrganisationPermission {
  description: string;
  id: number;
  title: string;
  type: OrganisationPermissionType;
}

export enum OrganisationPermissionType {
  SUPER_USER = 'SUPER_USER'
}
