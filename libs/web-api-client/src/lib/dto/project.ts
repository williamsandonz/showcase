export interface ICreateProjectDto {
  name: string;
}

export interface IProject {
  name: string;
}

export interface IProjectMembership {
  project: IProject;
  permissions: IProjectPermission[];
  selected: boolean;
}

export interface IProjectPermission {
  description: string;
  id: number;
  title: string;
  type: ProjectPermissionType;
}

export enum ProjectPermissionType {
  SUPER_USER = 'SUPER_USER'
}
