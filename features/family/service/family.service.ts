import { apiClient } from "../../../api/api";
import { MyFamilyResponse } from "../types";

export async function checkFamilyStatus(): Promise<'AUTHENTICATED' | 'UNAUTHENTICATED'> {
    const res = await apiClient.get("/api/v1/families/me")
    return res.data ? "AUTHENTICATED" : "UNAUTHENTICATED"
}


export async function createFamilyRequest(name: string) {
    const response = await apiClient.post(`/api/v1/families`, { name });
    return response.data;
}

export const createFamily = async (name: string, nickname: string): Promise<MyFamilyResponse> => {
  const response = await apiClient.post<MyFamilyResponse>('/api/v1/families', { name, nickname })
  return response.data
}

export const joinFamily = async (inviteCode: string, nickname: string): Promise<MyFamilyResponse> => {
  const response = await apiClient.post<MyFamilyResponse>('/api/v1/families/join', { inviteCode, nickname })
  return response.data
}

export const getMyFamily = async (): Promise<MyFamilyResponse> => {
  const response = await apiClient.get<MyFamilyResponse>('/api/v1/families/me')
  return response.data
}