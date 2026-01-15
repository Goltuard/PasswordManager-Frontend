export interface CredentialContainer {
    id: string | null;
    containerHash: string;
    containerString: string;
}

export interface CredentialData {
  serviceName: string;
  userName: string;
  password: string;
  note: string;
}