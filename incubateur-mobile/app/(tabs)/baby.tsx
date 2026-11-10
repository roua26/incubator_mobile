import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useState, useEffect } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function Baby() {
  // État pour les signes vitaux en temps réel
  const [heartRate, setHeartRate] = useState(128);
  const [temperature, setTemperature] = useState(36.8);
  const [respiratoryRate, setRespiratoryRate] = useState(42);
  const [oxygenLevel, setOxygenLevel] = useState(97);

  // Simulation de données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Variations aléatoires réalistes
      setHeartRate(prev => Math.max(120, Math.min(140, prev + (Math.random() - 0.5) * 2)));
      setTemperature(prev => Math.max(36.5, Math.min(37.2, prev + (Math.random() - 0.5) * 0.1)));
      setRespiratoryRate(prev => Math.max(35, Math.min(50, prev + (Math.random() - 0.5) * 1.5)));
      setOxygenLevel(prev => Math.max(95, Math.min(99, prev + (Math.random() - 0.5) * 0.5)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Données pour les graphiques
  const heartRateData = {
    labels: ['06h', '09h', '12h', '15h', '18h', '21h'],
    datasets: [{
      data: [125, 132, 128, 135, 130, 128],
      color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const temperatureData = {
    labels: ['06h', '09h', '12h', '15h', '18h', '21h'],
    datasets: [{
      data: [36.7, 36.9, 36.8, 37.0, 36.8, 36.7],
      color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const respiratoryData = {
    labels: ['06h', '09h', '12h', '15h', '18h', '21h'],
    datasets: [{
      data: [45, 42, 44, 46, 43, 42],
      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(128, 128, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff'
    }
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        </Pressable>
        <Text style={styles.headerTitle}>Mon Bébé</Text>
        <Pressable style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color="gray" />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* SECTION SIGNES VITAUX EN TEMPS RÉEL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signes vitaux en temps réel</Text>
          <Text style={styles.realTimeBadge}>● EN DIRECT</Text>
          
          <View style={styles.vitalGrid}>
            {/* Fréquence cardiaque */}
            <View style={[styles.vitalCard, styles.heartCard]}>
              <View style={styles.vitalHeader}>
                <Ionicons name="heart" size={24} color="#ff6b6b" />
                <Text style={styles.vitalValue}>{Math.round(heartRate)}</Text>
                <Text style={styles.vitalUnit}>bpm</Text>
              </View>
              <Text style={styles.vitalLabel}>Fréquence cardiaque</Text>
              <View style={styles.normalRange}>
                <Text style={styles.rangeText}>Normale: 120-140 bpm</Text>
              </View>
            </View>

            {/* Température */}
            <View style={[styles.vitalCard, styles.tempCard]}>
              <View style={styles.vitalHeader}>
                <Ionicons name="thermometer" size={24} color="#4a90e2" />
                <Text style={styles.vitalValue}>{temperature.toFixed(1)}</Text>
                <Text style={styles.vitalUnit}>°C</Text>
              </View>
              <Text style={styles.vitalLabel}>Température</Text>
              <View style={styles.normalRange}>
                <Text style={styles.rangeText}>Normale: 36.5-37.2°C</Text>
              </View>
            </View>

            {/* Rythme respiratoire */}
            <View style={[styles.vitalCard, styles.respCard]}>
              <View style={styles.vitalHeader}>
                <Ionicons name="pulse" size={24} color="#2ecc71" />
                <Text style={styles.vitalValue}>{respiratoryRate}</Text>
                <Text style={styles.vitalUnit}>resp/min</Text>
              </View>
              <Text style={styles.vitalLabel}>Rythme respiratoire</Text>
              <View style={styles.normalRange}>
                <Text style={styles.rangeText}>Normale: 35-50/min</Text>
              </View>
            </View>

            {/* Saturation Oxygène */}
            <View style={[styles.vitalCard, styles.oxyCard]}>
              <View style={styles.vitalHeader}>
                <Ionicons name="water" size={24} color="#9b59b6" />
                <Text style={styles.vitalValue}>{oxygenLevel}</Text>
                <Text style={styles.vitalUnit}>%</Text>
              </View>
              <Text style={styles.vitalLabel}>Saturation O₂</Text>
              <View style={styles.normalRange}>
                <Text style={styles.rangeText}>Normale: 95-100%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION HISTORIQUE - GRAPHIQUES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique des signes vitaux</Text>
          <Text style={styles.dateText}>Aujourd'hui</Text>

          {/* Graphique Fréquence Cardiaque */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Ionicons name="heart" size={20} color="#ff6b6b" />
              <Text style={styles.chartTitle}>Fréquence cardiaque</Text>
            </View>
            <LineChart
              data={heartRateData}
              width={screenWidth - 35}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              yAxisSuffix=" bpm"
              yAxisInterval={10}
            />
          </View>

          {/* Graphique Température */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Ionicons name="thermometer" size={20} color="#4a90e2" />
              <Text style={styles.chartTitle}>Température</Text>
            </View>
            <LineChart
              data={temperatureData}
              width={screenWidth -35}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart
              }
              yAxisSuffix=" °C"
              yAxisInterval={0.2}
            />
          </View>

          {/* Graphique Rythme Respiratoire */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Ionicons name="pulse" size={20} color="#2ecc71" />
              <Text style={styles.chartTitle}>Rythme respiratoire</Text>
            </View>
            <LineChart
              data={respiratoryData}
              width={screenWidth - 35}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              yAxisSuffix="/min"
              yAxisInterval={5}
            />
          </View>

          {/* BOUTON VOIR PLUS D'HISTORIQUE */}
          <Pressable style={styles.historyButton}>
            <Text style={styles.historyButtonText}>Voir l'historique complet</Text>
            <Ionicons name="arrow-forward" size={18} color="#4a90e2" />
          </Pressable>
        </View>

        

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
  settingsButton: {
    padding: 5,
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
    marginBottom: 10,
  },
  realTimeBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vitalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  vitalCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  heartCard: {
    borderTopWidth: 3,
    borderTopColor: '#ff6b6b',
  },
  tempCard: {
    borderTopWidth: 3,
    borderTopColor: '#4a90e2',
  },
  respCard: {
    borderTopWidth: 3,
    borderTopColor: '#2ecc71',
  },
  oxyCard: {
    borderTopWidth: 3,
    borderTopColor: '#9b59b6',
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  vitalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  vitalUnit: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 5,
  },
  vitalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  normalRange: {
    backgroundColor: '#f8f9fa',
    padding: 6,
    borderRadius: 8,
  },
  rangeText: {
    fontSize: 11,
    color: 'gray',
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 15,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  chart: {
    borderRadius: 12,
    marginLeft: -20,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
  },
  historyButtonText: {
    fontSize: 14,
    color: '#4a90e2',
    fontWeight: '600',
    marginRight: 8,
  },
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  examIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  examInfo: {
    flex: 1,
    marginLeft: 12,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  examDate: {
    fontSize: 13,
    color: 'gray',
    marginTop: 2,
  },
  examResult: {
    fontSize: 13,
    color: '#2ecc71',
    marginTop: 2,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});