import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Bonjour, comment puis-je vous aider ?', sender: 'doctor', time: '10:30' },
    { id: 2, text: "J'ai une question sur les signes vitaux de mon bébé", sender: 'user', time: '10:32' },
    { id: 3, text: 'Bien sûr, je suis là pour vous. Que voulez-vous savoir ?', sender: 'doctor', time: '10:33' },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: message,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Dr. Tabka Monther</Text>
          <Text style={styles.onlineStatus}>En ligne</Text>
        </View>
        <Ionicons name="videocam" size={24} color="#4a90e2" />
      </View>

      <ScrollView style={styles.chatContainer}>
        {messages.map((msg) => (
          <View key={msg.id} style={[
            styles.messageWrapper,
            msg.sender === 'user' ? styles.userMessageWrapper : styles.doctorMessageWrapper
          ]}>
            {msg.sender === 'doctor' && (
              <View style={styles.doctorAvatar}>
                <Ionicons name="medical" size={16} color="#4a90e2" />
              </View>
            )}
            <View style={[
              styles.message,
              msg.sender === 'user' ? styles.userMessage : styles.doctorMessage
            ]}>
              <Text style={msg.sender === 'user' ? styles.userMessageText : styles.doctorMessageText}>
                {msg.text}
              </Text>
              <Text style={styles.time}>{msg.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Pressable style={styles.attachButton}>
          <Ionicons name="attach" size={24} color="gray" />
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="Écrivez votre message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color={message.trim() ? "#4a90e2" : "gray"} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#2ecc71',
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  doctorMessageWrapper: {
    justifyContent: 'flex-start',
  },
  doctorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  message: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: '#4a90e2',
    alignSelf: 'flex-end',
  },
  doctorMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  userMessageText: {
    color: 'white',
    fontSize: 16,
  },
  doctorMessageText: {
    color: '#333',
    fontSize: 16,
  },
  time: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f3f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});