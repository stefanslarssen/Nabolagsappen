import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OppdateringerScreen() {
  const updates = [
    { id: 1, author: 'Maria H.', time: '2 timer siden', content: 'Noen som har sett en svart katt i området rundt Birkelunden? Den har vært borte siden i går.' },
    { id: 2, author: 'Erik S.', time: '5 timer siden', content: 'Takk til alle som kom på dugnaden i går! Parken ser strålende ut.' },
    { id: 3, author: 'Lisa B.', time: '1 dag siden', content: 'Husk at det er søppelplukking i Sofienbergparken på lørdag kl 10:00. Alle er velkomne!' },
    { id: 4, author: 'Anders K.', time: '2 dager siden', content: 'Ny kafé åpnet på Thorvald Meyers gate. Anbefales!' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.subtitle}>Siste fra nabolaget</Text>

        {updates.map((update) => (
          <View key={update.id} style={styles.updateCard}>
            <View style={styles.updateHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{update.author.charAt(0)}</Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{update.author}</Text>
                <Text style={styles.timeText}>{update.time}</Text>
              </View>
            </View>
            <Text style={styles.updateContent}>{update.content}</Text>
            <View style={styles.updateActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={20} color="#888" />
                <Text style={styles.actionText}>Lik</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#888" />
                <Text style={styles.actionText}>Kommenter</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Skriv en oppdatering</Text>
        </TouchableOpacity>
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
  updateCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#c77dba',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  updateContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  updateActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c77dba',
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
