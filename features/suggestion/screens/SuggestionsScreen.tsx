import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft, Lightbulb, Heart, Calendar } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSuggestions, FilterValue } from '../hooks/useSuggestions';
import { SuggestionListItem, SuggestionType } from '../types';

const BACKGROUND_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D69E66';

const TYPE_CONFIG: Record<SuggestionType, { icon: any; label: string; color: string }> = {
  TASK: { icon: Heart, label: 'Love Task', color: '#E91E63' },
  EVENT: { icon: Calendar, label: 'Event', color: '#2196F3' },
  OFFLINE: { icon: Lightbulb, label: 'Offline', color: '#FF9800' },
};

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Done', value: 'ACCEPTED' },
];

interface SuggestionsScreenProps {
  navigation: any;
}

const SuggestionsScreen: React.FC<SuggestionsScreenProps> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const { suggestions, loading, error, fetchSuggestions } = useSuggestions();

  useFocusEffect(
    React.useCallback(() => {
      fetchSuggestions(activeFilter);
    }, [activeFilter])
  );

  const handleFilterChange = (filter: FilterValue) => {
    setActiveFilter(filter);
    fetchSuggestions(filter);
  };

  const renderItem = (item: SuggestionListItem) => {
    const config = TYPE_CONFIG[item.type];
    const IconComponent = config.icon;
    const isDone = item.status === 'ACCEPTED';

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.card}
        onPress={() => navigation.navigate('SuggestionDetail', { id: item.id })}
      >
        <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
          <IconComponent size={24} color={config.color} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <View style={[styles.statusBadge, isDone ? styles.statusDone : styles.statusPending]}>
              <Text style={[styles.statusText, isDone ? styles.statusTextDone : styles.statusTextPending]}>
                {isDone ? 'Done' : 'Pending'}
              </Text>
            </View>
          </View>
          <Text style={styles.typeLabel}>{config.label}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/icon.png')} style={styles.logoIcon} />
            <Text style={styles.headerTitle}>AI Suggestions</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterWrapper}>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterBtn, activeFilter === f.value && styles.filterBtnActive]}
              onPress={() => handleFilterChange(f.value)}
            >
              <Text style={[styles.filterText, activeFilter === f.value && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={ACCENT_COLOR} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchSuggestions(activeFilter)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : suggestions.length === 0 ? (
        <View style={styles.centered}>
          <Lightbulb size={60} color={ACCENT_COLOR} opacity={0.4} />
          <Text style={styles.emptyText}>No suggestions found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {suggestions.map(renderItem)}
        </ScrollView>
      )}
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
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 1 },
  logoIcon: { width: 40, height: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#000' },
  filterWrapper: {
    marginHorizontal: 8,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F5D6B5',
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    alignItems: 'center',
  },
  filterBtnActive: { backgroundColor: ACCENT_COLOR },
  filterText: { color: ACCENT_COLOR, fontWeight: '600', fontSize: 14 },
  filterTextActive: { color: '#FFF' },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F5D6B5',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 8 },
  typeLabel: { fontSize: 11, color: ACCENT_COLOR, fontWeight: '600', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#777', lineHeight: 18 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  statusPending: { backgroundColor: '#FFF3E0' },
  statusDone: { backgroundColor: '#E8F5E9' },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  statusTextPending: { color: '#EF6C00' },
  statusTextDone: { color: '#2E7D32' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#E53935', fontSize: 14, marginBottom: 12 },
  retryBtn: { backgroundColor: ACCENT_COLOR, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: '#FFF', fontWeight: 'bold' },
  emptyText: { color: ACCENT_COLOR, fontSize: 16, fontWeight: '600', marginTop: 16 },
});

export default SuggestionsScreen;
