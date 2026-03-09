export interface Config {
  api_url?: string;
  token?: string;
}

export type LegalCheckType = 'CHECK' | (string & {});

export interface FloLegalCheck {
  type: LegalCheckType;
  identifier: string;
  name: string;
  version: number;
  /** ISO 8601 date string, e.g. "2024-09-04T14:48:50.871Z" */
  modifiedDate: string;
}

export interface PluginData {
  checks: FloLegalCheck[];
  config: Config;
}
