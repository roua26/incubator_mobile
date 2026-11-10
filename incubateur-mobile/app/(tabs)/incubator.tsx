import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

export default function Incubator() {
  // ÉTATS DES CAPTEURS (données simulées en temps réel)
  const [temperature, setTemperature] = useState(36.8);
  const [humidity, setHumidity] = useState(65);
  const [light, setLight] = useState(45);
  const [noise, setNoise] = useState(32);
  
  // ÉTATS DES ACTIONNEURS (contrôlables par l'utilisateur)
  const [fanActive, setFanActive] = useState(true);
  const [heaterActive, setHeaterActive] = useState(true);
  const [coverOpen, setCoverOpen] = useState(false);
  
  // ÉTATS DES RÉGLAGES (valeurs cibles)
  const [targetTemp, setTargetTemp] = useState(37.0);
  const [targetHumidity, setTargetHumidity] = useState(65);

  // Simulation de variations en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(prev => Math.max(36.2, Math.min(37.5, prev + (Math.random() - 0.5) * 0.2)));
      setHumidity(prev => Math.max(55, Math.min(75, prev + (Math.random() - 0.5) * 2)));
      setLight(prev => Math.max(30, Math.min(60, prev + (Math.random() - 0.5) * 3)));
      setNoise(prev => Math.max(25, Math.min(45, prev + (Math.random() - 0.5) * 4)));
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // FONCTIONS POUR MODIFIER LES PARAMÈTRES
  const toggleFan = () => setFanActive(!fanActive);
  const toggleHeater = () => setHeaterActive(!heaterActive);
  const toggleCover = () => setCoverOpen(!coverOpen);
  
  // Contrôle température cible (+/-)
  const increaseTemp = () => setTargetTemp(prev => Math.min(38, prev + 0.1));
  const decreaseTemp = () => setTargetTemp(prev => Math.max(34, prev - 0.1));
  
  // Contrôle humidité cible (+/-)
  const increaseHumidity = () => setTargetHumidity(prev => Math.min(80, prev + 1));
  const decreaseHumidity = () => setTargetHumidity(prev => Math.max(50, prev - 1));

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        </Pressable>
        <Text style={styles.headerTitle}>Incubateur</Text>
        <View style={styles.headerStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>En ligne</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* SECTION 1 - CAPTEURS EN TEMPS RÉEL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Données en temps réel</Text>
          
          {/* GRILLE DES 4 CAPTEURS */}
          <View style={styles.sensorGrid}>
            
            {/* TEMPÉRATURE */}
            <View style={[styles.sensorCard, styles.tempCard]}>
              <Ionicons name="thermometer" size={32} color="#ff6b6b" />
              <Text style={styles.sensorValue}>{temperature.toFixed(1)}°C</Text>
              <Text style={styles.sensorLabel}>Température</Text>
              <View style={[styles.statusBadge, temperature > 37.2 ? styles.warningBadge : styles.normalBadge]}>
                <Text style={styles.statusBadgeText}>
                  {temperature > 37.2 ? 'Élevée' : temperature < 36.5 ? 'Basse' : 'Normale'}
                </Text>
              </View>
            </View>
            
            {/* HUMIDITÉ */}
            <View style={[styles.sensorCard, styles.humidityCard]}>
              <Ionicons name="water" size={32} color="#4a90e2" />
              <Text style={styles.sensorValue}>{humidity}%</Text>
              <Text style={styles.sensorLabel}>Humidité</Text>
              <View style={[styles.statusBadge, humidity > 70 ? styles.warningBadge : styles.normalBadge]}>
                <Text style={styles.statusBadgeText}>
                  {humidity > 70 ? 'Élevée' : humidity < 60 ? 'Basse' : 'Normale'}
                </Text>
              </View>
            </View>
            
            {/* LUMIÈRE */}
            <View style={[styles.sensorCard, styles.lightCard]}>
              <Ionicons name="sunny" size={32} color="#f39c12" />
              <Text style={styles.sensorValue}>{light}%</Text>
              <Text style={styles.sensorLabel}>Lumière</Text>
              <View style={styles.normalBadge}>
                <Text style={styles.statusBadgeText}>Auto</Text>
              </View>
            </View>
            
            {/* BRUIT */}
            <View style={[styles.sensorCard, styles.noiseCard]}>
              <Ionicons name="volume-high" size={32} color="#9b59b6" />
              <Text style={styles.sensorValue}>{noise} dB</Text>
              <Text style={styles.sensorLabel}>Bruit</Text>
              <View style={[styles.statusBadge, noise > 40 ? styles.warningBadge : styles.normalBadge]}>
                <Text style={styles.statusBadgeText}>
                  {noise > 40 ? 'Élevé' : 'Normal'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION 2 - ACTIONNEURS (SWITCHES) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎛️ Contrôles</Text>
          
          {/* VENTILATEUR */}
          <View style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View style={[styles.controlIcon, fanActive && styles.controlIconActive]}>
                <Ionicons name="sync" size={24} color={fanActive ? "#4a90e2" : "gray"} />
              </View>
              <View style={styles.controlInfo}>
                <Text style={styles.controlTitle}>Ventilateur</Text>
                <Text style={styles.controlStatus}>
                  {fanActive ? 'Actif' : 'Inactif'} • 1200 tr/min
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#d3d3d3", true: "#4a90e2" }}
                thumbColor={fanActive ? "#fff" : "#f4f3f4"}
                onValueChange={toggleFan}
                value={fanActive}
              />
            </View>
          </View>
          
          {/* RÉSISTANCE CHAUFFANTE */}
          <View style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View style={[styles.controlIcon, heaterActive && styles.controlIconHeater]}>
                <Ionicons name="flame" size={24} color={heaterActive ? "#ff6b6b" : "gray"} />
              </View>
              <View style={styles.controlInfo}>
                <Text style={styles.controlTitle}>Résistance chauffante</Text>
                <Text style={styles.controlStatus}>
                  {heaterActive ? 'Active' : 'Inactive'} • 42°C
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#d3d3d3", true: "#ff6b6b" }}
                thumbColor={heaterActive ? "#fff" : "#f4f3f4"}
                onValueChange={toggleHeater}
                value={heaterActive}
              />
            </View>
          </View>
          
          {/* CACHE COUVEUSE */}
          <View style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <View style={[styles.controlIcon, coverOpen && styles.controlIconCover]}>
                <Ionicons name="bed" size={24} color={coverOpen ? "#2ecc71" : "gray"} />
              </View>
              <View style={styles.controlInfo}>
                <Text style={styles.controlTitle}>Cache couveuse</Text>
                <Text style={styles.controlStatus}>
                  {coverOpen ? 'Ouvert' : 'Fermé'}
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#d3d3d3", true: "#2ecc71" }}
                thumbColor={coverOpen ? "#fff" : "#f4f3f4"}
                onValueChange={toggleCover}
                value={coverOpen}
              />
            </View>
          </View>
        </View>

        {/* SECTION 3 - RÉGLAGES (SANS SLIDER, AVEC BOUTONS +/-) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Réglages</Text>
          
          {/* TEMPÉRATURE CIBLE */}
          <View style={styles.settingsCard}>
            <View style={styles.settingsHeader}>
              <Ionicons name="thermometer-outline" size={20} color="#4a90e2" />
              <Text style={styles.settingsTitle}>Température cible</Text>
              <Text style={styles.settingsValue}>{targetTemp.toFixed(1)}°C</Text>
            </View>
            
            <View style={styles.targetControl}>
              <Pressable onPress={decreaseTemp} style={styles.targetButton}>
                <Ionicons name="remove-circle" size={44} color="#4a90e2" />
              </Pressable>
              
              <View style={styles.targetValueContainer}>
                <Text style={styles.targetValue}>{targetTemp.toFixed(1)}°C</Text>
                <Text style={styles.targetRange}>34°C - 38°C</Text>
              </View>
              
              <Pressable onPress={increaseTemp} style={styles.targetButton}>
                <Ionicons name="add-circle" size={44} color="#4a90e2" />
              </Pressable>
            </View>
          </View>
          
          {/* HUMIDITÉ CIBLE */}
          <View style={styles.settingsCard}>
            <View style={styles.settingsHeader}>
              <Ionicons name="water-outline" size={20} color="#4a90e2" />
              <Text style={styles.settingsTitle}>Humidité cible</Text>
              <Text style={styles.settingsValue}>{targetHumidity}%</Text>
            </View>
            
            <View style={styles.targetControl}>
              <Pressable onPress={decreaseHumidity} style={styles.targetButton}>
                <Ionicons name="remove-circle" size={44} color="#4a90e2" />
              </Pressable>
              
              <View style={styles.targetValueContainer}>
                <Text style={styles.targetValue}>{targetHumidity}%</Text>
                <Text style={styles.targetRange}>50% - 80%</Text>
              </View>
              
              <Pressable onPress={increaseHumidity} style={styles.targetButton}>
                <Ionicons name="add-circle" size={44} color="#4a90e2" />
              </Pressable>
            </View>
          </View>
          
          {/* NOURRISSAGE */}
          <View style={styles.settingsCard}>
            <View style={styles.settingsHeader}>
              <Ionicons name="time-outline" size={20} color="#4a90e2" />
              <Text style={styles.settingsTitle}>Dernier nourrissage</Text>
              <Text style={styles.settingsValue}>15:30</Text>
            </View>
            <Pressable style={styles.feedButton}>
              <Ionicons name="restaurant" size={18} color="white" />
              <Text style={styles.feedButtonText}>Nourrissage manuel</Text>
            </Pressable>
          </View>
        </View>

        {/* SECTION 4 - HISTORIQUE RAPIDE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Historique</Text>
          <View style={styles.historyCard}>
            <View style={styles.historyItem}>
              <Text style={styles.historyTime}>15:30</Text>
              <Text style={styles.historyEvent}>Température: 36.8°C</Text>
              <Text style={styles.historyNormal}>Normal</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyTime}>15:00</Text>
              <Text style={styles.historyEvent}>Cache ouvert</Text>
              <Text style={styles.historyWarning}>Manuel</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyTime}>14:30</Text>
              <Text style={styles.historyEvent}>Humidité: 68%</Text>
              <Text style={styles.historyNormal}>Normal</Text>
            </View>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Voir tout l'historique</Text>
              <Ionicons name="arrow-forward" size={16} color="#4a90e2" />
            </Pressable>
          </View>
        </View>

        {/* BOUTON URGENCE */}
        <Pressable style={styles.emergencyButton}>
          <Ionicons name="alert-circle" size={20} color="white" />
          <Text style={styles.emergencyButtonText}>Alerter le personnel médical</Text>
        </Pressable>

        <View style={{ height: 30 }} />
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
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ecc71',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#4a90e2',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sensorCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tempCard: {
    borderTopWidth: 3,
    borderTopColor: '#ff6b6b',
  },
  humidityCard: {
    borderTopWidth: 3,
    borderTopColor: '#4a90e2',
  },
  lightCard: {
    borderTopWidth: 3,
    borderTopColor: '#f39c12',
  },
  noiseCard: {
    borderTopWidth: 3,
    borderTopColor: '#9b59b6',
  },
  sensorValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  sensorLabel: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  normalBadge: {
    backgroundColor: '#e3f2fd',
  },
  warningBadge: {
    backgroundColor: '#ffe5e5',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  controlCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIconActive: {
    backgroundColor: '#e3f2fd',
  },
  controlIconHeater: {
    backgroundColor: '#ffe5e5',
  },
  controlIconCover: {
    backgroundColor: '#e3f2fd',
  },
  controlInfo: {
    flex: 1,
    marginLeft: 12,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  controlStatus: {
    fontSize: 13,
    color: 'gray',
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingsTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
  },
  settingsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  targetControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  targetButton: {
    padding: 5,
  },
  targetValueContainer: {
    alignItems: 'center',
  },
  targetValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  targetRange: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  feedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  feedButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  historyTime: {
    width: 50,
    fontSize: 13,
    color: 'gray',
  },
  historyEvent: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  historyNormal: {
    fontSize: 12,
    color: '#2ecc71',
    fontWeight: '500',
  },
  historyWarning: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    gap: 5,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4a90e2',
    fontWeight: '500',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});