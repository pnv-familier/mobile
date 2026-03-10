import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image,
  Alert
} from 'react-native';
import { ChevronLeft, Bell, User, Menu, Send, ChevronDown, Heart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useFamilyMembers } from '../hooks/useFamilyMembers';

const CreateLoveTaskScreen = () => {
  const navigation = useNavigation();
  const { members, loading } = useFamilyMembers();

  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [loveMessage, setLoveMessage] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMemberSelection = (id: number) => {
    setSelectedMembers(prev => 
      prev.includes(id) 
        ? prev.filter(memberId => memberId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }
    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please select at least one family member');
      return;
    }
    // Here you would typically call an API to create the love task
    // For now, just show a success message
    Alert.alert('Success', 'Love task created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const selectedMemberAvatars = members.filter(member => selectedMembers.includes(member.id)).slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="#5D4037" size={28} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <View style={styles.logoBox}>
             <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/616/616490.png' }} 
                style={styles.logoIcon} 
             />
          </View>
          <Text style={styles.headerTitle}>Create Love Task</Text>
        </View>

        <View style={styles.headerIcons}>
          <Bell color="#D69E66" size={24} fill="#D69E66" style={styles.iconGap} />
          <User color="#D69E66" size={24} fill="#D69E66" style={styles.iconGap} />
          <Menu color="#D69E66" size={24} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Send to Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Send to ?</Text>
          <TouchableOpacity 
            style={styles.dropdownSelector}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <View style={styles.avatarGroup}>
              {selectedMemberAvatars.map((member, index) => (
                <Image 
                  key={member.id}
                  source={{ uri: member.avatar || 'https://i.pravatar.cc/100?img=5' }} 
                  style={[styles.miniAvatar, index > 0 && { marginLeft: -10 }]} 
                />
              ))}
              <Text style={styles.placeholderText}>
                {selectedMembers.length === 0 ? 'Send to' : `${selectedMembers.length} selected`}
              </Text>
            </View>
            <ChevronDown color="#CCC" size={20} />
          </TouchableOpacity>

          {/* Member List Dropdown */}
          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              {members.map((member) => (
                <TouchableOpacity 
                  key={member.id} 
                  style={styles.memberItem}
                  onPress={() => toggleMemberSelection(member.id)}
                >
                  <Image source={{ uri: member.avatar || 'https://i.pravatar.cc/100?img=5' }} style={styles.memberAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  {selectedMembers.includes(member.id) && (
                    <View style={styles.checkmark}>
                      <Text style={{ color: '#D69E66', fontSize: 16 }}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Name</Text>
          <TextInput 
            style={styles.input}
            placeholder="E.g., Take morning vitamin"
            placeholderTextColor="#CCC"
            value={taskName}
            onChangeText={setTaskName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="Details about what need to be done..."
            placeholderTextColor="#CCC"
            multiline={true}
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Love Message <Text style={styles.subLabel}>(revealed on completion)</Text>
          </Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="A loving message that will appear when task is completed"
            placeholderTextColor="#CCC"
            multiline={true}
            value={loveMessage}
            onChangeText={setLoveMessage}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Send color="white" size={24} style={styles.sendIcon} />
          <Text style={styles.submitText}>Send Love Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF2E3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    backgroundColor: '#FFF',
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D69E66',
  },
  logoIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconGap: {
    marginRight: 10,
  },
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D69E66',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#EEE',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  placeholderText: {
    color: '#AAA',
    marginLeft: 10,
  },
  dropdownList: {
    marginTop: 15,
    alignSelf: 'flex-end',
    width: '80%',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 15,
    backgroundColor: '#FFF',
    elevation: 3, // Bóng đổ Android
    shadowColor: '#000', // Bóng đổ iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  memberRole: {
    fontSize: 12,
    color: '#999',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D69E66',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D69E66',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#E5B57A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  sendIcon: {
    transform: [{ rotate: '-20deg' }],
    marginRight: 10,
  },
  submitText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#D69E66',
    marginTop: 20,
  },

  footerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerText: {
    color: '#D69E66',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CreateLoveTaskScreen;