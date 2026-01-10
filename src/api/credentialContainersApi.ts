import { api } from "./apiClient";
import { CredentialContainer } from "../models/CredentialContainer";

export async function getContainers(): Promise<CredentialContainer[]> {
  const res = await api.get("/api/CredentialContainers");
  return res.data;
}

export async function getContainer(id: string): Promise<CredentialContainer> {
  const res = await api.get(`/api/CredentialContainers/${id}`);
  return res.data;
}

export async function createContainer(
  data: Omit<CredentialContainer, "id">
) {
  await api.post("/api/CredentialContainers", data);
}

export async function updateContainer(
  id: string,
  data: Omit<CredentialContainer, "id">
) {
  await api.put(`/api/CredentialContainers/${id}`, data);
}

export async function deleteContainer(id: string) {
  await api.delete(`/api/CredentialContainers/${id}`);
}
