import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NyheterScreen() {
  const news = [
    {
      id: 1,
      title: 'Ny sykkelsti åpner på Løkka',
      summary: 'Den nye sykkelstien langs Akerselva står ferdig og åpner for publikum neste uke.',
      date: '2. feb 2026',
      category: 'Trafikk'
    },
    {
      id: 2,
      title: 'Birkelunden får ny lekeplass',
      summary: 'Kommunen har bevilget midler til oppgradering av lekeplassen i Birkelunden.',
      date: '1. feb 2026',
      category: 'Fritid'
    },
    {
      id: 3,
      title: 'Grünerløkka kulturhus fyller 10 år',
      summary: 'Stor jubileumsfest planlegges med gratiskonserter og aktiviteter for hele familien.',
      date: '30. jan 2026',
      category: 'Kultur'
    },
    {
      id: 4,
      title: 'Nye renovasjonsrutiner fra mars',
      summary: 'Oslo kommune innfører nye rutiner for avfallshåndtering i bydelen.',
      date: '28. jan 2026',
      category: 'Kommunalt'
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Trafikk': '#3b82f6',
      'Fritid': '#10b981',
      'Kultur': '#f59e0b',
      'Kommunalt': '#6366f1',
    };
    return colors[category] || '#888';
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.subtitle}>Siste nytt fra Grünerløkka</Text>

        {news.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsCard}>
            <View style={styles.newsHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSummary}>{item.summary}</Text>
            <View style={styles.readMore}>
              <Text style={styles.readMoreText}>Les mer</Text>
              <Ionicons name="arrow-forward" size={16} color="#7b4397" />
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
  newsCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  newsSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7b4397',
    marginRight: 4,
  },
});
