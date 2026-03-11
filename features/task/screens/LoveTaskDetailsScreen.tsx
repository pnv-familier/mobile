import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { ChevronLeft, Bell, User, Menu, Users, ChevronRight } from "lucide-react-native";
import { useLogout } from "../../auth/hooks/useLogout";
import { useAuthStore } from "../../auth/store/auth.store";
import AppButton from "../../../components/AppButton";

const BACKGROUND_COLOR = "#FDF0D5";
const ACCENT_COLOR = "#D4A056";

export default function LoveTaskDetailsScreen({ navigation }: { navigation: any }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { logout } = useLogout();
  const { data: user } = useAuthStore();

  // ❌ Tắt header mặc định của React Navigation
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#333" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={styles.headerTitle}>Love Task Details</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity>
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

        {/* FROM - TO */}
        <View style={styles.fromToBox}>
          <View style={styles.user}>
            <Image source={{ uri: "https://i.pravatar.cc/100" }} style={styles.avatar} />
            <Text>From: Mom</Text>
          </View>

          <Text style={styles.heart}>💗</Text>

          <View style={styles.user}>
            <Image source={{ uri: "https://i.pravatar.cc/101" }} style={styles.avatar} />
            <Text>For: Me</Text>
          </View>
        </View>

        {/* TASK CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>Call your grandma</Text>

          <Text style={styles.description}>
            Grandma misses you very much, please call and check on her.
          </Text>

          <View style={styles.pending}>
            <Text style={{ color: "#fff" }}>Pending share</Text>
          </View>
        </View>

        {/* INFO */}
        <View style={styles.infoBox}>
          <Text style={{ color: "#c07a2d" }}>
            Share this task to the family space before completing it!
          </Text>
        </View>

        {/* SHARE BUTTON */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.shareText}>Share To Family Space</Text>
        </TouchableOpacity>

        {/* CREATE POST MODAL */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Create a post</Text>

              <View style={styles.postUser}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/102" }}
                  style={styles.avatar}
                />
                <Text>Big Brother</Text>
              </View>

              <TextInput
                multiline
                style={styles.input}
                defaultValue="💞 I just completed a love task from Mom: Call Your Grandma"
              />

              <View style={styles.actions}>
                <TouchableOpacity>
                  <Text>📷 Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text>🎬 Video</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.postButton}>
                  <Text style={{ color: "#fff" }}>Post</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.close}
                onPress={() => setModalVisible(false)}
              >
                <Text>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* OPTIONS MODAL */}
        <Modal
          visible={showOptions}
          transparent
          animationType="slide"
          onRequestClose={() => setShowOptions(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
            <View style={styles.optionsModalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.optionSheet}>
                  <View style={styles.sheetHandle} />

                  <Text style={styles.sheetTitle}>Family Options</Text>

                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => setShowOptions(false)}
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

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#000",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  fromToBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },

  user: {
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },

  heart: {
    fontSize: 24,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 12,
    padding: 15,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d98b3a",
  },

  description: {
    marginTop: 10,
    color: "#666",
  },

  pending: {
    marginTop: 15,
    backgroundColor: "#f0b87f",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  infoBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff1df",
    borderRadius: 10,
  },

  shareButton: {
    marginTop: 15,
    backgroundColor: "#d79a5a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  shareText: {
    color: "#fff",
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  postUser: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    height: 80,
    marginBottom: 15,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  postButton: {
    backgroundColor: "#e7a96b",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },

  close: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  optionsModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  optionSheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    width: "100%",
    marginTop: "auto",
  },

  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#EEE",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },

  sheetTitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },

  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FDF2E3",
    borderRadius: 15,
    marginBottom: 15,
  },

  optionIconContainer: {
    padding: 8,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginRight: 15,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  cancelButton: {
    marginTop: 15,
    padding: 15,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#999",
    fontWeight: "600",
  },
});