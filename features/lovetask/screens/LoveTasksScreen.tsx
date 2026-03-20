import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { ChevronLeft, Bell, User, Menu, Plus, CheckCircle2, Heart, Users, ChevronRight } from 'lucide-react-native';
import { useLoveTasks } from '../hooks/useLoveTasks';
import { LoveTask } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { useLogout } from '../../auth/hooks/useLogout';
import AppButton from '../../../components/AppButton';
import { NotificationPopup } from '../../notification/components/NotificationPopup';
import { NotificationBell } from '../../notification/components/NotificationBell';

const BACKGROUND_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D69E66';

interface LoveTasksScreenProps {
  navigation: any;
}

const LoveTasksScreen: React.FC<LoveTasksScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'received' | 'created'>('received');
  const [showOptions, setShowOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { tasks, receivedCount, createdCount, loading, error, refetch } = useLoveTasks(activeTab);
  const { logout } = useLogout();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [activeTab])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#C8E6C9', text: '#2E7D32' };
      case 'PENDING':
        return { bg: '#FFF3E0', text: '#EF6C00' };
      case 'SHARED':
        return { bg: '#FCE4EC', text: '#C2185B' };
      default:
        return { bg: '#F5F5F5', text: '#666' };
    }
  };

  const handleTaskPress = (taskId: number) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  const handleCreateTask = () => {
    navigation.navigate('CreateLoveTask');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#333" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/icon.png')} style={styles.logoIcon} />
            <Text style={styles.headerTitle}>Love Tasks</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <NotificationBell onPress={() => setShowNotifications(true)} />
          <TouchableOpacity onPress={() => setShowOptions(true)}>
            <User size={24} color={ACCENT_COLOR} style={styles.headerIconGap} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Menu size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bannerCard}>
          <View style={styles.bannerContent}>
            <Heart color="#E91E63" size={40} fill="#E91E63" />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Love Tasks</Text>
              <Text style={styles.bannerSubTitle}>Love through every little thing</Text>
            </View>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'received' && styles.tabActive]}
              onPress={() => setActiveTab('received')}
            >
              <Text style={[styles.tabText, activeTab === 'received' && styles.tabTextActive]}>
                Received ({receivedCount})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'created' && styles.tabActive]}
              onPress={() => setActiveTab('created')}
            >
              <Text style={[styles.tabText, activeTab === 'created' && styles.tabTextActive]}>
                Created ({createdCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.taskListContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={ACCENT_COLOR} />
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : tasks.length > 0 ? (
            tasks.map((task) => {
              const statusColors = getStatusColor(task.status);
              return (
                <TouchableOpacity 
                  key={task.taskId} 
                  style={styles.taskCard}
                  onPress={() => handleTaskPress(task.taskId)}
                >
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}> 
                      {task.status === 'COMPLETED' && (
                        <CheckCircle2 size={14} color={statusColors.text} style={styles.statusIcon} />
                      )}
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {task.status.charAt(0) + task.status.slice(1).toLowerCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.taskBody}>
                    {task.sender.avatarUrl ? (
                      <Image source={{ uri: task.sender.avatarUrl }} style={styles.avatar} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <User size={20} color="#999" />
                      </View>
                    )}
                    <View style={styles.taskMainContent}>
                      <Text style={styles.description} numberOfLines={1}>{task.description}</Text>
                      <Text style={styles.fromText}>From: {task.sender.fullName}</Text>
                    </View>
                  </View>

                  {task.status === 'COMPLETED' && task.loveMessage && (
                    <View style={styles.loveMessageContainer}>
                      <Heart size={16} color="#E91E63" fill="#E91E63" />
                      <Text style={styles.loveMessageText}>{task.loveMessage}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Image 
                source={require('../../../assets/love-task.png')} 
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                {activeTab === 'received' 
                  ? "You haven't received any love tasks yet" 
                  : "You haven't created any love tasks yet"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleCreateTask}>
        <Plus color="white" size={32} />
      </TouchableOpacity>

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
                    navigation.navigate('ViewListFamily');
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 15,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 1 },
  logoIcon: { width: 40, height: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#000' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIconGap: { marginHorizontal: 15 },
  container: { padding: 16, paddingBottom: 100 },
  bannerCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5D6B5',
    marginBottom: 20,
  },
  bannerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  bannerTextContainer: { marginLeft: 12 },
  bannerTitle: { fontSize: 18, color: ACCENT_COLOR, fontWeight: '600' },
  bannerSubTitle: { fontSize: 13, color: ACCENT_COLOR, opacity: 0.8 },
  tabContainer: { flexDirection: 'row' },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  tabActive: { backgroundColor: ACCENT_COLOR },
  tabText: { color: ACCENT_COLOR, fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },
  taskListContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    minHeight: 400,
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  taskCard: {
    borderWidth: 1,
    borderColor: '#F5D6B5',
    borderRadius: 15,
    padding: 12,
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5D6B5',
    paddingBottom: 8,
    marginBottom: 10,
  },
  taskTitle: { fontSize: 15, fontWeight: 'bold', color: ACCENT_COLOR, flex: 1, marginRight: 8 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: { marginRight: 4 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  taskBody: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskMainContent: { flex: 1 },
  description: { fontSize: 14, color: '#777', lineHeight: 20 },
  fromText: { fontSize: 12, color: '#AAA', marginTop: 4 },
  loveMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  loveMessageText: { fontSize: 12, color: ACCENT_COLOR, flex: 1, fontStyle: 'italic', marginLeft: 8 },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 80 
  },
  emptyIcon: {
    width: 120,
    height: 120,
    opacity: 0.6,
  },
  emptyText: { 
    textAlign: 'center', 
    color: ACCENT_COLOR, 
    fontWeight: '600', 
    marginTop: 24, 
    fontSize: 16, 
    paddingHorizontal: 40 
  },
  errorText: {
    textAlign: 'center',
    color: '#E53935',
    fontSize: 14,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: ACCENT_COLOR,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
    fontWeight: '600',
  },
});

export default LoveTasksScreen;
