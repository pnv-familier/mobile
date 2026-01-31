import { apiClient } from "../../../api/api"
import { RegisterPayload } from "../type"
import { isAxiosError } from "axios"

export async function register(payload: RegisterPayload) {
    try {
        const response = await apiClient.post("/api/v1/auth/register", payload)
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response) {
                throw error.response.data
            } else {
                throw new Error("No internet connection")
            }
        }
        throw new Error("An unexpected error occurred")
    }
}
