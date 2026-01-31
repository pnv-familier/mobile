import {
    GoogleSignin,
    statusCodes,
    isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { AuthResponse, User } from '../type';
import { loginWithGoogle } from '../services/auth.service';
import { useNavigation } from '@react-navigation/native';
import { saveTokens } from '../utils/token';
import { useAuthStore } from '../store/auth.store';

export function useGoogleLogin() {
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigation = useNavigation<any>();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_MOBILE,
            offlineAccess: true,
        });
    }, []);

    const login = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices();

            const googleResponse = await GoogleSignin.signIn();
            const idToken = googleResponse.data?.idToken;

            if (!idToken) {
                throw new Error('Can not get ID Token from Google');
            }

            const backendResponse: AuthResponse = (await loginWithGoogle(idToken)).data;
            await saveTokens(backendResponse);

            setAuth(backendResponse.user);
            navigation.navigate("Reference")
        } catch (error: any) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        console.log('User cancelled sign in');
                        break;
                    case statusCodes.IN_PROGRESS:
                        console.log('Sign in in progress...');
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        Alert.alert('Error', 'Google Play Services not available on this device');
                        break;
                    default:
                        console.error('Other Google error:', error);
                        Alert.alert('Google Error', error.message);
                }
            } else {
                console.error('Login Error:', error);

                const message = error.message || error.error || 'An error occurs while processing request';
                Alert.alert('Login failed', message);
            }
        } finally {
            setLoading(false);
        }
    };

    return { login, loading };
}