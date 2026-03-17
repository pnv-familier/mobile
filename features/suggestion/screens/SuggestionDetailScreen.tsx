import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ChevronLeft, Heart, Calendar, Lightbulb } from 'lucide-react-native';
import { useSuggestionDetail } from '../hooks/useSuggestionDetail';
import { SuggestionType, EventPayload, TaskPayload } from '../types';

const BACKGROUND_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D69E66';

const TYPE_CONFIG: Record<SuggestionType, { icon: any; label: string; color: string }> = {
  TASK: { icon: Heart, label: 'Love Task', color: '#E91E63' },
  EVENT: { icon: Calendar, label: 'Event', color: '#2196F3' },
  OFFLINE: { icon: Lightbulb, label: 'Offline', color: '#FF9800' },
};

interface SuggestionDetailScreenProps {
  navigation: any;
  route: any;
}

const SuggestionDetailScreen: React.FC<SuggestionDetailScreenProps> = ({ navigation, route }) => {
  const { id } = route.params;
  const { suggestion, loading, error, refetch, acceptSuggestion } = useSuggestionDetail(id);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={ACCENT_COLOR} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !suggestion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Suggestion not found'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const config = TYPE_CONFIG[suggestion.type];
  const IconComponent = config.icon;
  const isDone = suggestion.status === 'ACCEPTED';

  const handleCreateLoveTask = () => {
    const payload = suggestion.payload as TaskPayload;
    navigation.navigate('SuggestionCreateLoveTask', {
      prefillTitle: payload.title,
      prefillDescription: payload.description,
      onSuccess: async () => {
        try {
          await acceptSuggestion();
        } catch (err: any) {
          Alert.alert('Error', err?.message || 'Failed to update suggestion status');
        }
      },
    });
  };

  const handleAddToSchedule = () => {
    const payload = suggestion.payload as EventPayload;
    navigation.navigate('SuggestionCreateEvent', {
      prefillTitle: payload.title,
      prefillStartTime: payload.startTime,
      prefillEndTime: payload.endTime,
      prefillDate: new Date(payload.year, payload.month - 1, payload.date),
      onSuccess: async () => {
        try {
          await acceptSuggestion();
        } catch (err: any) {
          Alert.alert('Error', err?.message || 'Failed to update suggestion status');
        }
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/icon.png')} style={styles.logoIcon} />
          <Text style={styles.headerTitle}>Suggestion Detail</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title Card */}
        <View style={styles.titleCard}>
          <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
            <IconComponent size={28} color={config.color} />
          </View>
          <View style={styles.titleInfo}>
            <Text style={styles.typeLabel}>{config.label}</Text>
            <Text style={styles.title}>{suggestion.title}</Text>
          </View>
          <View style={[styles.statusBadge, isDone ? styles.statusDone : styles.statusPending]}>
            <Text style={[styles.statusText, isDone ? styles.statusTextDone : styles.statusTextPending]}>
              {isDone ? 'Done' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* Suggestion Content - AC016.12 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Suggestion</Text>
          <Text style={styles.sectionBody}>{suggestion.description}</Text>
        </View>

        {/* Why This Suggestion - AC016.13 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Why This Suggestion</Text>
          <Text style={styles.sectionBody}>{suggestion.triggerContext}</Text>
        </View>

        {/* Choose an action - AC016.14, 15, 16 */}
        {!isDone && suggestion.type !== 'OFFLINE' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Choose an action</Text>
            {suggestion.type === 'TASK' && (
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#E91E63' }]} onPress={handleCreateLoveTask}>
                <Heart size={20} color="#FFF" />
                <Text style={styles.actionBtnText}>Create Love Task</Text>
              </TouchableOpacity>
            )}
            {suggestion.type === 'EVENT' && (
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2196F3' }]} onPress={handleAddToSchedule}>
                <Calendar size={20} color="#FFF" />
                <Text style={styles.actionBtnText}>Add to Schedule</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 15,
    gap: 8,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 40, height: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#000' },
  container: { padding: 16, paddingBottom: 40 },
  titleCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5D6B5',
    marginBottom: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleInfo: { flex: 1 },
  typeLabel: { fontSize: 11, color: ACCENT_COLOR, fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusPending: { backgroundColor: '#FFF3E0' },
  statusDone: { backgroundColor: '#E8F5E9' },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  statusTextPending: { color: '#EF6C00' },
  statusTextDone: { color: '#2E7D32' },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F5D6B5',
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: ACCENT_COLOR, marginBottom: 10 },
  sectionBody: { fontSize: 14, color: '#555', lineHeight: 22 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    gap: 10,
    marginTop: 4,
  },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#E53935', fontSize: 14, marginBottom: 12 },
  retryBtn: { backgroundColor: ACCENT_COLOR, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: '#FFF', fontWeight: 'bold' },
});

export default SuggestionDetailScreen;
