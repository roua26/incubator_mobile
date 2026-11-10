import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Alerts() {
  const alerts = [
    { 
      id: 1, 
      type: 'critical', 
      title: 'Température élevée', 
      description: 'La température de l\'incubateur est à 38.5°C',
      time: 'Il y a 2 minutes',
      icon: 'warning'
    },
    { 
      id: 2, 
      type: 'warning', 
      title: 'Fréquence cardiaque', 
      description: 'Fréquence cardiaque élevée : 168 bpm',
      time: 'Il y a 15 minutes',
      icon: 'heart'
    },
    { 
      id: 3, 
      type: 'critical', 
      title: 'Oxygénation', 
      description: 'Taux d\'oxygène bas : 88%',
      time: 'Il y a 25 minutes',
      icon: 'alert'
    },
    { 
      id: 4, 
      type: 'info', 
      title: 'Nourrissage', 
      description: 'Prochain nourrissage dans 30 minutes',
      time: 'Il y a 45 minutes',
      icon: 'information'
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        </Pressable>
        <Text style={styles.title}>Alertes Critiques</Text>
        <Pressable style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color="gray" />
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>3</Text>
          <Text style={styles.summaryLabel}>Alertes critiques</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>5</Text>
          <Text style={styles.summaryLabel}>En attente</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>12</Text>
          <Text style={styles.summaryLabel}>Aujourd'hui</Text>
        </View>
      </View>

      <ScrollView style={styles.alertsList}>
        {alerts.map((alert) => (
          <View key={alert.id} style={[
            styles.alertCard,
            alert.type === 'critical' && styles.criticalAlert,
            alert.type === 'warning' && styles.warningAlert,
            alert.type === 'info' && styles.infoAlert,
          ]}>
            <View style={styles.alertIcon}>
              <Ionicons 
                name={alert.icon === 'warning' ? 'warning' : 
                      alert.icon === 'heart' ? 'heart' : 
                      alert.icon === 'alert' ? 'alert-circle' : 'information-circle'} 
                size={28} 
                color={alert.type === 'critical' ? '#ff6b6b' : 
                       alert.type === 'warning' ? '#ffa502' : '#4a90e2'} 
              />
            </View>
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              <Text style={styles.alertDescription}>{alert.description}</Text>
              <View style={styles.alertActions}>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
                  <Text style={styles.actionText}>Traiter</Text>
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="chatbubble" size={20} color="#4a90e2" />
                  <Text style={styles.actionText}>Contacter</Text>
                </Pressable>
              </View>
            </View>
          </View>
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
  settingsButton: {
    padding: 5,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  summaryDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e9ecef',
  },
  alertsList: {
    flex: 1,
    padding: 15,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  criticalAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffa502',
  },
  infoAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  alertIcon: {
    width: 50,
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
    marginLeft: 10,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  alertTime: {
    fontSize: 12,
    color: 'gray',
  },
  alertDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  alertActions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
});