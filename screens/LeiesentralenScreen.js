import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function LeiesentralenScreen() {
  const items = [
    { id: 1, title: 'Drill', description: 'Tilgjengelig for utlån', icon: 'tools' },
    { id: 2, title: 'Sykkel', description: 'Ledig i dag', icon: 'bicycle' },
    { id: 3, title: 'Tilhenger', description: 'Book for helgen', icon: 'truck-loading' },
    { id: 4, title: 'Gressklipper', description: 'Tilgjengelig', icon: 'leaf' },
  ];

  return (
    <View style={styles.container} >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.subtitle}>Del og lån ting i nabolaget</Text>

        {items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemCard}>
            <View style={styles.itemIcon}>
              <FontAwesome5 name={item.icon} size={24} color="#e67e22" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Legg til ny gjenstand</Text>
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff3e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
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
