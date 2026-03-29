import { TFunction } from 'i18next';

export const formatRelativeTime = (dateString: string, t: TFunction): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return t('suggestions.justNow');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${t('suggestions.minutesAgo')}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${t('suggestions.hoursAgo')}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${t('suggestions.daysAgo')}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${t('suggestions.weeksAgo')}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${t('suggestions.monthsAgo')}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${t('suggestions.yearsAgo')}`;
};

export const formatDateTime = (dateString: string, locale: string = 'vi'): string => {
  const date = new Date(dateString);
  return date.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (dateString: string, locale: string = 'vi'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatTime = (dateString: string, locale: string = 'vi'): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
