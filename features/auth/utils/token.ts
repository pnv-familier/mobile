import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse } from "../type";
import { User } from "../../user/type";

export interface SaveTokenPayload {
    accessToken: string;
    refreshToken: string;
    user?: User;
}

export const saveTokens = async (data: SaveTokenPayload | AuthResponse) => {
    const pairs: [string, string][] = [
        ['accessToken', data.accessToken],
        ['refreshToken', data.refreshToken],
    ];
    if (data.user) {
        pairs.push(['user', JSON.stringify(data.user)]);
    }
    await AsyncStorage.multiSet(pairs);
};

export const removeTokens = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
};