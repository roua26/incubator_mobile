import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../service/api';

interface User {
  prenom: string;
  nom: string;
  role: string;
  bebes?: any[];
}

export default function Menu() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await api.getMe();
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Erreur chargement user:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.logout();
              api.setToken(null);
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            }
          }
        }
      ]
    );
  };

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* EN-TÊTE DU MENU */}
        <Pressable 
          style={styles.header}
          onPress={() => navigateTo('/profile')}
        >
          <Ionicons name="person-circle" size={80} color="#4a90e2" />
          <Text style={styles.headerTitle}>
            {user ? `${user.prenom} ${user.nom}` : 'Mon Compte'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {user?.role || 'Parent'} • {user?.bebes?.length || 0} bébé(s)
          </Text>
          <View style={styles.editBadge}>
            <Ionicons name="create-outline" size={16} color="white" />
            <Text style={styles.editText}>Voir le profil</Text>
          </View>
        </Pressable>

        {/* LISTE DES MENUS */}
        <View style={styles.menuList}>
          
          {/* Section principale */}
          <Text style={styles.sectionTitle}>PRINCIPAL</Text>
          
          <Pressable 
            style={styles.menuItem} 
            onPress={() => navigateTo('/')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
              <Ionicons name="home" size={22} color="#4a90e2" />
            </View>
            <Text style={styles.menuText}>Accueil</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>
          
          <Pressable 
            style={styles.menuItem} 
            onPress={() => navigateTo('/baby')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#ffebee' }]}>
              <Ionicons name="happy-outline" size={22} color="#ff6b6b" />
            </View>
            <Text style={styles.menuText}>Mon Bébé</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>
          
          <Pressable 
            style={styles.menuItem} 
            onPress={() => navigateTo('/incubator')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#e8f5e8' }]}>
              <Ionicons name="thermometer" size={22} color="#2ecc71" />
            </View>
            <Text style={styles.menuText}>Incubateur</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>

          {/* Section compte */}
          <Text style={styles.sectionTitle}>COMPTE</Text>
          
          <Pressable 
            style={styles.menuItem} 
            onPress={() => navigateTo('/profile')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#f3e5f5' }]}>
              <Ionicons name="person" size={22} color="#9b59b6" />
            </View>
            <Text style={styles.menuText}>Profil</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>
          
          <Pressable 
            style={styles.menuItem} 
            onPress={() => navigateTo('/settings')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#fff3e0' }]}>
              <Ionicons name="settings" size={22} color="#f39c12" />
            </View>
            <Text style={styles.menuText}>Paramètres</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>

        </View>

        {/* BOUTONS BAS */}
        <View style={styles.footer}>
          <Pressable 
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close-circle" size={24} color="#999" />
            <Text style={styles.closeText}>Fermer</Text>
          </Pressable>

          <Pressable 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },
  editText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginLeft: 25,
    marginTop: 20,
    marginBottom: 5,
    letterSpacing: 1,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  closeText: {
    fontSize: 16,
    color: '#999',
    marginLeft: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff6b6b',
    marginLeft: 5,
  },
});