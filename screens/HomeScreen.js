import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Card = ({ title, icon, bgColor, textColor = '#fff', onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bgColor }]} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={[styles.plusButton, { backgroundColor: textColor === '#fff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)' }]}>
          <Ionicons name="add" size={20} color={textColor === '#fff' ? '#fff' : '#e67e22'} />
        </View>
      </View>
      <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const SmallCard = ({ title, icon, bgColor, onPress }) => {
  return (
    <TouchableOpacity style={[styles.smallCard, { backgroundColor: bgColor }]} onPress={onPress}>
      <View style={styles.smallCardHeader}>
        <View style={styles.smallIconContainer}>
          {icon}
        </View>
        <View style={styles.smallPlusButton}>
          <Ionicons name="add" size={18} color="#fff" />
        </View>
      </View>
      <Text style={styles.smallCardTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const DayTab = ({ day, isActive }) => {
  return (
    <TouchableOpacity style={[styles.dayTab, isActive && styles.dayTabActive]}>
      <Text style={[styles.dayTabText, isActive && styles.dayTabTextActive]}>{day}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const days = ['MANDAG', 'TIRSDAG', 'ONSDAG', 'TORSDAG', 'FREDAG', 'LØRDAG', 'SØNDAG'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.header}>Grünerløkka</Text>

        {/* Cards Grid */}
        <View style={styles.cardsContainer}>
          {/* Row 1 */}
          <View style={styles.row}>
            <Card
              title="Leiesentralen"
              bgColor="#e67e22"
              icon={<FontAwesome5 name="hands-helping" size={24} color="#fff" />}
              onPress={() => navigation.navigate('Leiesentralen')}
            />
            <Card
              title="Hva skjer på Løkka?"
              bgColor="#fff"
              textColor="#333"
              icon={<MaterialIcons name="event" size={28} color="#e67e22" />}
              onPress={() => navigation.navigate('HvaSkjer')}
            />
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <Card
              title="Løkka Lokalt"
              bgColor="#9b59b6"
              icon={<Ionicons name="checkmark-circle" size={26} color="#fff" />}
              onPress={() => navigation.navigate('LokkaLokalt')}
            />
            <Card
              title="Oppdateringer fra Fellesskapet"
              bgColor="#c77dba"
              icon={<Ionicons name="heart-outline" size={26} color="#fff" />}
              onPress={() => navigation.navigate('Oppdateringer')}
            />
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <SmallCard
              title="Alt om Grunerløkka"
              bgColor="#7b4397"
              icon={<Feather name="arrow-right-circle" size={22} color="#fff" />}
              onPress={() => navigation.navigate('AltOm')}
            />
            <SmallCard
              title="Nyheter på Løkka"
              bgColor="#7b4397"
              icon={<MaterialIcons name="article" size={24} color="#fff" />}
              onPress={() => navigation.navigate('Nyheter')}
            />
          </View>
        </View>

        {/* Ad Banner */}
        <View style={styles.adBanner}>
          <View style={styles.adLeft}>
            <Text style={styles.adSmallText}>EVERYDAY,</Text>
            <Text style={styles.adBigText}>IT'S KEBAB TIME</Text>
          </View>
          <View style={styles.adRight}>
            <Text style={styles.adLabel}>Dagens kebab</Text>
            <Text style={styles.adPrice}>80,-</Text>
          </View>
          <View style={styles.adTag}>
            <Text style={styles.adTagText}>AD</Text>
          </View>
        </View>

        {/* Day Navigation */}
        <View style={styles.dayNavigation}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {days.map((day, index) => (
              <DayTab key={day} day={day} isActive={index === 2} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a855f7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  smallCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  smallCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  smallIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  smallPlusButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  adBanner: {
    backgroundColor: '#fbbf24',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  adLeft: {
    flex: 1,
  },
  adSmallText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  adBigText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  adRight: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  adLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  adPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  adTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adTagText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  dayNavigation: {
    backgroundColor: '#1f2937',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  dayTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  dayTabActive: {
    backgroundColor: '#374151',
  },
  dayTabText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
  dayTabTextActive: {
    color: '#fff',
  },
});
