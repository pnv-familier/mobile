import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Menu, Users, User, ChevronRight, ChevronLeft, Globe, LogOut } from 'lucide-react-native';
import { NotificationBell } from '../features/notification/components/NotificationBell';
import { NotificationPopup } from '../features/notification/components/NotificationPopup';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { useLogout } from '../features/auth/hooks/useLogout';
import { useAuthStore } from '../features/auth/store/auth.store';
import { colors, spacing, radius, typography } from '../theme';

const ACCENT_COLOR = '#D4A056';

interface AppHeaderProps {
  title: string;
  navigation?: any;
  showBack?: boolean;
  onBackPress?: () => void;
  showNotification?: boolean;
  showProfile?: boolean;
  showMenu?: boolean;
  onUserPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  navigation,
  showBack = false,
  onBackPress,
  showNotification,
  showProfile,
  showMenu = true,
  onUserPress,
}) => {
  const { t, i18n } = useTranslation();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.data);
  const isAuthenticated = !!user;

  const shouldShowNotification = showNotification !== undefined ? showNotification : isAuthenticated;
  const shouldShowProfile = showProfile !== undefined ? showProfile : isAuthenticated;

  const [showOptions, setShowOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const currentLanguage = i18n.language;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('common.confirm'),
      t('settings.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.logout'),
          style: 'destructive',
          onPress: () => {
            logout();
            setShowOptions(false);
          },
        },
      ]
    );
  };

  const handleChangeLanguage = async (lang: 'en' | 'vi') => {
    await changeLanguage(lang);
    setShowLanguageModal(false);
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showBack && (
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.backButton}
            >
              <ChevronLeft size={22} color={colors.primary} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          {shouldShowNotification && (
            <NotificationBell 
              onPress={() => setShowNotifications(true)} 
              color={ACCENT_COLOR}
              style={styles.headerIcon}
            />
          )}
          {shouldShowProfile && (
            <TouchableOpacity accessibilityLabel='profile-options-btn' testID='profile-options-btn' onPress={onUserPress || (() => setShowOptions(true))}>
              <User size={22} color={ACCENT_COLOR} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.optionSheet}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>{t('settings.familyOptions')}</Text>

                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setShowOptions(false);
                    if (navigation) {
                      // Navigate within the same stack navigator
                      navigation.navigate('ViewListFamily');
                    }
                  }}
                >
                  <View style={styles.optionIconContainer}>
                    <Users size={20} color={ACCENT_COLOR} />
                  </View>
                  <Text style={styles.optionText}>{t('settings.viewMembers')}</Text>
                  <ChevronRight size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionItem, { backgroundColor: '#E3F2FD' }]}
                  onPress={() => {
                    setShowOptions(false);
                    setShowLanguageModal(true);
                  }}
                >
                  <View style={[styles.optionIconContainer, { backgroundColor: '#FFF' }]}>
                    <Globe size={20} color="#2196F3" />
                  </View>
                  <Text style={styles.optionText}>{t('common.language')}</Text>
                  <Text style={styles.languageValue}>
                    {currentLanguage === 'vi' ? 'Tiếng Việt' : 'English'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionItem, { backgroundColor: '#FFEBEE' }]}
                  onPress={handleLogout}
                  testID="logout-button"
                  accessibilityLabel="Logout"
                >
                  <View style={[styles.optionIconContainer, { backgroundColor: '#FFF' }]}>
                    <LogOut size={20} color="#F44336" />
                  </View>
                  <Text style={[styles.optionText, { color: '#F44336' }]}>{t('common.logout')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowOptions(false)}
                >
                  <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <NotificationPopup
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLanguageModal(false)}>
          <View style={styles.languageOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.languageContent}>
                <Text style={styles.languageTitle}>{t('settings.selectLanguage')}</Text>

                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => handleChangeLanguage('vi')}
                >
                  <Text style={styles.languageText}>{t('settings.vietnamese')}</Text>
                  {currentLanguage === 'vi' && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => handleChangeLanguage('en')}
                >
                  <Text style={styles.languageText}>{t('settings.english')}</Text>
                  {currentLanguage === 'en' && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.languageCancelButton}
                  onPress={() => setShowLanguageModal(false)}
                >
                  <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIcon: {},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  optionSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    width: '100%',
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#EEE',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  sheetTitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FDF2E3',
    borderRadius: 15,
    marginBottom: 15,
  },
  optionIconContainer: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  languageValue: {
    fontSize: 14,
    color: '#666',
    marginLeft: 'auto',
  },
  languageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  languageContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  checkmark: {
    fontSize: 20,
    color: ACCENT_COLOR,
    fontWeight: 'bold',
  },
  languageCancelButton: {
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
});
