import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Notifications() {
  const notifications = [
    { id: 1, title: 'Nourrissage', message: 'C\'est l\'heure du nourrissage', time: 'Il y a 5 min', read: false },
    { id: 2, title: 'Médecin', message: 'Dr. Martin a répondu à votre message', time: 'Il y a 30 min', read: false },
    { id: 3, title: 'Signes vitaux', message: 'Les signes vitaux sont stables', time: 'Il y a 1h', read: true },
    { id: 4, title: 'Rendez-vous', message: 'Rendez-vous confirmé pour demain', time: 'Il y a 2h', read: true },
  ];
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <Pressable style={styles.markAllButton}>
          <Text style={styles.markAllText}>Tout marquer</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.notificationsList}>
        {notifications.map((notif) => (
          <Pressable key={notif.id} style={[styles.notificationCard, !notif.read && styles.unreadCard]}>
            <View style={[styles.notificationIcon, !notif.read && styles.unreadIcon]}>
              <Ionicons name="notifications" size={20} color={notif.read ? 'gray' : '#4a90e2'} />
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={[styles.notificationTitle, !notif.read && styles.unreadTitle]}>{notif.title}</Text>
                <Text style={styles.notificationTime}>{notif.time}</Text>
              </View>
              <Text style={styles.notificationMessage}>{notif.message}</Text>
            </View>
            {!notif.read && <View style={styles.unreadDot} />}
          </Pressable>
        ))}
      </ScrollView>
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
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllButton: {
    padding: 5,
  },
  markAllText: {
    color: '#4a90e2',
    fontSize: 14,
  },
  notificationsList: {
    flex: 1,
    padding: 15,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  unreadCard: {
    backgroundColor: '#f0f7ff',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadIcon: {
    backgroundColor: '#e3f2fd',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  notificationTime: {
    fontSize: 12,
    color: 'gray',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4a90e2',
    marginLeft: 8,
  },
});