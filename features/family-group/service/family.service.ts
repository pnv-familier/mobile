import { apiClient } from "../../../api/api";

export async function checkFamilyStatus(): Promise<'AUTHENTICATED' | 'UNAUTHENTICATED'> {
    const res = await apiClient.get("/api/v1/families/me")
    return res.data ? "AUTHENTICATED" : "UNAUTHENTICATED"
}


export async function createFamilyRequest(name: string) {
    const response = await apiClient.post(`/api/v1/families`, { name });
    return response.data;
}