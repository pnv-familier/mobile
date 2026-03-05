import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'

type Props = {
  onSend: (text: string) => void
}

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim()) return

    onSend(text)
    setText('')
  }

  return (
    <View style={styles.container}>
      <Ionicons name="mic-outline" size={24} />

      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.input}
        placeholder="Message..."
      />

      <TouchableOpacity onPress={handleSend}>
        <Ionicons name="send-outline" size={24} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    borderColor: '#ddd',
  },
})
