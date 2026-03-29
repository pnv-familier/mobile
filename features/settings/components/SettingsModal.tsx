import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LogOut, Globe, Check, X } from 'lucide-react-native';
import { useLogout } from '../../auth/hooks/useLogout';
import { changeLanguage } from '../../../i18n';

const ACCENT_COLOR = '#D4A056';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { t, i18n } = useTranslation();
  const { logout } = useLogout();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const currentLanguage = i18n.language;

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
            onClose();
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
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={onClose}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.header}>
                <Text style={styles.title}>{t('settings.title')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setShowLanguageModal(true)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                      <Globe size={20} color="#2196F3" />
                    </View>
                    <Text style={styles.menuItemText}>{t('common.language')}</Text>
                  </View>
                  <Text style={styles.menuItemValue}>
                    {currentLanguage === 'vi' ? 'Tiếng Việt' : 'English'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, styles.logoutItem]}
                  onPress={handleLogout}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                      <LogOut size={20} color="#F44336" />
                    </View>
                    <Text style={[styles.menuItemText, styles.logoutText]}>
                      {t('common.logout')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.languageOverlay}>
          <View style={styles.languageContent}>
            <Text style={styles.languageTitle}>{t('settings.selectLanguage')}</Text>

            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => handleChangeLanguage('vi')}
            >
              <Text style={styles.languageText}>{t('settings.vietnamese')}</Text>
              {currentLanguage === 'vi' && (
                <Check size={20} color={ACCENT_COLOR} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => handleChangeLanguage('en')}
            >
              <Text style={styles.languageText}>{t('settings.english')}</Text>
              {currentLanguage === 'en' && (
                <Check size={20} color={ACCENT_COLOR} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#666',
  },
  logoutItem: {
    backgroundColor: '#FFEBEE',
  },
  logoutText: {
    color: '#F44336',
    fontWeight: '600',
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
  cancelButton: {
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});
