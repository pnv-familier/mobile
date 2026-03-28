import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import vi from './locales/vi.json';

const LANGUAGE_KEY = '@app_language';

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        vi: { translation: vi },
      },
      lng: savedLanguage || 'vi',
      fallbackLng: 'vi',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export const changeLanguage = async (lang: 'en' | 'vi') => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

export default i18n;
