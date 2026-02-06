import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function AltOmScreen() {
  const sections = [
    { id: 1, title: 'Historie', icon: 'history', description: 'Lær om Grünerløkkas spennende historie' },
    { id: 2, title: 'Kart', icon: 'map', description: 'Interaktivt kart over området' },
    { id: 3, title: 'Transport', icon: 'directions-bus', description: 'Kollektivtransport og parkering' },
    { id: 4, title: 'Parker og grøntområder', icon: 'park', description: 'Oversikt over parker i nabolaget' },
    { id: 5, title: 'Skoler og barnehager', icon: 'school', description: 'Utdanningsinstitusjoner i området' },
    { id: 6, title: 'Helse', icon: 'local-hospital', description: 'Legevakt, apotek og helsetjenester' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.subtitle}>Alt du trenger å vite om Grünerløkka</Text>

        {sections.map((section) => (
          <TouchableOpacity key={section.id} style={styles.sectionCard}>
            <View style={styles.iconContainer}>
              <MaterialIcons name={section.icon} size={28} color="#7b4397" />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionDescription}>{section.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
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
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});
