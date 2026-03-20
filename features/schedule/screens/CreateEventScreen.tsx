import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { scheduleService } from '../services/schedule.service';
import { getFamilyMembers } from '../../family/service/family.service';
import { useAuthStore } from '../../auth/store/auth.store';
import { showBanner } from '../../../utils/banner';

const BACKGROUND_COLOR = '#FDF2E2';
const ACCENT_COLOR = '#D4A017';

interface FamilyMember {
  userId: string;
  displayName: string;
  avatar: string | null;
  role: string;
  joinedAt: string;
}

interface CreateEventScreenProps {
  navigation: any;
}

const CreateEventScreen: React.FC<CreateEventScreenProps> = ({ navigation, route }) => {
  const prefill = route?.params;
  const currentUser = useAuthStore((state) => state.data);
  const [eventName, setEventName] = useState(prefill?.prefillTitle || '');
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(prefill?.prefillDate ? new Date(prefill.prefillDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showParticipantPicker, setShowParticipantPicker] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<FamilyMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [startTimeText, setStartTimeText] = useState(prefill?.prefillStartTime || '10:30');
  const [endTimeText, setEndTimeText] = useState(prefill?.prefillEndTime || '1:30');
  const [startAmPm, setStartAmPm] = useState('AM');
  const [endAmPm, setEndAmPm] = useState('PM');
  const [showInvalidCharWarning, setShowInvalidCharWarning] = useState(false);

  const [tempDate, setTempDate] = useState({ day: 1, month: 1, year: 2024 });

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await getFamilyMembers();
      console.log('Family members response:', response);
      
      let members = [];
      if (response?.members && Array.isArray(response.members)) {
        members = response.members;
      } else if (Array.isArray(response)) {
        members = response;
      }
      
      const filteredMembers = members.filter((member: any) => member.userId !== currentUser?.id);
      setFamilyMembers(filteredMembers);
    } catch (error: any) {
      console.error('Failed to load family members:', error);
      console.error('Error details:', error?.response?.data || error?.message);
      Alert.alert('Error', 'Failed to load family members. Please try again.');
    } finally {
      setLoadingMembers(false);
    }
  };

  const toggleParticipant = (member: FamilyMember) => {
    const exists = selectedParticipants.find(p => p.userId === member.userId);
    if (exists) {
      setSelectedParticipants(selectedParticipants.filter(p => p.userId !== member.userId));
    } else {
      setSelectedParticipants([...selectedParticipants, member]);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const openDatePicker = () => {
    const current = selectedDate;
    setTempDate({
      day: current.getDate(),
      month: current.getMonth() + 1,
      year: current.getFullYear()
    });
    setShowDatePicker(true);
  };

  const confirmDatePicker = () => {
    const newDate = new Date(tempDate.year, tempDate.month - 1, tempDate.day);
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const parseTimeInput = (timeText: string, ampm: string) => {
    const [hours, minutes] = timeText.split(':').map(s => parseInt(s.trim()) || 0);
    let hour24 = hours;
    
    if (ampm === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (ampm === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    const date = new Date();
    date.setHours(hour24, minutes, 0, 0);
    return date;
  };

  const validateForm = () => {
    if (!eventName.trim()) {
      Alert.alert('Validation Error', 'Event Title is required');
      return false;
    }

    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])$/;
    
    const trimmedStartTime = startTimeText.trim();
    const trimmedEndTime = endTimeText.trim();
    
    if (!timeRegex.test(trimmedStartTime)) {
      Alert.alert('Validation Error', `Start Time format is invalid. Please use format like 10:30\nYou entered: "${trimmedStartTime}"`);
      return false;
    }

    if (!timeRegex.test(trimmedEndTime)) {
      Alert.alert('Validation Error', `End Time format is invalid. Please use format like 1:30\nYou entered: "${trimmedEndTime}"`);
      return false;
    }

    const [startHours, startMinutes] = trimmedStartTime.split(':').map(s => parseInt(s.trim()));
    const [endHours, endMinutes] = trimmedEndTime.split(':').map(s => parseInt(s.trim()));
    
    let startHour24 = startHours;
    if (startAmPm === 'PM' && startHours !== 12) {
      startHour24 = startHours + 12;
    } else if (startAmPm === 'AM' && startHours === 12) {
      startHour24 = 0;
    }
    
    let endHour24 = endHours;
    if (endAmPm === 'PM' && endHours !== 12) {
      endHour24 = endHours + 12;
    } else if (endAmPm === 'AM' && endHours === 12) {
      endHour24 = 0;
    }
    
    const startTotalMinutes = startHour24 * 60 + startMinutes;
    const endTotalMinutes = endHour24 * 60 + endMinutes;

    if (endTotalMinutes <= startTotalMinutes) {
      Alert.alert('Validation Error', `End Time must be later than Start Time\nStart: ${trimmedStartTime} ${startAmPm} (${startHour24}:${startMinutes})\nEnd: ${trimmedEndTime} ${endAmPm} (${endHour24}:${endMinutes})`);
      return false;
    }

    return true;
  };

  const combineDateTime = (date: Date, timeText: string, ampm: string) => {
    const [hours, minutes] = timeText.split(':').map(s => parseInt(s.trim()) || 0);
    let hour24 = hours;
    
    if (ampm === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (ampm === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    const combined = new Date(date);
    combined.setHours(hour24, minutes, 0, 0);
    
    // Send as local datetime string to avoid UTC offset issues
    const yyyy = combined.getFullYear();
    const MM = String(combined.getMonth() + 1).padStart(2, '0');
    const dd = String(combined.getDate()).padStart(2, '0');
    const hh = String(combined.getHours()).padStart(2, '0');
    const mm = String(combined.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:00`;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const eventData = {
        title: eventName.trim(),
        description: note.trim(),
        startTime: combineDateTime(selectedDate, startTimeText, startAmPm),
        endTime: combineDateTime(selectedDate, endTimeText, endAmPm),
        participantIds: selectedParticipants.map(p => p.userId)
      };

      await scheduleService.createEvent(eventData);
      showBanner('📅 Event Created!', `"${eventName}" has been added to the schedule`);

      // Call onSuccess callback if provided (from Suggestion)
      if (prefill?.onSuccess) {
        await prefill.onSuccess();
      }
      
      Alert.alert('Success', 'Event created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Cancel', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/icon.png')} style={{ width: 40, height: 40 }} />
            <Text style={styles.headerTitle}>Create Event</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Ionicons name="notifications" size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="person" size={24} color={ACCENT_COLOR} style={{ marginHorizontal: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Event name*"
          value={eventName}
          onChangeText={(text) => {
            const hasInvalidChars = /[0-9@#$%^&*()_+=\[\]{}|<>?/\\"';:,~`!]/.test(text);
            if (hasInvalidChars) {
              setShowInvalidCharWarning(true);
              setTimeout(() => setShowInvalidCharWarning(false), 2000);
            }
            const filtered = text.replace(/[0-9@#$%^&*()_+=\[\]{}|<>?/\\"';:,~`!]/g, '');
            setEventName(filtered);
          }}
          editable={!loading}
        />
        {showInvalidCharWarning && (
          <Text style={styles.warningText}>Numbers and special characters are not allowed</Text>
        )}

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity 
          style={styles.inputWithIcon} 
          onPress={openDatePicker}
          disabled={loading}
        >
          <Text style={styles.inputText}>{formatDate(selectedDate)}</Text>
          <Ionicons name="calendar-outline" size={20} color={ACCENT_COLOR} />
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={styles.label}>Start time</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={styles.timeInput}
                placeholder="10:30"
                value={startTimeText}
                onChangeText={setStartTimeText}
                keyboardType="numbers-and-punctuation"
                editable={!loading}
              />
              <TouchableOpacity 
                style={styles.ampmButton}
                onPress={() => setStartAmPm(startAmPm === 'AM' ? 'PM' : 'AM')}
                disabled={loading}
              >
                <Text style={styles.ampmText}>{startAmPm}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.label}>End time</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={styles.timeInput}
                placeholder="1:30"
                value={endTimeText}
                onChangeText={setEndTimeText}
                keyboardType="numbers-and-punctuation"
                editable={!loading}
              />
              <TouchableOpacity 
                style={styles.ampmButton}
                onPress={() => setEndAmPm(endAmPm === 'AM' ? 'PM' : 'AM')}
                disabled={loading}
              >
                <Text style={styles.ampmText}>{endAmPm}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Note</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Type the note here..."
          multiline
          numberOfLines={3}
          value={note}
          onChangeText={setNote}
          editable={!loading}
        />

        <Text style={styles.label}>Participants</Text>
        <TouchableOpacity 
          style={styles.dropdown} 
          onPress={() => setShowParticipantPicker(true)}
          disabled={loading || loadingMembers}
        >
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="people" size={16} color="#999" />
          </View>
          <Text style={{ color: '#888', flex: 1, marginLeft: 10 }}>
            {selectedParticipants.length > 0 
              ? `${selectedParticipants.length} selected` 
              : 'Add Recipient'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>

        {selectedParticipants.length > 0 && (
          <View style={styles.participantList}>
            {selectedParticipants.map((participant) => (
              <View key={participant.userId} style={styles.participantItem}>
                {participant.avatar ? (
                  <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
                ) : (
                  <View style={styles.participantAvatar}>
                    <Ionicons name="person" size={20} color="#999" />
                  </View>
                )}
                <Text style={styles.participantText} numberOfLines={1}>{participant.displayName}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelBtn]} 
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.saveBtn, loading && styles.buttonDisabled]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showParticipantPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowParticipantPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.participantModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Participants</Text>
              <TouchableOpacity onPress={() => setShowParticipantPicker(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {loadingMembers ? (
              <ActivityIndicator size="large" color={ACCENT_COLOR} style={{ marginVertical: 20 }} />
            ) : familyMembers.length > 0 ? (
              <ScrollView style={styles.memberList}>
                {familyMembers.map((member) => {
                  const isSelected = selectedParticipants.find(p => p.userId === member.userId);
                  return (
                    <TouchableOpacity
                      key={member.userId}
                      style={styles.memberItem}
                      onPress={() => toggleParticipant(member)}
                    >
                      {member.avatar ? (
                        <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                      ) : (
                        <View style={styles.memberAvatar}>
                          <Ionicons name="person" size={24} color="#999" />
                        </View>
                      )}
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{member.displayName}</Text>
                        <Text style={styles.memberRelation}>{member.role}</Text>
                      </View>
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>No family members found</Text>
            )}
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => setShowParticipantPicker(false)}
            >
              <Text style={styles.confirmButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Select Date</Text>
            <View style={styles.pickerContainer}>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {days.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.pickerItem, tempDate.day === day && styles.pickerItemSelected]}
                    onPress={() => setTempDate({ ...tempDate, day })}
                  >
                    <Text style={[styles.pickerItemText, tempDate.day === day && styles.pickerItemTextSelected]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {months.map((month, idx) => (
                  <TouchableOpacity
                    key={month}
                    style={[styles.pickerItem, tempDate.month === idx + 1 && styles.pickerItemSelected]}
                    onPress={() => setTempDate({ ...tempDate, month: idx + 1 })}
                  >
                    <Text style={[styles.pickerItemText, tempDate.month === idx + 1 && styles.pickerItemTextSelected]}>{month}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {years.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.pickerItem, tempDate.year === year && styles.pickerItemSelected]}
                    onPress={() => setTempDate({ ...tempDate, year })}
                  >
                    <Text style={[styles.pickerItemText, tempDate.year === year && styles.pickerItemTextSelected]}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.pickerButtons}>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.pickerButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.pickerButton, styles.pickerButtonConfirm]} onPress={confirmDatePicker}>
                <Text style={[styles.pickerButtonText, styles.pickerButtonTextConfirm]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 40, 
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#000' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 30 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: ACCENT_COLOR,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    fontSize: 15,
  },
  inputWithIcon: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: { fontSize: 15, color: '#333' },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    fontSize: 15,
  },
  ampmButton: {
    backgroundColor: '#D99B5F',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  ampmText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  avatarPlaceholder: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantList: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  participantItem: {
    alignItems: 'center',
    width: 60,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantText: { 
    fontSize: 11, 
    marginTop: 4, 
    color: '#333',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelBtn: { backgroundColor: '#D99B5F' },
  saveBtn: { backgroundColor: '#D99B5F' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  participantModal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
  },
  memberList: {
    maxHeight: 300,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  memberRelation: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: ACCENT_COLOR,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 30,
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    width: '85%',
    maxHeight: '50%',
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    textAlign: 'center',
    marginBottom: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 180,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerItem: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: ACCENT_COLOR,
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  pickerItemTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  pickerButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  pickerButtonConfirm: {
    backgroundColor: ACCENT_COLOR,
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  pickerButtonTextConfirm: {
    color: '#FFF',
  },
  warningText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CreateEventScreen;
