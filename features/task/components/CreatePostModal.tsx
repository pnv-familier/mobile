import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image
} from "react-native";

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPost: (content: string) => void;
  defaultContent: string;
  userName: string;
  userAvatar: string;
}

export default function CreatePostModal({
  visible,
  onClose,
  onPost,
  defaultContent,
  userName,
  userAvatar
}: CreatePostModalProps) {
  const [content, setContent] = useState(defaultContent);

  const handlePost = () => {
    onPost(content);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create a post</Text>

          <View style={styles.postUser}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
            <Text>{userName}</Text>
          </View>

          <TextInput
            multiline
            style={styles.input}
            value={content}
            onChangeText={setContent}
          />

          <View style={styles.actions}>
            <TouchableOpacity>
              <Text>📷 Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text>🎬 Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={{ color: "#fff" }}>Post</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },

  postUser: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    height: 80,
    marginBottom: 15
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  postButton: {
    backgroundColor: "#e7a96b",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8
  },

  close: {
    position: "absolute",
    right: 10,
    top: 10
  }
});
