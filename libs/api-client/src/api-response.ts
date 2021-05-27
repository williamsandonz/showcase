export interface IApiResponse<T> {
  payload?: T;
  error?: IApiResponseException;
  system: IApiSystemConfig;
}

export interface IApiSystemConfig {
  environment: string;
  gitCommit: string;
  githubRunNumber: number;
  gitRef: string;
  release: string;
}

export interface IApiResponseException {
  message: string;
}

export const systemConfig = {
  environment: process.env.GLOBAL_ENVIRONMENT,
  gitCommit: process.env.GLOBAL_GIT_COMMIT,
  githubRunNumber: parseInt(process.env.GLOBAL_GITHUB_RUN_NUMBER),
  gitRef: process.env.GLOBAL_GIT_REF,
  release: process.env.RELEASE,
};
