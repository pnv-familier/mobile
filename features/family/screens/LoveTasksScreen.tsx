import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions
} from 'react-native';
import { ChevronLeft, Bell, User, Menu, Plus, CheckCircle2, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const LoveTasksScreen = () => {
  const [activeTab, setActiveTab] = useState('Received');

  const receivedTasks = [
    {
      id: 1,
      title: 'Call your grandma',
      status: 'Complete',
      description: 'Grandma misses you very much, please call and check on her.',
      from: 'Dad',
      loveMessage: 'Dad is so proud of you. Grandma will be so happy to hear your voice!',
      statusColor: '#C8E6C9',
      textColor: '#2E7D32'
    },
    {
      id: 2,
      title: 'Take a 30-minute break.',
      status: 'Pending',
      description: "You've worked too much, take a short break.",
      from: 'Dad',
      loveMessage: undefined,
      statusColor: '#FFF3E0',
      textColor: '#EF6C00'
    },
    {
      id: 3,
      title: 'Take your vitamin in the morning.',
      status: 'Shared',
      description: 'Remember to take your vitamin pills after breakfast.',
      from: 'Mom',
      loveMessage: undefined,
      statusColor: '#FCE4EC',
      textColor: '#C2185B'
    }
  ];

  const createdTasks = [
    {
      id: 4,
      title: 'Sending 8/3 wishes to Mom',
      status: 'Pending',
      description: "8/3 is coming soon, let's send loving messages to Mom",
      from: 'Dad',
      loveMessage: undefined,
      statusColor: '#FFF3E0',
      textColor: '#EF6C00'
    }
  ];

  const currentTasks = activeTab === 'Received' ? receivedTasks : createdTasks;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity>
          <ChevronLeft color="#000" size={28} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/616/616490.png' }} style={styles.logoIcon} />
          <Text style={styles.headerTitle}>Love Tasks</Text>
        </View>
        <View style={styles.headerIcons}>
          <Bell color="#D69E66" size={24} fill="#D69E66" style={styles.iconGap} />
          <User color="#D69E66" size={24} fill="#D69E66" style={styles.iconGap} />
          <Menu color="#D69E66" size={24} />
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
              style={[styles.tabButton, activeTab === 'Received' && styles.tabActive]}
              onPress={() => setActiveTab('Received')}
            >
              <Text style={[styles.tabText, activeTab === 'Received' && styles.tabTextActive]}>Received({receivedTasks.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'Created' && styles.tabActive]}
              onPress={() => setActiveTab('Created')}
            >
              <Text style={[styles.tabText, activeTab === 'Created' && styles.tabTextActive]}>Created({createdTasks.length})</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.taskListContainer}>
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: task.statusColor }]}> 
                    {task.status === 'Complete' && <CheckCircle2 size={14} color={task.textColor} style={{ marginRight: 4 }} />}
                    <Text style={[styles.statusText, { color: task.textColor }]}>{task.status}</Text>
                  </View>
                </View>

                <View style={styles.taskBody}>
                  <Image source={{ uri: 'https://i.pravatar.cc/100?u=family' }} style={styles.avatar} />
                  <View style={styles.taskMainContent}>
                    <Text style={styles.description}>{task.description}</Text>
                    <Text style={styles.fromText}>From: {task.from}</Text>
                  </View>
                </View>

                {task.loveMessage && (
                  <View style={styles.loveMessageContainer}>
                    <Heart size={16} color="#E91E63" fill="#E91E63" />
                    <Text style={styles.loveMessageText}>{task.loveMessage}</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Heart color="#E91E63" size={80} fill="#E91E63" style={{ opacity: 0.5 }} />
              <Text style={styles.emptyText}>You haven't {activeTab === 'Received' ? 'received' : 'created'} any love tasks yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Plus color="white" size={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FDF2E3' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 30, height: 30, marginRight: 8 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#4E342E' },
  headerIcons: { flexDirection: 'row' },
  iconGap: { marginRight: 12 },
  container: { padding: 16 },
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
  bannerTitle: { fontSize: 18, color: '#D69E66', fontWeight: '600' },
  bannerSubTitle: { fontSize: 13, color: '#D69E66', opacity: 0.8 },
  tabContainer: { flexDirection: 'row', gap: 10 },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D69E66',
    alignItems: 'center',
  },
  tabActive: { backgroundColor: '#D69E66' },
  tabText: { color: '#D69E66', fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },
  taskListContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    minHeight: 400,
    padding: 12,
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
  taskTitle: { fontSize: 15, fontWeight: 'bold', color: '#D69E66', flex: 1 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  taskBody: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
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
    gap: 8
  },
  loveMessageText: { fontSize: 12, color: '#D69E66', flex: 1, fontStyle: 'italic' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  emptyText: { textAlign: 'center', color: '#D69E66', fontWeight: 'bold', marginTop: 20, fontSize: 16, paddingHorizontal: 40 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#D69E66',
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
  }
});

export default LoveTasksScreen;