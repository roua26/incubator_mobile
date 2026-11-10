import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../service/api';

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone?: string;
  dateCreation: string;
  bebes?: any[];
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await api.getMe();
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Bouton retour */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        </Pressable>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={120} color="#4a90e2" />
          <Text style={styles.name}>{user?.prenom} {user?.nom}</Text>
          <Text style={styles.role}>{user?.role || 'Parent'}</Text>
        </View>

        {/* Informations */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#4a90e2" />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          {user?.telephone && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#4a90e2" />
              <Text style={styles.infoLabel}>Téléphone:</Text>
              <Text style={styles.infoValue}>{user.telephone}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#4a90e2" />
            <Text style={styles.infoLabel}>Membre depuis:</Text>
            <Text style={styles.infoValue}>
              {user?.dateCreation ? new Date(user.dateCreation).toLocaleDateString('fr-FR') : 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#4a90e2" />
            <Text style={styles.infoLabel}>Bébés:</Text>
            <Text style={styles.infoValue}>{user?.bebes?.length || 0}</Text>
          </View>
        </View>

        {/* Message de développement */}
        <View style={styles.devNotice}>
          <Ionicons name="construct-outline" size={30} color="#ffa502" />
          <Text style={styles.devTitle}>Page en développement</Text>
          <Text style={styles.devText}>
            Cette page sera bientôt complète avec plus de fonctionnalités :
            modification du profil, préférences, etc.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  role: {
    fontSize: 16,
    color: '#4a90e2',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  infoCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  devNotice: {
    width: '100%',
    backgroundColor: '#fff9e6',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  devTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffa502',
    marginTop: 10,
  },
  devText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
});