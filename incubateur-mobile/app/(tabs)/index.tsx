import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../service/api';

// Types
interface Incubateur {
  _id: string;
  nom: string;
  numeroSerie: string;

}
interface Doctor{
  _id:string;
  nom:string;
  prenom:string;

}

interface Baby {
  _id: string;
  nom: string;
  prenom: string;
  incubateur: Incubateur;
  docteur:Doctor;
}

interface Alert {
  _id: string;
  type: string;
  titre: string;
}

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  bebes: Baby[];
}

interface DashboardData {
  user: User;
  alerts: Alert[];
  notifications: any[];
  unreadCount: number;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les données au montage
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Vérifier l'authentification et récupérer l'utilisateur
      const meResponse = await api.getMe();
      if (!meResponse.data?.user) {
        router.replace('/auth/login');
        return;
      }
      setUser(meResponse.data.user);

      // 2. Récupérer les bébés du parent
      const babiesResponse = await api.get<any>('baby/all');
      if (babiesResponse.data?.babies) {
        setUser(prev => prev ? {
          ...prev,
          bebes: babiesResponse.data.babies
        } : null);
      }

      // // 3. Récupérer les alertes
      // try {
      //   const alertsResponse = await api.get('/alerts');
      //   if (alertsResponse.data?.alerts) {
      //     setAlerts(alertsResponse.data.alerts);
      //   }
      // } catch (error) {
      //   console.log('Pas d\'alertes ou erreur');
      // }

