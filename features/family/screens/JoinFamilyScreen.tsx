import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useJoinFamily } from '../hooks/useJoinFamily';


export default function JoinFamilyScreen({ navigation }: any) {
  const {
    inviteCode,
    setInviteCode,
    loading,
    handleJoin,
  } = useJoinFamily();


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
           
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color="#D48141"
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                Join the family
              </Text>
              <View style={styles.headerPlaceholder} />
            </View>


            <View style={styles.content}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../../assets/icon.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>


              <Text style={styles.mainTitle}>
                Enter the family code
              </Text>
              <Text style={styles.subtitle}>
                Enter the invitation code to join
              </Text>


              <View style={styles.inputContainer}>
                <Ionicons
                  name="link-outline"
                  size={24}
                  color="#D48141"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter the code (e.g., FAM-XXX)"
                  placeholderTextColor="#E0C3A5"
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.joinButton,
                  loading && styles.joinButtonDisabled
                ]}
                onPress={handleJoin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.joinButtonText}>
                    Join
                  </Text>
                )}
              </TouchableOpacity>
            </View>


          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  flexOne: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    paddingLeft: 10,
    paddingTop: 30,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#D48141',
  },
  headerPlaceholder: {
    width: 28,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 70,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 200,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D48141',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#D48141',
    fontWeight: '600',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 80,
    width: '100%',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#D48141',
  },
  joinButton: {
    backgroundColor: '#D48141',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

