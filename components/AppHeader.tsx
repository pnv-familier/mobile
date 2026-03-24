import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { User, Menu, Users, ChevronRight } from 'lucide-react-native';
import { NotificationBell } from '../features/notification/components/NotificationBell';
import { NotificationPopup } from '../features/notification/components/NotificationPopup';
import { useLogout } from '../features/auth/hooks/useLogout';
import AppButton from './AppButton';

const ACCENT_COLOR = '#D4A056';

interface AppHeaderProps {
  title: string;
  navigation?: any;
  showNotification?: boolean;
  showProfile?: boolean;
  showMenu?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  navigation,
  showNotification = true,
  showProfile = true,
  showMenu = true,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useLogout();

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/icon.png')} style={styles.logoIcon} />
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {showNotification && (
            <NotificationBell 
              onPress={() => setShowNotifications(true)} 
              color={ACCENT_COLOR}
              style={styles.headerIcon}
            />
          )}
          {showProfile && (
            <TouchableOpacity accessibilityLabel='profile-options-btn' testID='profile-options-btn' onPress={() => setShowOptions(true)}>
              <User size={24} color={ACCENT_COLOR} style={styles.headerIcon} />
            </TouchableOpacity>
          )}
          {showMenu && (
            <TouchableOpacity>
              <Menu size={24} color={ACCENT_COLOR} />
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
                <Text style={styles.sheetTitle}>Family Options</Text>

                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setShowOptions(false);
                    if (navigation) {
                      navigation.navigate('ViewListFamily');
                    }
                  }}
                >
                  <View style={styles.optionIconContainer}>
                    <Users size={20} color={ACCENT_COLOR} />
                  </View>
                  <Text style={styles.optionText}>View Member List</Text>
                  <ChevronRight size={20} color="#CCC" />
                </TouchableOpacity>
                <AppButton title="Logout" onPress={logout} style={{ backgroundColor: '#D4A056' }} />

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowOptions(false)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
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
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 1,
  },
  logoIcon: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    marginTop: 'auto',
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
});
