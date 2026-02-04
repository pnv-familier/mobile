import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Home, MessageSquare, Calendar, Lightbulb, Bell, User, Menu, ThumbsUp, MessageCircle, Image as ImageIcon, Video, Users, ChevronRight } from 'lucide-react-native';
import { useLogout } from '../../auth/hooks/useLogout';
import AppButton from '../../../components/AppButton';

const PRIMARY_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D4A056';

export default function FeedScreen({ navigation }: { navigation: any }) {
  const [showOptions, setShowOptions] = useState(false);
  const { logout } = useLogout();


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Home size={20} color="#8D5B39" />
          </View>
          <Text style={styles.headerTitle}>Social Media</Text>
        </View>
        <View style={styles.headerIcons}>
          <Bell size={24} color="#D4A056" style={styles.icon} />
          <TouchableOpacity onPress={() => setShowOptions(true)}>
            <User size={24} color="#D4A056" style={styles.icon} />
          </TouchableOpacity>
          <Menu size={24} color="#D4A056" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.familyCard}>
          <View style={styles.familyIconBox}>
            <Home size={28} color="#D4A056" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.familyTitle}>My family</Text>
            <Text style={styles.familySub}>5 members</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ViewListFamily')}
          >
            <Text style={styles.xemText}>Xem</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }}
              style={styles.avatarSmall}
            />
            <Text style={styles.placeholderText}>What's on your head?</Text>
          </View>
          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaBtn}>
              <ImageIcon size={20} color="#8D5B39" />
              <Text style={styles.mediaBtnText}>Image</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.mediaBtn}>
              <Video size={20} color="#8D5B39" />
              <Text style={styles.mediaBtnText}>Videos</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.avatarLarge}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.userName}>Big Brother</Text>
              <Text style={styles.postTime}>08:39 am</Text>
            </View>
          </View>
          <Text style={styles.postContent}>
            Let's Go On A Picnic This Weekend, Everyone! 🌳🧺 We Plan To Leave Early Sunday Morning.
          </Text>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.postImage}
          />
          <View style={styles.postFooter}>
            <View style={styles.interaction}>
              <ThumbsUp size={18} color="#666" />
              <Text style={styles.interactionText}>1,964</Text>
            </View>
            <View style={styles.interaction}>
              <MessageCircle size={18} color="#666" />
              <Text style={styles.interactionText}>135</Text>
            </View>
          </View>
        </View>

        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.avatarLarge}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.userName}>Big Brother</Text>
              <Text style={styles.postTime}>08:39 am</Text>
            </View>
          </View>
          <Text style={styles.postContent}>
            Let's Go On A Picnic This Weekend, Everyone! 🌳🧺 We Plan To Leave Early Sunday Morning.
          </Text>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.postImage}
          />
          <View style={styles.postFooter}>
            <View style={styles.interaction}>
              <ThumbsUp size={18} color="#666" />
              <Text style={styles.interactionText}>1,964</Text>
            </View>
            <View style={styles.interaction}>
              <MessageCircle size={18} color="#666" />
              <Text style={styles.interactionText}>135</Text>
            </View>
          </View>
        </View>

        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.avatarLarge}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.userName}>Big Brother</Text>
              <Text style={styles.postTime}>08:39 am</Text>
            </View>
          </View>
          <Text style={styles.postContent}>
            Let's Go On A Picnic This Weekend, Everyone! 🌳🧺 We Plan To Leave Early Sunday Morning.
          </Text>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.postImage}
          />
          <View style={styles.postFooter}>
            <View style={styles.interaction}>
              <ThumbsUp size={18} color="#666" />
              <Text style={styles.interactionText}>1,964</Text>
            </View>
            <View style={styles.interaction}>
              <MessageCircle size={18} color="#666" />
              <Text style={styles.interactionText}>135</Text>
            </View>
          </View>
        </View>
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
                  }}
                >
                  <View style={styles.optionIconContainer}>
                    <Users size={20} color={ACCENT_COLOR} />
                  </View>
                  <Text style={styles.optionText}>View Member List</Text>
                  <ChevronRight size={20} color="#CCC" />
                </TouchableOpacity>
                <AppButton title="Logout" onPress={logout} />

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#FFF',
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoBox: {
    padding: 5,
    backgroundColor: '#FDF2E3',
    borderRadius: 8
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333'
  },
  headerIcons: {
    flexDirection: 'row'
  },
  icon: {
    marginRight: 15
  },
  familyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    margin: 15,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  familyIconBox: {
    backgroundColor: '#FDF2E3',
    padding: 10,
    borderRadius: 10
  },
  familyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4A056'
  },
  familySub: {
    color: '#999',
    fontSize: 12
  },
  xemText: {
    color: '#D4A056',
    fontWeight: '500'
  },
  inputContainer: {
    marginHorizontal: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#D4A056',
    borderStyle: 'dashed',
    borderRadius: 15,
    backgroundColor: 'rgba(212, 160, 86, 0.05)',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  placeholderText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 16
  },
  mediaButtons: {
    flexDirection: 'row',
    backgroundColor: '#FFE8CC',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mediaBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mediaBtnText: {
    marginLeft: 8,
    color: '#8D5B39',
    fontWeight: '500'
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#D4A056'
  },
  postCard: {
    backgroundColor: '#FFF',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    marginBottom: 5
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  avatarLarge: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  postTime: {
    color: '#999',
    fontSize: 12
  },
  postContent: {
    color: '#444',
    marginBottom: 10,
    lineHeight: 20
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10
  },
  postFooter: {
    flexDirection: 'row'
  },
  interaction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  interactionText: {
    marginLeft: 5,
    color: '#666'
  },
  bottomTab: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  tabItem: {
    alignItems: 'center'
  },
  tabLabel: {
    fontSize: 12,
    color: '#D4A056',
    marginTop: 4
  },
  activeTabLabel: {
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  optionSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
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
  }
});