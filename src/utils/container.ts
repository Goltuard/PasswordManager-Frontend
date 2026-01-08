import { CredentialPayload } from "../models/CredentialPayload";

export function buildContainerString(p: CredentialPayload): string {
  return JSON.stringify({
    serviceName: p.serviceName,
    userName: p.userName,
    password: p.password,
    note: p.note,
  });
}
