import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { 
  ChevronLeft, 
  Bell, 
  User, 
  Menu, 
  Search, 
  ChevronRight, 
  Plus,
  Users,
  Calendar,
  X,
} from 'lucide-react-native';
import { useEvents, parseEventDate } from '../hooks/useEvents';
import { FamilyEvent } from '../types';
import { useLogout } from '../../auth/hooks/useLogout';
import AppButton from '../../../components/AppButton';
import { useFocusEffect } from '@react-navigation/native';
import { NotificationPopup } from '../../notification/components/NotificationPopup';

const BACKGROUND_COLOR = '#FDF0D5';
const ACCENT_COLOR = '#D4A056';

interface FamilyScheduleProps {
  navigation: any;
}

const FamilySchedule: React.FC<FamilyScheduleProps> = ({ navigation }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useLogout();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<FamilyEvent | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const { events, loading, error, refetch } = useEvents(selectedYear, selectedMonth);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [selectedYear, selectedMonth])
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month - 1, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

  const getEventsForDate = (date: number) => {
    return events.filter(event => {
      const eventDate = parseEventDate(event.startTime);
      return eventDate.getDate() === date &&
             eventDate.getMonth() + 1 === selectedMonth &&
             eventDate.getFullYear() === selectedYear;
    });
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleEventPress = (event: FamilyEvent) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const getWeekDates = (startDate: Date) => {
    const week = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const handlePrevWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedWeekStart(newDate);
    setSelectedYear(newDate.getFullYear());
    setSelectedMonth(newDate.getMonth() + 1);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedWeekStart(newDate);
    setSelectedYear(newDate.getFullYear());
    setSelectedMonth(newDate.getMonth() + 1);
  };

  const getEventsForWeekDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseEventDate(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const weekDates = getWeekDates(selectedWeekStart);
  
  const filteredEvents = searchQuery.trim()
    ? events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;
  
  // Auto navigate to first filtered event
  useEffect(() => {
    if (searchQuery.trim() && filteredEvents.length > 0) {
      const firstEvent = filteredEvents[0];
      const eventDate = parseEventDate(firstEvent.startTime);
      
      setSelectedYear(eventDate.getFullYear());
      setSelectedMonth(eventDate.getMonth() + 1);
      setSelectedDate(eventDate.getDate());
      
      if (viewMode === 'week') {
        setSelectedWeekStart(eventDate);
      }
    }
  }, [searchQuery, filteredEvents.length]);
  
  const getFilteredEventsForDate = (date: number) => {
    return filteredEvents.filter(event => {
      const eventDate = parseEventDate(event.startTime);
      return eventDate.getDate() === date &&
             eventDate.getMonth() + 1 === selectedMonth &&
             eventDate.getFullYear() === selectedYear;
    });
  };

  const getFilteredEventsForWeekDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = parseEventDate(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const selectedDateEvents = getFilteredEventsForDate(selectedDate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#333" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image source={require('../../../assets/icon.png')} style={{ width: 40, height: 40 }} />
              <Text style={styles.headerTitle}>Family Schedule</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setShowNotifications(true)}>
              <Bell size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowOptions(true)}>
              <User size={24} color={ACCENT_COLOR} style={{ marginHorizontal: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Menu size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search events..." 
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'month' && styles.toggleButtonActive]}
            onPress={() => setViewMode('month')}
          >
            <Calendar size={16} color={viewMode === 'month' ? '#FFF' : ACCENT_COLOR} />
            <Text style={[styles.toggleText, viewMode === 'month' && styles.toggleTextActive]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'week' && styles.toggleButtonActive]}
            onPress={() => setViewMode('week')}
          >
            <Calendar size={16} color={viewMode === 'week' ? '#FFF' : ACCENT_COLOR} />
            <Text style={[styles.toggleText, viewMode === 'week' && styles.toggleTextActive]}>Week</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {viewMode === 'month' ? (
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={handlePrevMonth}>
                <ChevronLeft size={24} color={ACCENT_COLOR} />
              </TouchableOpacity>
              <View style={styles.monthSelector}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.monthText}>{monthNames[selectedMonth - 1]}</Text>
                  <Text style={styles.yearText}>{selectedYear}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleNextMonth}>
                <ChevronRight size={24} color={ACCENT_COLOR} />
              </TouchableOpacity>
            </View>

            <View style={styles.daysRow}>
              {days.map(day => (
                <Text key={day} style={styles.dayLabel}>{day}</Text>
              ))}
            </View>

            <View style={styles.datesGrid}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.dateCell} />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const date = i + 1;
                const dateEvents = getFilteredEventsForDate(date);
                const isSelected = date === selectedDate;
                
                return (
                  <TouchableOpacity 
                    key={date} 
                    style={styles.dateCell}
                    onPress={() => setSelectedDate(date)}
                  >
                    <View style={[styles.dateNumberContainer, isSelected && styles.activeDate]}>
                      <Text style={[styles.dateText, isSelected && styles.activeDateText]}>
                        {date}
                      </Text>
                    </View>
                    {dateEvents.length > 0 && (
                      <View style={styles.dotsRow}>
                        {dateEvents.slice(0, 3).map((_, idx) => (
                          <View key={idx} style={styles.dot} />
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          ) : (
            <View style={styles.weekCard}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={handlePrevWeek}>
                  <ChevronLeft size={24} color={ACCENT_COLOR} />
                </TouchableOpacity>
                <View style={styles.monthSelector}>
                  <Text style={styles.monthText}>
                    {monthNames[weekDates[0].getMonth()]} {weekDates[0].getDate()} - {monthNames[weekDates[6].getMonth()]} {weekDates[6].getDate()}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleNextWeek}>
                  <ChevronRight size={24} color={ACCENT_COLOR} />
                </TouchableOpacity>
              </View>

              <View style={styles.weekViewContainer}>
                {weekDates.map((date, idx) => {
                  const dayEvents = getFilteredEventsForWeekDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <View key={idx} style={styles.weekDayRow}>
                      <View style={styles.weekDayHeader}>
                        <View style={styles.weekDayInfo}>
                          <Text style={styles.weekDayName}>{days[idx]}</Text>
                          <View style={[styles.weekDateCircle, isToday && styles.weekDateCircleToday]}>
                            <Text style={[styles.weekDateNumber, isToday && styles.weekDateNumberToday]}>
                              {date.getDate()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.weekEventCount}>{dayEvents.length} events</Text>
                      </View>
                      <View style={styles.weekEventsContainer}>
                        {dayEvents.length > 0 ? (
                          dayEvents.map(event => (
                            <TouchableOpacity 
                              key={event.eventId}
                              style={styles.weekEventItem}
                              onPress={() => handleEventPress(event)}
                            >
                              <View style={styles.weekEventTime}>
                                <Text style={styles.weekEventTimeText}>
                                  {parseEventDate(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                              </View>
                              <Text style={styles.weekEventTitle} numberOfLines={1}>{event.title}</Text>
                            </TouchableOpacity>
                          ))
                        ) : (
                          <Text style={styles.noEventsText}>No events</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {viewMode === 'month' && (
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={ACCENT_COLOR} />
              </View>
            ) : (
              <View style={styles.eventList}>
                {selectedDateEvents.map(event => (
                  <TouchableOpacity 
                    key={event.eventId} 
                    style={styles.eventItem}
                    onPress={() => handleEventPress(event)}
                  >
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>
                      {parseEventDate(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </ScrollView>

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Plus size={32} color="#FFF" />
        </TouchableOpacity>

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

      <Modal
        visible={showEventDetail}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEventDetail(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowEventDetail(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.eventDetailModal}>
                <View style={styles.eventDetailHeader}>
                  <Text style={styles.eventDetailTitle}>{selectedEvent?.title}</Text>
                  <TouchableOpacity onPress={() => setShowEventDetail(false)}>
                    <X size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={styles.eventDetailContent}>
                  <View style={styles.eventDetailRow}>
                    <Calendar size={20} color={ACCENT_COLOR} />
                    <View style={styles.eventDetailInfo}>
                      <Text style={styles.eventDetailLabel}>Date</Text>
                      <Text style={styles.eventDetailValue}>
                        {selectedEvent && parseEventDate(selectedEvent.startTime).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.eventDetailRow}>
                    <Calendar size={20} color={ACCENT_COLOR} />
                    <View style={styles.eventDetailInfo}>
                      <Text style={styles.eventDetailLabel}>Time</Text>
                      <Text style={styles.eventDetailValue}>
                        {selectedEvent && parseEventDate(selectedEvent.startTime).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {selectedEvent && parseEventDate(selectedEvent.endTime).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                  </View>

                  {selectedEvent?.description && (
                    <View style={styles.eventDetailRow}>
                      <Menu size={20} color={ACCENT_COLOR} />
                      <View style={styles.eventDetailInfo}>
                        <Text style={styles.eventDetailLabel}>Note</Text>
                        <Text style={styles.eventDetailValue}>{selectedEvent.description}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.eventDetailRow}>
                    <Users size={20} color={ACCENT_COLOR} />
                    <View style={styles.eventDetailInfo}>
                      <Text style={styles.eventDetailLabel}>Created by</Text>
                      <View style={styles.creatorInfo}>
                        {selectedEvent?.creator.avatarUrl ? (
                          <Image 
                            source={{ uri: selectedEvent.creator.avatarUrl }} 
                            style={styles.creatorAvatar} 
                          />
                        ) : (
                          <View style={styles.creatorAvatar}>
                            <User size={16} color="#999" />
                          </View>
                        )}
                        <Text style={styles.creatorName}>{selectedEvent?.creator.fullName}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeEventButton}
                  onPress={() => setShowEventDetail(false)}
                >
                  <Text style={styles.closeEventButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <NotificationPopup
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  container: { flex: 1, paddingHorizontal: 20 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35, marginBottom: 15 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 1  },
  logoIcon: { width: 35, height: 35, backgroundColor: ACCENT_COLOR, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#000' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  searchContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 25, 
    alignItems: 'center', 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    marginBottom: 20
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 45, fontSize: 16 },

  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: ACCENT_COLOR,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
  toggleTextActive: {
    color: '#FFF',
  },

  calendarCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, elevation: 2 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  monthSelector: { flexDirection: 'row', alignItems: 'center' },
  monthText: { fontSize: 18, fontWeight: 'bold', color: ACCENT_COLOR },
  yearText: { fontSize: 12, color: '#999' },
  
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  dayLabel: { width: 40, textAlign: 'center', color: '#999', fontSize: 12 },
  
  datesGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  dateCell: { width: '14.28%', height: 40, alignItems: 'center', justifyContent: 'center', marginVertical: 3 },
  dateNumberContainer: { padding: 3, minWidth: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  dateText: { fontSize: 12, color: '#333' },
  
  activeDate: { backgroundColor: ACCENT_COLOR, borderRadius: 10 },
  activeDateText: { color: '#FFF', fontWeight: 'bold' },
  
  dotsRow: { flexDirection: 'row', marginTop: 4 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: ACCENT_COLOR, marginHorizontal: 1 },

  weekCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    marginBottom: 20,
  },
  weekViewContainer: {
    marginTop: 15,
  },
  weekDayRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 15,
  },
  weekDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weekDayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  weekDayName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 40,
  },
  weekDateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDateCircleToday: {
    backgroundColor: ACCENT_COLOR,
  },
  weekDateNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  weekDateNumberToday: {
    color: '#FFF',
  },
  weekEventCount: {
    fontSize: 12,
    color: '#999',
  },
  weekEventsContainer: {
    gap: 8,
  },
  weekEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2E3',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT_COLOR,
  },
  weekEventTime: {
    marginRight: 10,
  },
  weekEventTimeText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  weekEventTitle: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  noEventsText: {
    fontSize: 12,
    color: '#CCC',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },

  loadingContainer: { 
    marginTop: 20,
    backgroundColor: '#FFF', 
    borderRadius: 25, 
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },

  eventList: { marginTop: 10, marginBottom: 80 },
  eventItem: { 
    backgroundColor: '#FFF', 
    borderRadius: 25, 
    paddingHorizontal: 15,
    height: 45,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  eventTitle: { color: ACCENT_COLOR, fontSize: 13, fontWeight: '400', flex: 1 },
  eventTime: { color: '#999', fontSize: 12, marginLeft: 10 },

  fab: {
    position: 'absolute',
    bottom: 20,
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  eventDetailModal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  eventDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  eventDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    flex: 1,
    marginRight: 10,
  },
  eventDetailContent: {
    gap: 20,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  eventDetailInfo: {
    flex: 1,
  },
  eventDetailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  eventDetailValue: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  creatorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  closeEventButton: {
    marginTop: 24,
    backgroundColor: ACCENT_COLOR,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeEventButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FamilySchedule;
