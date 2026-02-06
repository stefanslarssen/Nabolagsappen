import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function HvaSkjerScreen() {
  const events = [
    { id: 1, title: 'Lørdagsmarked', date: 'Lør 8. feb', time: '10:00 - 16:00', location: 'Birkelunden' },
    { id: 2, title: 'Yoga i parken', date: 'Søn 9. feb', time: '11:00 - 12:00', location: 'Sofienbergparken' },
    { id: 3, title: 'Pub quiz', date: 'Ons 12. feb', time: '19:00', location: 'Café Sara' },
    { id: 4, title: 'Konsert', date: 'Fre 14. feb', time: '21:00', location: 'Blå' },
  ];

  return (
    <View style={styles.container} >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.subtitle}>Kommende arrangementer på Løkka</Text>

        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{event.date.split(' ')[1]}</Text>
              <Text style={styles.monthText}>{event.date.split(' ')[2]}</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventDetails}>
                <MaterialIcons name="access-time" size={14} color="#888" />
                <Text style={styles.eventDetailText}>{event.time}</Text>
              </View>
              <View style={styles.eventDetails}>
                <MaterialIcons name="location-on" size={14} color="#888" />
                <Text style={styles.eventDetailText}>{event.location}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Legg til arrangement</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dateBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#e67e22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  monthText: {
    fontSize: 12,
    color: '#fff',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  eventDetailText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e67e22',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
