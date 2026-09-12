import { Alert } from 'react-native';
import i18n from '../i18n';

export interface FriendlyError {
  title: string;
  message: string;
  isNetwork: boolean;
}

export const getFriendlyErrorMessage = (error: any): FriendlyError => {
  if (!error) {
    return {
      title: i18n.t('common.error', { defaultValue: 'Error' }),
      message: 'An unexpected issue occurred. Please try again.',
      isNetwork: false,
    };
  }

  if (typeof error === 'string') {
    const isNet = error.toLowerCase().includes('network') || error.toLowerCase().includes('internet');
    return {
      title: isNet ? 'Connection Issue' : i18n.t('common.error', { defaultValue: 'Error' }),
      message: error,
      isNetwork: isNet,
    };
  }

  const status = error?.response?.status || error?.status;
  const rawMessage: string = error?.response?.data?.message || error?.message || '';

  // Network / Connection errors
  if (
    error?.code === 'ECONNABORTED' ||
    error?.message?.includes('Network Error') ||
    error?.message?.includes('timeout') ||
    rawMessage.toLowerCase().includes('network connection failed') ||
    (!status && error?.isAxiosError)
  ) {
    return {
      title: 'Connection Issue',
      message: 'Unable to connect to the server. Please check your internet connection.',
      isNetwork: true,
    };
  }

  // HTTP Status based friendly mappings
  if (status === 400) {
    return {
      title: 'Invalid Request',
      message: rawMessage || 'Please check your information and try again.',
      isNetwork: false,
    };
  }

  if (status === 401 || status === 403) {
    return {
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again.',
      isNetwork: false,
    };
  }

  if (status === 404) {
    return {
      title: 'Item Not Found',
      message: rawMessage || 'The requested item could not be found.',
      isNetwork: false,
    };
  }

  if (status === 429) {
    return {
      title: 'Please Slow Down',
      message: 'Too many requests. Please wait a moment before trying again.',
      isNetwork: false,
    };
  }

  if (status && status >= 500) {
    return {
      title: 'Service Temporarily Unavailable',
      message: 'Our service is undergoing maintenance or temporary issues. Please try again shortly.',
      isNetwork: false,
    };
  }

  return {
    title: i18n.t('common.error', { defaultValue: 'Error' }),
    message: rawMessage || 'Something went wrong. Please try again.',
    isNetwork: false,
  };
};

export const showErrorAlert = (error: any, onOk?: () => void) => {
  const { title, message } = getFriendlyErrorMessage(error);
  Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
};
