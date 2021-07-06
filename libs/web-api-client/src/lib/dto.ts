import { IOrganisationInvitationVm, IOrganisationMembershipVm, IProjectMembershipVm } from './vm';

export interface IAcceptInvitationRequestDto {
  name: string;
  secret: string;
  timezone: string;
}

export interface IAccountAuthenticatedRequestDto {
  cookieUsageEnabled: boolean;
}

export interface IConfirmPaymentIntentRequestDto {
  paymentIntentId: string;
}

export interface ICreateOrganisationRequestDto {
  name: string;
}

export interface ICreatePaymentIntentRequestDto {
  paymentMethodId: string;
  saveCard: boolean;
}

export interface ICreateProjectRequestDto {
  name: string;
}

export interface IDemoPostRequestDto {
  foo: string;
}

export interface IDemoPostResponseDto {
  id: number;
  foo: string;
}

export interface IOrganisationEditDetailsRequestDto {
  name: string;
  slug: string;
}

export interface IOrganisationInvitationRequestDto {
  email: string;
}

export interface IOrganisationInvitationListResponseDto {
  invitations: IOrganisationInvitationVm[];
  total: number;
}

export interface IOrganisationInvitationRecipientStatusResponseDto {
  accountExists: boolean;
  invitation: IOrganisationInvitationVm;
}

export interface IOrganisationInviteMemberRequestDto {
  email: string;
}

export interface IOrganisationMemberListResponseDto {
  members: IOrganisationMembershipVm[];
  total: number;
}

export interface IPaymentIntentResponseDto {
  intentClientSecret?: string;
  errorMessage?: string;
  paymentIntentId?: string;
  requiresAction?: boolean;
}

export interface IProjectEditDetailsRequestDto {
  id: number;
  name: string;
}

export interface IProjectMemberListResponseDto {
  members: IProjectMembershipVm[];
  total: number;
}

export interface ISignUpRequestDto {
  name: string;
  organisation: string;
}

export interface IUserEditDetailsRequestDto {
  name: string;
  timezone: string;
}



