import { OrganisationPermissionType, ProjectPermissionType } from './enum';

export interface IAccountVm {
  id: string;
  dateJoined: Date;
  email: string;
  name: string;
}

export interface IOrganisationVm {
  id: number;
  name: string;
  slug: string;
}

export interface IOrganisationInvitationVm {
  email: string;
  expiresInDays: number;
  dateInvited: string;
  id: number;
  inviter: IAccountVm;
  organisation: IOrganisationVm;
  secret?: string;
}

export interface IOrganisationMembershipVm {
  account: IAccountVm;
  organisation: IOrganisationVm;
  permissions: IOrganisationPermissionVm[];
  selected: boolean;
}

export interface IOrganisationPermissionVm {
  description: string;
  id: number;
  title: string;
  type: OrganisationPermissionType;
}

export interface IProjectVm {
  id: number;
  name: string;
  slug: string;
}

export interface IProjectMembershipVm {
  account: IAccountVm;
  project: IProjectVm;
  permissions: IProjectPermissionVm[];
}

export interface IProjectPermissionVm {
  description: string;
  id: number;
  title: string;
  type: ProjectPermissionType;
}

export interface IUserSummaryVm {
  cookieUsageEnabled: boolean;
  dateJoined: Date | string;
  name: string;
  organisationMemberships: IOrganisationMembershipVm[];
  projectMemberships: IProjectMembershipVm[];
  timezone: string;
}