      // // 4. Récupérer les statistiques des alertes
      // try {
      //   const statsResponse = await api.get('/alerts/stats');
      //   if (statsResponse.data?.stats) {
      //     const nonLu = statsResponse.data.stats.find((s: any) => s._id === 'critique')?.nonLu || 0;
      //     setUnreadCount(nonLu);
      //   }
      // } catch (error) {
      //   console.log('Erreur stats');
      // }

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      router.replace('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      api.setToken(null);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Chargement de vos données...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* BOUTON MENU EN HAUT À GAUCHE */}
      <Pressable
        style={styles.menuButton}
        onPress={() => router.push('/menu')}
      >
        <Ionicons name="menu-outline" size={30} color="#4a90e2" />
      </Pressable>

      {/* BOUTON RAFRAÎCHIR */}
      <Pressable
        style={styles.refreshButton}
        onPress={handleRefresh}
      >
        <Ionicons name="refresh-outline" size={24} color="#4a90e2" />
      </Pressable>

      {/* BOUTON CHAT FLOTTANT */}
      <Pressable
        style={styles.chatButton}
        onPress={() => router.push('/chat')}
      >
        <View style={styles.chatNotification}>
          <Text style={styles.chatNotificationText}>{unreadCount}</Text>
        </View>
        <Ionicons name="chatbubbles" size={30} color="white" />
      </Pressable>

      {/* CONTENU SCROLLABLE */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER AVEC NOM DE L'UTILISATEUR */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>
              {user?.prenom} {user?.nom}
            </Text>
            {user?.bebes && user.bebes.length > 0 && (
              <Text style={styles.babyCount}>
                {user.bebes.length} bébé{user.bebes.length > 1 ? 's' : ''} enregistré{user.bebes.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
          </Pressable>
        </View>

        {/* SECTION BÉBÉS */}
        {user?.bebes && user.bebes.length > 0 ? (
          user.bebes.map((baby) => (
            <Pressable
              key={baby._id}
              style={styles.card}
              onPress={() => router.push(`/baby?id=${baby._id}`)}
            >
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4829/4829642.png' }}
                style={styles.image}
              />
              <Text style={styles.title}>
                {baby.prenom} {baby.nom}
              </Text>
              <Text style={styles.subtitle}>Consulter les informations</Text>
            </Pressable>
          ))
        ) : (
          <Pressable
            style={[styles.card, styles.addBabyCard]}
          //onPress={() => router.push('/baby/create')}
          >
            <Ionicons name="add-circle-outline" size={50} color="#4a90e2" />
            <Text style={styles.title}>Ajouter un bébé</Text>
            <Text style={styles.subtitle}>Enregistrer un nouveau-né</Text>
          </Pressable>
        )}



        {/* CARRE INCUBATEUR */}
        <Pressable style={styles.card}
        onPress={() => router.push('/incubator')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1713/1713627.png' }}
            style={styles.image}
          />
          <Text style={styles.title}>Incubateur</Text>

          {user?.bebes && user.bebes.length > 0 && user.bebes[0].incubateur && (
            <>
              {/* Nom et numéro de série */}
              <View style={styles.incubatorInfo}>
                <Text style={styles.incubatorName}>
                  {user.bebes[0].incubateur.nom}
                </Text>
                <Text style={styles.incubatorSerie}>
                  {user.bebes[0].incubateur.numeroSerie}
                </Text>
              </View>

             
            </>
          )}

          <Text style={styles.subtitle}>
            {user?.bebes && user.bebes.length > 0
              ? `Pour ${user.bebes[0].prenom}`
              : 'Ajoutez un bébé'
            }
          </Text>
        </Pressable>


        
        {/* CARRE DOCTOR */}
        <Pressable style={styles.card}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png' }}
            style={styles.image}
          />
          <Text style={styles.title}>Docteur</Text>

          {user?.bebes && user.bebes.length > 0 && user.bebes[0].docteur && (
            <>
              
              <View style={styles.incubatorInfo}>
                <Text style={styles.incubatorName}>
                  {user.bebes[0].docteur.nom}
                </Text>
                <Text style={styles.incubatorSerie}>
                  {user.bebes[0].docteur.prenom}
                </Text>
              </View>

             
            </>
          )}

          <Text style={styles.subtitle}>
            {user?.bebes && user.bebes.length > 0
              ? `Pour ${user.bebes[0].prenom}`
              : 'Ajoutez un bébé'
            }
          </Text>
        </Pressable>

        {/* CARRE RENDEZ-VOUS */}
        <Pressable
          style={styles.card}
        //onPress={() => router.push('/appointments')}
        >
          <Ionicons name="calendar-outline" size={50} color="#4a90e2" />
          <Text style={styles.title}>Rendez-vous</Text>
          <Text style={styles.subtitle}>Prendre un rendez-vous</Text>
        </Pressable>

        {/* CARRE NOTIFICATIONS */}
        <Pressable
          style={styles.card}
          onPress={() => router.push('/notification')}
        >
          <Ionicons name="notifications-outline" size={50} color="#ffa502" />
          <Text style={styles.title}>Notifications</Text>
          <View style={[styles.alertBadge, { backgroundColor: '#ffa502' }]}>
            <Text style={styles.alertBadgeText}>{notifications.length}</Text>
          </View>
          <Text style={styles.subtitle}>Voir les notifications</Text>
        </Pressable>

        {/* ESPACE EN BAS */}
        <View style={{ height: 80 }} />

      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  babyCount: {
    fontSize: 12,
    color: '#4a90e2',
    marginTop: 5,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    padding: 10,
  },
  refreshButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 100,
    padding: 10,
  },
  logoutButton: {
    padding: 5,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    marginTop: 10,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addBabyCard: {
    borderWidth: 2,
    borderColor: '#4a90e2',
    borderStyle: 'dashed',
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  alertBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  alertBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#4a90e2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 200,
  },
  chatNotification: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff6b6b',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 210,
  },
  chatNotificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  simpleInfo: {
    alignItems: 'center',
    marginVertical: 5,
  },
  incubatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a90e2',
    marginBottom: 2,
  },
  incubatorSerie: {
    fontSize: 14,
    color: '#666',
  },
  warningText: {
    fontSize: 14,
    color: '#ffa502',
    marginVertical: 5,
    fontStyle: 'italic',
  },
  incubatorInfo: {
  alignItems: 'center',
  marginVertical: 5,
},
});