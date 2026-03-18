import { apiClient } from "../../../api/api";
import { SuccessResponse } from "../../../types/api";
import { Profile, User } from "../type";

export const userService = {
    updateProfile: async (profileData: Partial<Profile>): Promise<SuccessResponse<User>> => {
        const response = await apiClient.put("/api/v1/users/profile", profileData);
        return response.data;
    },
    getCurrentUser: async (): Promise<SuccessResponse<User>> => {
        const response = await apiClient.get("/api/v1/users/me");
        return response.data;
    }
};