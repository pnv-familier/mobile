import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse } from "../type"

export const saveTokens = async (data: AuthResponse) => {
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
}