import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useInviteMembers } from '../hooks/useInviteMembers';

export default function InviteMembersScreen({ route }: any) {
  const { inviteCode } = route.params || { inviteCode: 'FAM-XXXX-0000' };
  const { onShare, onShowCode, handleFinish, goBack } = useInviteMembers(inviteCode);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back" size={28} color="#D48141" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite members</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.mainTitle}>Invite your family to join</Text>
        <Text style={styles.subtitle}>
          Share the code or link to invite{'\n'}members
        </Text>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your family code</Text>
          <Text style={styles.codeText}>{inviteCode}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.copyBtn} onPress={onShowCode}>
              <Feather name="eye" size={18} color="#D48141" />
              <Text style={styles.copyBtnText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
              <Ionicons name="share-social-outline" size={18} color="white" />
              <Text style={styles.shareBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <TouchableOpacity style={styles.mainBtn} onPress={handleFinish}>
            <Text style={styles.mainBtnText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipBtn} onPress={handleFinish}>
            <Text style={styles.skipText}>
              Skip this, we'll continue later
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#D48141',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
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
    fontSize: 14,
    textAlign: 'center',
    color: '#D48141',
    fontWeight: '600',
    marginBottom: 25,
  },
  codeCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 4,
  },
  codeLabel: {
    color: '#D48141',
    fontSize: 16,
    marginBottom: 10,
  },
  codeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D48141',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1DD',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.47,
  },
  copyBtnText: {
    color: '#D48141',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D48141',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.47,
  },
  shareBtnText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomArea: {
    width: '100%',
    marginTop: 30,
    marginBottom: 40,
  },
  mainBtn: {
    backgroundColor: '#D48141',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  mainBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipBtn: {
    alignItems: 'center',
  },
  skipText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
});
