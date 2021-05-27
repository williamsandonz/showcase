import { IOrganisationMembership } from "./organisation";
import { IProjectMembership } from "./project";

export interface IAccountAuthenticatedRequestDto {
  cookieUsageEnabled: boolean;
}

export interface IAccountSummary {
  cookieUsageEnabled: boolean;
  name: string;
  organisationMemberships: IOrganisationMembership[];
  projectMemberships: IProjectMembership[];
}

export interface ISignUpRequestDto {
  id: string;
  name: string;
  organisation: string;
}
