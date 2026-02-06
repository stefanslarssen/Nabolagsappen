import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LokkaLokaltScreen() {
  const businesses = [
    { id: 1, name: 'Grünerløkka Bakeri', category: 'Bakeri', rating: 4.8 },
    { id: 2, name: 'Løkka Kafé', category: 'Kafé', rating: 4.5 },
    { id: 3, name: 'Frisør på hjørnet', category: 'Frisør', rating: 4.7 },
    { id: 4, name: 'Blomsterbutikken', category: 'Blomster', rating: 4.9 },
    { id: 5, name: 'Vinmonopolet Grünerløkka', category: 'Vinmonopol', rating: 4.3 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.subtitle}>Lokale bedrifter og butikker</Text>

        {businesses.map((business) => (
          <TouchableOpacity key={business.id} style={styles.businessCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{business.name.charAt(0)}</Text>
            </View>
            <View style={styles.businessContent}>
              <Text style={styles.businessName}>{business.name}</Text>
              <Text style={styles.businessCategory}>{business.category}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingText}>{business.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  businessContent: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  businessCategory: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
});
