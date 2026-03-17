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
  Alert,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { ChevronLeft, Bell, User, Menu, Send, Users, ChevronRight } from 'lucide-react-native';
import { useCreateLoveTask } from '../hooks/useCreateLoveTask';
import { useFamilyMembers } from '../../family/hooks/useFamilyMembers';
import { FamilyMember } from '../../family/types';
import { useLogout } from '../../auth/hooks/useLogout';
import AppButton from '../../../components/AppButton';
import { useAuthStore } from '../../auth/store/auth.store';

const BACKGROUND_COLOR = '#FFF4E6';
const ACCENT_COLOR = '#EAB676';
const TEXT_COLOR = '#4A3428';

interface CreateLoveTaskScreenProps {
  navigation: any;
  route: any;
}

const CreateLoveTaskScreen: React.FC<CreateLoveTaskScreenProps> = ({ navigation, route }) => {
  const prefill = route?.params;
  const [title, setTitle] = useState(prefill?.prefillTitle || '');
  const [description, setDescription] = useState(prefill?.prefillDescription || '');
  const [loveMessage, setLoveMessage] = useState('');
  const [assignedToUserId, setAssignedToUserId] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { createTask, loading } = useCreateLoveTask();
  const { members: allMembers, loading: loadingMembers } = useFamilyMembers();
  const user = useAuthStore((state) => state.data);
  const members = allMembers.filter((m: FamilyMember) => m.userId !== user?.id);
  const { logout } = useLogout();

  const selectedMember = members.find((m: FamilyMember) => m.userId === assignedToUserId);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!assignedToUserId.trim()) {
      Alert.alert('Error', 'Please select who to send this task to');
      return;
    }

    try {
      await createTask(title.trim(), description.trim(), assignedToUserId.trim(), loveMessage.trim() || undefined);

      // Call onSuccess callback if provided (from Suggestion)
      if (prefill?.onSuccess) {
        await prefill.onSuccess();
      }

      Alert.alert('Success', 'Love task sent successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create love task');
    }
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
            <Text style={styles.headerTitle}>Create Love Task</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Bell size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOptions(true)}>
            <User size={24} color={ACCENT_COLOR} style={styles.headerIconGap} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Menu size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Send to ?</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowUserList(!showUserList)}
            disabled={loadingMembers}
          >
            {loadingMembers ? (
              <ActivityIndicator size="small" color={ACCENT_COLOR} />
            ) : selectedMember ? (
              <>
                {selectedMember.avatar ? (
                  <Image source={{ uri: selectedMember.avatar }} style={styles.avatarSmall} />
                ) : (
                  <View style={styles.avatarPlaceholder} />
                )}
                <Text style={styles.dropdownTextSelected}>{selectedMember.displayName}</Text>
              </>
            ) : (
              <>
                <View style={styles.avatarPlaceholder} />
                <Text style={styles.dropdownText}>Select recipient</Text>
              </>
            )}
            <ChevronLeft style={styles.chevronDown} size={20} color="#CCC" />
          </TouchableOpacity>

          {showUserList && members.length > 0 && (
            <View style={styles.userList}>
              {members.map((member: FamilyMember) => (
                <TouchableOpacity
                  key={member.userId}
                  style={styles.userItem}
                  onPress={() => {
                    setAssignedToUserId(member.userId);
                    setShowUserList(false);
                  }}
                >
                  {member.avatar ? (
                    <Image source={{ uri: member.avatar }} style={styles.avatarList} />
                  ) : (
                    <View style={styles.avatarListPlaceholder}>
                      <User size={20} color="#999" />
                    </View>
                  )}
                  <View>
                    <Text style={styles.userName}>{member.displayName}</Text>
                    <Text style={styles.userRole}>{member.role}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.labelOutside}>Task Name</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., Take morning vitamin"
          placeholderTextColor="#AAA"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.labelOutside}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Details about what need to be done..."
          placeholderTextColor="#AAA"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.labelOutside}>Love Message (revealed on completion)</Text>
        <TextInput
          style={styles.input}
          placeholder="A loving message that will appear when task is completed"
          placeholderTextColor="#AAA"
          value={loveMessage}
          onChangeText={setLoveMessage}
        />

        <TouchableOpacity
          style={[styles.btnSend, loading && styles.btnSendDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Send size={24} color="white" />
              <Text style={styles.btnText}>Send Love Task</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

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
  container: { padding: 15, paddingBottom: 40 },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFDAB9',
    marginBottom: 20,
  },
  label: { fontWeight: 'bold', marginBottom: 10, color: TEXT_COLOR },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  dropdownText: { flex: 1, marginLeft: 10, color: '#AAA' },
  dropdownTextSelected: { flex: 1, marginLeft: 10, color: TEXT_COLOR, fontWeight: '500' },
  chevronDown: { transform: [{ rotate: '-90deg' }] },
  avatarSmall: { width: 30, height: 30, borderRadius: 15 },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
  },
  userList: {
    marginTop: 15,
    alignSelf: 'flex-end',
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarList: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  avatarListPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: { fontWeight: 'bold', fontSize: 16, color: TEXT_COLOR },
  userRole: { fontSize: 12, color: '#888' },
  labelOutside: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: TEXT_COLOR,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFDAB9',
    fontSize: 15,
    color: TEXT_COLOR,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  btnSend: {
    backgroundColor: ACCENT_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginTop: 25,
  },
  btnSendDisabled: { opacity: 0.6 },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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

export default CreateLoveTaskScreen;

