export interface CredentialContainer {
    id: string | null;
    hash: string;
    string: CredentialData;
}

export interface CredentialData {
  serviceName: string;
  userName: string;
  password: string;
  note: string;
}