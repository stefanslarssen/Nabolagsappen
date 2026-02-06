import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, StatusBar, TextInput, Modal, Alert, ActivityIndicator, Linking, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Oslo nabolag med koordinater (dekker hele Oslo)
const OSLO_DISTRICTS = [
  // Vestre Aker
  { name: 'Hovseter', lat: 59.9470, lon: 10.6290 },
  { name: 'Røa', lat: 59.9520, lon: 10.6180 },
  { name: 'Holmenkollen', lat: 59.9610, lon: 10.6680 },
  { name: 'Vinderen', lat: 59.9420, lon: 10.6950 },
  { name: 'Slemdal', lat: 59.9550, lon: 10.6850 },
  { name: 'Ris', lat: 59.9480, lon: 10.7050 },
  // Frogner
  { name: 'Majorstuen', lat: 59.9290, lon: 10.7130 },
  { name: 'Frogner', lat: 59.9200, lon: 10.7000 },
  { name: 'Skillebekk', lat: 59.9150, lon: 10.7050 },
  { name: 'Bygdøy', lat: 59.9050, lon: 10.6800 },
  { name: 'Briskeby', lat: 59.9220, lon: 10.7180 },
  // St. Hanshaugen
  { name: 'Bislett', lat: 59.9250, lon: 10.7330 },
  { name: 'St. Hanshaugen', lat: 59.9300, lon: 10.7400 },
  { name: 'Adamstuen', lat: 59.9330, lon: 10.7280 },
  { name: 'Marienlyst', lat: 59.9370, lon: 10.7200 },
  // Grünerløkka
  { name: 'Grünerløkka', lat: 59.9226, lon: 10.7594 },
  { name: 'Carl Berner', lat: 59.9280, lon: 10.7740 },
  { name: 'Rodeløkka', lat: 59.9260, lon: 10.7680 },
  { name: 'Sofienberg', lat: 59.9200, lon: 10.7650 },
  { name: 'Dælenenga', lat: 59.9240, lon: 10.7750 },
  // Sagene
  { name: 'Sagene', lat: 59.9400, lon: 10.7500 },
  { name: 'Torshov', lat: 59.9350, lon: 10.7620 },
  { name: 'Bjølsen', lat: 59.9420, lon: 10.7580 },
  { name: 'Iladalen', lat: 59.9340, lon: 10.7450 },
  // Gamle Oslo
  { name: 'Tøyen', lat: 59.9160, lon: 10.7700 },
  { name: 'Grønland', lat: 59.9120, lon: 10.7600 },
  { name: 'Gamle Oslo', lat: 59.9050, lon: 10.7800 },
  { name: 'Kampen', lat: 59.9130, lon: 10.7780 },
  { name: 'Vålerenga', lat: 59.9080, lon: 10.7900 },
  { name: 'Ensjø', lat: 59.9120, lon: 10.7950 },
  { name: 'Gamlebyen', lat: 59.9050, lon: 10.7700 },
  // Nordre Aker
  { name: 'Nydalen', lat: 59.9490, lon: 10.7650 },
  { name: 'Ullevål', lat: 59.9470, lon: 10.7330 },
  { name: 'Nordre Aker', lat: 59.9600, lon: 10.7300 },
  { name: 'Tåsen', lat: 59.9550, lon: 10.7450 },
  { name: 'Kjelsås', lat: 59.9650, lon: 10.7600 },
  { name: 'Grefsen', lat: 59.9580, lon: 10.7720 },
  { name: 'Korsvoll', lat: 59.9620, lon: 10.7500 },
  // Sentrum
  { name: 'Sentrum', lat: 59.9139, lon: 10.7522 },
  { name: 'Aker Brygge', lat: 59.9100, lon: 10.7270 },
  { name: 'Bjørvika', lat: 59.9080, lon: 10.7570 },
  { name: 'Kvadraturen', lat: 59.9100, lon: 10.7450 },
  { name: 'Pipervika', lat: 59.9080, lon: 10.7350 },
  // Ullern
  { name: 'Ullern', lat: 59.9300, lon: 10.6500 },
  { name: 'Smestad', lat: 59.9350, lon: 10.6650 },
  { name: 'Lilleaker', lat: 59.9230, lon: 10.6350 },
  { name: 'Montebello', lat: 59.9280, lon: 10.6580 },
  // Bjerke
  { name: 'Sinsen', lat: 59.9390, lon: 10.7850 },
  { name: 'Bjerke', lat: 59.9500, lon: 10.8200 },
  { name: 'Økern', lat: 59.9320, lon: 10.8050 },
  { name: 'Løren', lat: 59.9350, lon: 10.7920 },
  { name: 'Risløkka', lat: 59.9420, lon: 10.8100 },
  { name: 'Veitvet', lat: 59.9550, lon: 10.8350 },
  // Østensjø
  { name: 'Manglerud', lat: 59.8980, lon: 10.8150 },
  { name: 'Østensjø', lat: 59.8900, lon: 10.8300 },
  { name: 'Bøler', lat: 59.8850, lon: 10.8450 },
  { name: 'Skullerud', lat: 59.8700, lon: 10.8350 },
  { name: 'Oppsal', lat: 59.8920, lon: 10.8400 },
  { name: 'Abildsø', lat: 59.8800, lon: 10.8200 },
  // Nordstrand
  { name: 'Lambertseter', lat: 59.8750, lon: 10.8100 },
  { name: 'Nordstrand', lat: 59.8600, lon: 10.8000 },
  { name: 'Bekkelaget', lat: 59.8800, lon: 10.7850 },
  { name: 'Ljan', lat: 59.8450, lon: 10.7950 },
  { name: 'Sæterkrysset', lat: 59.8700, lon: 10.7950 },
  // Søndre Nordstrand
  { name: 'Holmlia', lat: 59.8350, lon: 10.7950 },
  { name: 'Søndre Nordstrand', lat: 59.8300, lon: 10.8100 },
  { name: 'Mortensrud', lat: 59.8450, lon: 10.8200 },
  { name: 'Bjørndal', lat: 59.8280, lon: 10.8250 },
  // Grorud
  { name: 'Grorud', lat: 59.9600, lon: 10.8800 },
  { name: 'Ammerud', lat: 59.9650, lon: 10.8700 },
  { name: 'Romsås', lat: 59.9680, lon: 10.8950 },
  { name: 'Kalbakken', lat: 59.9530, lon: 10.8650 },
  // Stovner
  { name: 'Stovner', lat: 59.9600, lon: 10.9200 },
  { name: 'Vestli', lat: 59.9680, lon: 10.9100 },
  { name: 'Rommen', lat: 59.9620, lon: 10.9050 },
  { name: 'Haugenstua', lat: 59.9550, lon: 10.8950 },
  // Alna
  { name: 'Furuset', lat: 59.9350, lon: 10.8850 },
  { name: 'Alna', lat: 59.9300, lon: 10.8700 },
  { name: 'Ellingsrud', lat: 59.9280, lon: 10.9100 },
  { name: 'Lindeberg', lat: 59.9380, lon: 10.8950 },
  { name: 'Trosterud', lat: 59.9250, lon: 10.8800 },
  { name: 'Haugerud', lat: 59.9200, lon: 10.8650 },
  { name: 'Tveita', lat: 59.9150, lon: 10.8500 },
];

// Hjelpefunksjon for kortnavn basert på bydel
const getShortName = (district) => {
  const shortNames = {
    'Grünerløkka': 'Løkka',
    'St. Hanshaugen': 'Haugen',
    'Gamle Oslo': 'Gamle Oslo',
    'Søndre Nordstrand': 'Søndre',
    'Nordre Aker': 'Nordre Aker',
    'Vestre Aker': 'Vestre Aker',
  };
  return shortNames[district] || district;
};

// Finn nærmeste bydel basert på koordinater
const findNearestDistrict = (lat, lon) => {
  let nearest = OSLO_DISTRICTS[0];
  let minDistance = Infinity;

  OSLO_DISTRICTS.forEach((district) => {
    const distance = Math.sqrt(
      Math.pow(lat - district.lat, 2) + Math.pow(lon - district.lon, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = district;
    }
  });

  return nearest.name;
};

// Storage keys
const STORAGE_KEYS = {
  ITEMS: 'leiesentralen_items',
  EVENTS: 'events_data',
  BUSINESSES: 'businesses_data',
  UPDATES: 'updates_data',
  NEWS: 'news_data',
  FAVORITES: 'favorites_data',
};

// Default data
const DEFAULT_ITEMS = [
  { id: 1, title: 'Drill', description: 'Tilgjengelig for utlån', icon: 'tools', owner: 'Erik S.', phone: '912 34 567' },
  { id: 2, title: 'Sykkel', description: 'Ledig i dag', icon: 'bicycle', owner: 'Maria H.', phone: '923 45 678' },
  { id: 3, title: 'Tilhenger', description: 'Book for helgen', icon: 'truck-loading', owner: 'Anders K.', phone: '934 56 789' },
  { id: 4, title: 'Gressklipper', description: 'Tilgjengelig', icon: 'leaf', owner: 'Lisa B.', phone: '945 67 890' },
];

// Bydels-spesifikke data for ekte steder i Oslo
const DISTRICT_DATA = {
  'Hovseter': {
    events: [
      { id: 1, title: 'Lørdagsmarked', date: '8', month: 'feb', time: '10:00 - 15:00', location: 'Røa Torg', description: 'Ukentlig marked med lokale produsenter, bønder fra Bærum og håndverkere.', organizer: 'Røa Handel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Yoga ved Bogstadvannet', date: '9', month: 'feb', time: '10:00 - 11:00', location: 'Bogstadvannet', description: 'Drop-in yoga ved vannet. Ta med egen matte!', organizer: 'Nordmarka Yoga', price: '100 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Røa Pub', description: 'Ukentlig quiz med gode premier og god stemning!', organizer: 'Røa Pub', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Konsert', date: '14', month: 'feb', time: '20:00', location: 'Røa Scene', description: 'Live musikk med lokale artister.', organizer: 'Røa Scene', price: '200 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Morgensvøm', date: '3', month: 'feb', time: '07:00 - 08:00', location: 'Røa Bad', description: 'Start dagen med et friskt svømmtak.', organizer: 'Røa Bad', price: '80 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Åpen mikrofon', date: '4', month: 'feb', time: '20:00', location: 'Kulturhuset Røa', description: 'Vis frem talentet ditt - sang, poesi, standup!', organizer: 'Kulturhuset', price: 'Gratis', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Bokkveld', date: '6', month: 'feb', time: '19:00', location: 'Deichman Røa', description: 'Forfatterbesøk og bokklubb-diskusjon.', organizer: 'Deichman', price: 'Gratis', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Åpent Bakeri Røa', category: 'Kafé', rating: 4.8, address: 'Røa Torg 5', phone: '22 49 50 00', hours: 'Man-Fre: 07-18, Lør-Søn: 08-17', description: 'Håndverksbakeri med byens beste kanelboller og kaffe.' },
      { id: 2, name: 'Røa Mat & Vinhus', category: 'Matbutikk', rating: 4.7, address: 'Røa Torg 12', phone: '22 49 51 00', hours: 'Man-Lør: 10-19', description: 'Delikatesser, ost, vin og lokale råvarer.' },
      { id: 3, name: 'Grappa', category: 'Restaurant', rating: 4.6, address: 'Vækerøveien 207', phone: '22 49 52 00', hours: 'Tir-Søn: 16-23', description: 'Italiensk restaurant med hjemmelaget pasta.' },
      { id: 4, name: 'Kunstneren Interiør', category: 'Butikk', rating: 4.5, address: 'Røa Torg 8', phone: '22 49 53 00', hours: 'Man-Lør: 10-17', description: 'Skandinavisk design og interiør.' },
    ],
    park: 'Bogstadvannet',
  },
  'Majorstuen': {
    events: [
      { id: 1, title: 'Vintage-marked', date: '8', month: 'feb', time: '11:00 - 17:00', location: 'Colosseum Kino', description: 'Månedlig vintage-marked med klær, vinyl og retro-skatter.', organizer: 'Oslo Vintage', price: '50 kr', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Søndagsbrunch', date: '9', month: 'feb', time: '11:00 - 15:00', location: 'Majorstuen Bistro', description: 'All-you-can-eat brunch med champagne.', organizer: 'Majorstuen Bistro', price: '395 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Lorry', description: 'Oslos eldste pub quiz! Vært her siden 1987.', organizer: 'Lorry', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Kino & vin', date: '14', month: 'feb', time: '19:30', location: 'Colosseum Kino', description: 'Filmvisning med vinbar før og etter.', organizer: 'Colosseum', price: '250 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Pilates', date: '3', month: 'feb', time: '07:30 - 08:30', location: 'SATS Majorstuen', description: 'Start uken med pilates.', organizer: 'SATS', price: 'Medlemskap', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Stand-up', date: '4', month: 'feb', time: '20:00', location: 'Latter', description: 'Ukentlig stand-up med nye talenter.', organizer: 'Latter', price: '150 kr', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Vin & ost kveld', date: '6', month: 'feb', time: '18:00', location: 'Gutta på Haugen', description: 'Vinsmaking med lokale oster.', organizer: 'Gutta på Haugen', price: '350 kr', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Fuglen', category: 'Kafé', rating: 4.9, address: 'Universitetsgata 2', phone: '22 60 00 01', hours: 'Man-Fre: 08-19, Lør-Søn: 10-18', description: 'Verdenskjent kaffebar med japansk vri.' },
      { id: 2, name: 'Lorry', category: 'Pub', rating: 4.6, address: 'Parkveien 12', phone: '22 60 00 02', hours: 'Man-Søn: 11-03', description: 'Klassisk Oslo-pub siden 1880.' },
      { id: 3, name: 'Gutta på Haugen', category: 'Restaurant', rating: 4.7, address: 'Holtegata 4', phone: '22 60 00 03', hours: 'Tir-Lør: 17-23', description: 'Moderne norsk med fokus på lokale råvarer.' },
      { id: 4, name: 'Colosseum Kino', category: 'Kino', rating: 4.8, address: 'Fridtjof Nansens vei 6', phone: '22 60 00 04', hours: 'Se program', description: 'Europas største kino med IMAX.' },
    ],
    park: 'Frognerparken',
  },
  'Torshov': {
    events: [
      { id: 1, title: 'Loppemarked', date: '8', month: 'feb', time: '10:00 - 16:00', location: 'Torshov Kirke', description: 'Stort loppemarked med kaffe og vafler.', organizer: 'Torshov Menighet', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Parkrun', date: '9', month: 'feb', time: '09:00', location: 'Torshovdalen', description: 'Gratis 5km løp hver søndag. Alle nivåer!', organizer: 'Parkrun Norge', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Torshovgata Pub', description: 'Ukentlig quiz med lokale favoritter.', organizer: 'Torshovgata Pub', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Konsert', date: '14', month: 'feb', time: '21:00', location: 'Torshov Café', description: 'Live indie og folk musikk.', organizer: 'Torshov Café', price: '100 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Yoga i parken', date: '3', month: 'feb', time: '18:00 - 19:00', location: 'Torshovdalen', description: 'Utendørs yoga når været tillater.', organizer: 'Torshov Yoga', price: '80 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Språkkafé', date: '4', month: 'feb', time: '18:00', location: 'Deichman Torshov', description: 'Øv norsk eller hjelp andre lære!', organizer: 'Deichman', price: 'Gratis', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Filmklubb', date: '6', month: 'feb', time: '19:00', location: 'Torshov Café', description: 'Ukentlig filmvisning og diskusjon.', organizer: 'Torshov Filmklubb', price: '50 kr', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Godt Brød Torshov', category: 'Kafé', rating: 4.7, address: 'Vogts gate 64', phone: '22 70 00 01', hours: 'Man-Fre: 07-18, Lør-Søn: 08-17', description: 'Økologisk bakeri med fantastisk surdeig.' },
      { id: 2, name: 'Hitchhiker', category: 'Bar', rating: 4.5, address: 'Sandakerveien 24', phone: '22 70 00 02', hours: 'Tir-Søn: 16-01', description: 'Craft øl og god stemning.' },
      { id: 3, name: 'Torshov Café', category: 'Kafé & Scene', rating: 4.6, address: 'Torshovgata 23', phone: '22 70 00 03', hours: 'Man-Søn: 11-01', description: 'Nabolagskafé med konserter og events.' },
      { id: 4, name: 'Kashmir Torshov', category: 'Restaurant', rating: 4.4, address: 'Sandakerveien 12', phone: '22 70 00 04', hours: 'Man-Søn: 14-23', description: 'Autentisk indisk mat.' },
    ],
    park: 'Torshovdalen',
  },
  'Tøyen': {
    events: [
      { id: 1, title: 'Grønlands Torg marked', date: '8', month: 'feb', time: '09:00 - 17:00', location: 'Grønlands Torg', description: 'Internasjonalt marked med mat og krydder fra hele verden.', organizer: 'Grønland BID', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Botanisk hage tur', date: '9', month: 'feb', time: '12:00', location: 'Botanisk hage', description: 'Guidet tur i Oslos flotteste hage.', organizer: 'Naturhistorisk museum', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Dattera til Hansen', description: 'Quiz med lokal vri.', organizer: 'Dattera til Hagen', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Klubbkveld', date: '14', month: 'feb', time: '23:00', location: 'Blå', description: 'DJ og dans til langt på natt.', organizer: 'Blå', price: '150 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Street art tur', date: '3', month: 'feb', time: '17:00', location: 'Tøyen T-bane', description: 'Guidet tur gjennom Tøyens street art.', organizer: 'Oslo Street Art', price: '200 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Matkurs', date: '4', month: 'feb', time: '18:00', location: 'Tøyen Torg', description: 'Lær å lage autentisk mat fra ulike kulturer.', organizer: 'Tøyen Unlimited', price: '450 kr', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Poesi-kveld', date: '6', month: 'feb', time: '19:00', location: 'Kulturhuset', description: 'Åpen scene for poesi og spoken word.', organizer: 'Kulturhuset', price: 'Gratis', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Tim Wendelboe', category: 'Kafé', rating: 4.9, address: 'Grüners gate 1', phone: '22 80 00 01', hours: 'Man-Fre: 08-18', description: 'Verdensberømt kaffebrenneri.' },
      { id: 2, name: 'Punjab Tandoori', category: 'Restaurant', rating: 4.6, address: 'Grønland 24', phone: '22 80 00 02', hours: 'Man-Søn: 12-23', description: 'Oslos beste indiske mat.' },
      { id: 3, name: 'Dattera til Hansen', category: 'Kafé', rating: 4.7, address: 'Grønland 10', phone: '22 80 00 03', hours: 'Man-Søn: 10-18', description: 'Trendy kafé i gammelt lokale.' },
      { id: 4, name: 'Habibi', category: 'Restaurant', rating: 4.5, address: 'Tøyengata 2', phone: '22 80 00 04', hours: 'Man-Søn: 11-22', description: 'Libanesisk streetfood.' },
    ],
    park: 'Botanisk hage',
  },
  'Nydalen': {
    events: [
      { id: 1, title: 'BI-marked', date: '8', month: 'feb', time: '10:00 - 15:00', location: 'BI Campus', description: 'Studentmarked med klær, bøker og mat.', organizer: 'BI Studentforening', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Søndagstur langs Akerselva', date: '9', month: 'feb', time: '11:00', location: 'Nydalen T-bane', description: 'Guidet tur langs elva til Mathallen.', organizer: 'Oslo Byes Vel', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Nydalen Bryggeri', description: 'Quiz og lokalt øl.', organizer: 'Nydalen Bryggeri', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Stand-up', date: '14', month: 'feb', time: '20:00', location: 'Comedy Box', description: 'Ny stand-up scene i Nydalen!', organizer: 'Comedy Box', price: '200 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'CrossFit', date: '3', month: 'feb', time: '06:30', location: 'CrossFit Nydalen', description: 'Start uken med hard trening.', organizer: 'CrossFit Nydalen', price: '200 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'After work', date: '4', month: 'feb', time: '17:00', location: 'Brygg Bar', description: 'Ukentlig after work med DJ.', organizer: 'Brygg Bar', price: 'Gratis', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Bokbad', date: '6', month: 'feb', time: '18:00', location: 'Cappelen Damm', description: 'Møt forfatteren bak ukens bok.', organizer: 'Cappelen Damm', price: 'Gratis', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Espresso House', category: 'Kafé', rating: 4.3, address: 'Nydalsveien 28', phone: '22 90 00 01', hours: 'Man-Fre: 07-19, Lør-Søn: 09-18', description: 'Skandinavisk kaffekjede.' },
      { id: 2, name: 'Nydalen Bryggeri', category: 'Bryggeri', rating: 4.6, address: 'Nydalsveien 15', phone: '22 90 00 02', hours: 'Tir-Lør: 15-01', description: 'Lokalt mikrobryggeri med pub.' },
      { id: 3, name: 'Asia House', category: 'Restaurant', rating: 4.4, address: 'Gullhaug Torg 5', phone: '22 90 00 03', hours: 'Man-Søn: 11-22', description: 'Asiatisk fusjon.' },
      { id: 4, name: 'Platekompaniet', category: 'Butikk', rating: 4.5, address: 'Nydalen Storsenter', phone: '22 90 00 04', hours: 'Man-Lør: 10-20', description: 'Vinyl, CD og merch.' },
    ],
    park: 'Akerselva',
  },
  'Bislett': {
    events: [
      { id: 1, title: 'Bislett Games', date: '8', month: 'feb', time: '18:00 - 22:00', location: 'Bislett Stadion', description: 'Internasjonalt friidrettsstevne med verdensstjerner.', organizer: 'Bislett Alliance', price: '350 kr', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Løpetrening', date: '9', month: 'feb', time: '10:00', location: 'Bislett Stadion', description: 'Åpen løpetrening for alle nivåer.', organizer: 'Bislett Løpeklubb', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Teddy\'s Soft Bar', description: 'Ukentlig quiz i legendarisk bar.', organizer: 'Teddy\'s', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Konsert', date: '14', month: 'feb', time: '21:00', location: 'Mono', description: 'Indie og alternativ rock.', organizer: 'Mono', price: '150 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Svømming', date: '3', month: 'feb', time: '07:00 - 08:00', location: 'Bislett Bad', description: 'Morgensvøm før jobb.', organizer: 'Bislett Bad', price: '80 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Kunstutstilling', date: '4', month: 'feb', time: '17:00', location: 'Kunstnernes Hus', description: 'Ny utstilling med samtidskunst.', organizer: 'Kunstnernes Hus', price: '100 kr', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Stand-up', date: '6', month: 'feb', time: '20:00', location: 'Latter', description: 'Norges beste stand-up scene.', organizer: 'Latter', price: '250 kr', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Teddy\'s Soft Bar', category: 'Bar', rating: 4.7, address: 'Pilestredet 49', phone: '22 41 00 01', hours: 'Man-Søn: 12-03', description: 'Legendarisk bar med rock\'n\'roll atmosfære.' },
      { id: 2, name: 'Kunstnernes Hus', category: 'Kunstgalleri', rating: 4.6, address: 'Wergelandsveien 17', phone: '22 41 00 02', hours: 'Tir-Søn: 11-17', description: 'Samtidskunst i historisk bygg.' },
      { id: 3, name: 'Delicatessen', category: 'Restaurant', rating: 4.5, address: 'Sofies gate 8', phone: '22 41 00 03', hours: 'Man-Søn: 17-01', description: 'Trendy restaurant med internasjonal meny.' },
      { id: 4, name: 'Liebling', category: 'Kafé', rating: 4.8, address: 'Pilestredet 59', phone: '22 41 00 04', hours: 'Man-Fre: 08-18, Lør-Søn: 10-17', description: 'Berliner-inspirert kafé med fantastisk kaffe.' },
    ],
    park: 'St. Hanshaugen',
  },
  'Grønland': {
    events: [
      { id: 1, title: 'Grønland Basar', date: '8', month: 'feb', time: '09:00 - 18:00', location: 'Grønland Torg', description: 'Daglig marked med mat fra hele verden.', organizer: 'Grønland BID', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Matfestival', date: '9', month: 'feb', time: '12:00 - 20:00', location: 'Grønland Kulturstasjon', description: 'Smak mat fra alle kontinenter.', organizer: 'Grønland Kulturstasjon', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Olympen', description: 'Quiz i Oslos eldste ølhall.', organizer: 'Olympen', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Klubbkveld', date: '14', month: 'feb', time: '23:00', location: 'The Villa', description: 'Elektronisk musikk og dans.', organizer: 'The Villa', price: '150 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Språkkafé', date: '3', month: 'feb', time: '17:00', location: 'Deichman Grønland', description: 'Øv norsk eller lær et nytt språk.', organizer: 'Deichman', price: 'Gratis', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Matkurs: Indisk', date: '4', month: 'feb', time: '18:00', location: 'Punjab Tandoori', description: 'Lær å lage autentisk indisk mat.', organizer: 'Punjab', price: '500 kr', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Poesikveld', date: '6', month: 'feb', time: '19:00', location: 'Dattera til Hansen', description: 'Åpen mikrofon for poesi.', organizer: 'Dattera', price: 'Gratis', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Punjab Tandoori', category: 'Restaurant', rating: 4.7, address: 'Grønland 24', phone: '22 17 00 01', hours: 'Man-Søn: 12-23', description: 'Oslos beste indiske - siden 1984.' },
      { id: 2, name: 'Olympen', category: 'Ølhall', rating: 4.6, address: 'Grønlandsleiret 15', phone: '22 17 00 02', hours: 'Man-Søn: 11-01', description: 'Historisk ølhall fra 1892.' },
      { id: 3, name: 'Dattera til Hansen', category: 'Kafé', rating: 4.5, address: 'Grønland 10', phone: '22 17 00 03', hours: 'Man-Søn: 09-18', description: 'Hipster-kafé i gammelt lokale.' },
      { id: 4, name: 'Grønland Frukt & Grønt', category: 'Butikk', rating: 4.4, address: 'Grønland 12', phone: '22 17 00 04', hours: 'Man-Søn: 08-21', description: 'Ferske råvarer fra hele verden.' },
    ],
    park: 'Middelalderparken',
  },
  'Løren': {
    events: [
      { id: 1, title: 'Løren Street Food', date: '8', month: 'feb', time: '12:00 - 20:00', location: 'Løren Torg', description: 'Street food marked med mat fra hele verden.', organizer: 'Løren Utvikling', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Yoga på taket', date: '9', month: 'feb', time: '10:00', location: 'SATS Løren', description: 'Utendørs yoga med utsikt.', organizer: 'SATS', price: 'Medlemskap', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Løren Bar', description: 'Quiz i det nye nabolaget.', organizer: 'Løren Bar', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Wine & Paint', date: '14', month: 'feb', time: '19:00', location: 'Løren Kunstverksted', description: 'Mal og nyt vin med venner.', organizer: 'Løren Kunst', price: '450 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Boot Camp', date: '3', month: 'feb', time: '06:30', location: 'Lørenskog Park', description: 'Tøff utendørs trening.', organizer: 'Løren PT', price: '150 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'After work', date: '4', month: 'feb', time: '17:00', location: 'Torggata Botaniske', description: 'Ukentlig after work.', organizer: 'Torggata Botaniske', price: 'Gratis', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Filmkveld', date: '6', month: 'feb', time: '19:00', location: 'Løren Kino', description: 'Ny film og popcorn.', organizer: 'Løren Kino', price: '150 kr', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Espresso House Løren', category: 'Kafé', rating: 4.4, address: 'Lørenveien 55', phone: '22 65 00 01', hours: 'Man-Fre: 07-19, Lør-Søn: 09-18', description: 'Moderne kaffebar.' },
      { id: 2, name: 'Løren Sushi', category: 'Restaurant', rating: 4.5, address: 'Løren Torg 2', phone: '22 65 00 02', hours: 'Man-Søn: 14-22', description: 'Fersk sushi og poke bowls.' },
      { id: 3, name: 'Vinmonopolet Løren', category: 'Vinmonopol', rating: 4.3, address: 'Løren Torg 5', phone: '22 65 00 03', hours: 'Man-Fre: 10-18, Lør: 10-16', description: 'Godt utvalg av vin og øl.' },
      { id: 4, name: 'Cutters Løren', category: 'Frisør', rating: 4.6, address: 'Lørenveien 60', phone: '22 65 00 04', hours: 'Man-Fre: 10-20, Lør: 10-18', description: 'Drop-in frisør.' },
    ],
    park: 'Lørenparken',
  },
  'Grefsen': {
    events: [
      { id: 1, title: 'Loppemarked', date: '8', month: 'feb', time: '10:00 - 15:00', location: 'Grefsen Skole', description: 'Stort loppemarked med kaffe og kaker.', organizer: 'Grefsen FAU', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Skitur i Grefsenkollen', date: '9', month: 'feb', time: '11:00', location: 'Grefsenkollen', description: 'Guidet skitur med flott utsikt.', organizer: 'Grefsen IL', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Grefsen Bistro', description: 'Ukentlig quiz med lokalhistorie.', organizer: 'Grefsen Bistro', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Jazz på Grefsenkollen', date: '14', month: 'feb', time: '19:00', location: 'Grefsenkollen Restaurant', description: 'Live jazz med utsikt over Oslo.', organizer: 'Grefsenkollen', price: '200 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Barnetrening', date: '3', month: 'feb', time: '17:00', location: 'Grefsen Stadion', description: 'Fotballtrening for barn.', organizer: 'Grefsen IL', price: 'Gratis', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Strikkekafé', date: '4', month: 'feb', time: '18:00', location: 'Grefsen Kafé', description: 'Ta med strikketøyet!', organizer: 'Grefsen Strikkeklubb', price: 'Gratis', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Bokkveld', date: '6', month: 'feb', time: '19:00', location: 'Deichman Grefsen', description: 'Forfatterbesøk og bokklubb.', organizer: 'Deichman', price: 'Gratis', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Grefsenkollen Restaurant', category: 'Restaurant', rating: 4.7, address: 'Grefsenkollveien 100', phone: '22 79 00 01', hours: 'Tir-Søn: 12-22', description: 'Fantastisk utsikt og god mat.' },
      { id: 2, name: 'Baker Hansen Grefsen', category: 'Bakeri', rating: 4.6, address: 'Grefsenveien 30', phone: '22 79 00 02', hours: 'Man-Lør: 07-17', description: 'Ferske bakervarer hver dag.' },
      { id: 3, name: 'Grefsen Bistro', category: 'Kafé', rating: 4.5, address: 'Grefsenveien 28', phone: '22 79 00 03', hours: 'Man-Søn: 10-22', description: 'Koselig nabolagsbistro.' },
      { id: 4, name: 'Grefsen Vin', category: 'Vinbar', rating: 4.4, address: 'Grefsenveien 25', phone: '22 79 00 04', hours: 'Ons-Lør: 16-23', description: 'Liten vinbar med godt utvalg.' },
    ],
    park: 'Grefsenkollen',
  },
  'Ullevål': {
    events: [
      { id: 1, title: 'Fotballkamp', date: '8', month: 'feb', time: '18:00', location: 'Ullevål Stadion', description: 'Se landslaget spille!', organizer: 'NFF', price: '300 kr', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Løpetur i Nordmarka', date: '9', month: 'feb', time: '10:00', location: 'Sognsvann', description: 'Ukentlig løpetur fra Sognsvann.', organizer: 'Ullevål Løpeklubb', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Ullevål Café', description: 'Quiz for studenter og naboer.', organizer: 'Ullevål Café', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Konsert', date: '14', month: 'feb', time: '20:00', location: 'Ullevål Stadion', description: 'Stor konsert på stadion.', organizer: 'Live Nation', price: '700 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Yoga', date: '3', month: 'feb', time: '07:00', location: 'Ullevål Yoga', description: 'Start uken med yoga.', organizer: 'Ullevål Yoga', price: '150 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Universitetskonsert', date: '4', month: 'feb', time: '19:00', location: 'UiO Blindern', description: 'Klassisk konsert med studentorkesteret.', organizer: 'UiO', price: '100 kr', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Filmklubb', date: '6', month: 'feb', time: '19:00', location: 'Blindern Kino', description: 'Ukentlig filmvisning.', organizer: 'Blindern Filmklubb', price: '50 kr', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Frederikke', category: 'Kafé', rating: 4.5, address: 'Blindern', phone: '22 85 50 01', hours: 'Man-Fre: 08-18', description: 'Studentkafé på Blindern.' },
      { id: 2, name: 'Tullins Café', category: 'Kafé', rating: 4.6, address: 'Tullinløkka 2', phone: '22 85 50 02', hours: 'Man-Fre: 08-17, Lør: 10-16', description: 'Koselig kafé ved Nasjonalgalleriet.' },
      { id: 3, name: 'Ullevål Restaurant', category: 'Restaurant', rating: 4.4, address: 'Ullevål Sykehus', phone: '22 85 50 03', hours: 'Man-Fre: 11-20', description: 'Restaurant ved sykehuset.' },
      { id: 4, name: 'Akademika', category: 'Bokhandel', rating: 4.3, address: 'Blindern', phone: '22 85 50 04', hours: 'Man-Fre: 09-17', description: 'Fagbøker og studentutstyr.' },
    ],
    park: 'Sognsvann',
  },
  'Lambertseter': {
    events: [
      { id: 1, title: 'Lørdagsmarked', date: '8', month: 'feb', time: '10:00 - 14:00', location: 'Lambertseter Senter', description: 'Lokalt marked med bakevarer og håndverk.', organizer: 'Lambertseter Vel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Tur i Østmarka', date: '9', month: 'feb', time: '11:00', location: 'Lambertseter T-bane', description: 'Guidet tur inn i Østmarka.', organizer: 'Lambertseter Turlag', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Lambertseter Pub', description: 'Ukentlig quiz for naboer.', organizer: 'Lambertseter Pub', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Kino for voksne', date: '14', month: 'feb', time: '19:00', location: 'Lambertseter Kino', description: 'Filmvisning med vinbar.', organizer: 'Lambertseter Kino', price: '150 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Seniortrening', date: '3', month: 'feb', time: '10:00', location: 'Lambertseter Bad', description: 'Vanngymnastikk for seniorer.', organizer: 'Lambertseter Bad', price: '80 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Strikkekafé', date: '4', month: 'feb', time: '17:00', location: 'Deichman Lambertseter', description: 'Strikk og prat med naboer.', organizer: 'Deichman', price: 'Gratis', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Familiekonsert', date: '6', month: 'feb', time: '17:00', location: 'Lambertseter Kirke', description: 'Konsert for hele familien.', organizer: 'Lambertseter Kirke', price: 'Gratis', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Baker Hansen', category: 'Bakeri', rating: 4.5, address: 'Lambertseter Senter', phone: '22 28 00 01', hours: 'Man-Lør: 07-17', description: 'Ferske bakervarer.' },
      { id: 2, name: 'Lambertseter Pizza', category: 'Restaurant', rating: 4.3, address: 'Cecilie Thoresens vei 15', phone: '22 28 00 02', hours: 'Man-Søn: 14-22', description: 'Lokal pizzafavoritt.' },
      { id: 3, name: 'Meny Lambertseter', category: 'Dagligvare', rating: 4.4, address: 'Lambertseter Senter', phone: '22 28 00 03', hours: 'Man-Lør: 08-21', description: 'Stort utvalg av mat.' },
      { id: 4, name: 'Lambertseter Frisør', category: 'Frisør', rating: 4.6, address: 'Lambertseter Senter', phone: '22 28 00 04', hours: 'Tir-Fre: 10-18, Lør: 09-15', description: 'Hyggelig nabolagsfrisør.' },
    ],
    park: 'Østmarka',
  },
  'Holmlia': {
    events: [
      { id: 1, title: 'Kulturfestival', date: '8', month: 'feb', time: '12:00 - 20:00', location: 'Holmlia Senter', description: 'Feiring av mangfold med mat, musikk og dans.', organizer: 'Holmlia Frivilligsentral', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Tur til Hvervenbukta', date: '9', month: 'feb', time: '11:00', location: 'Holmlia T-bane', description: 'Tur til badeplass ved fjorden.', organizer: 'Holmlia Turlag', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Holmlia Café', description: 'Quiz med internasjonalt preg.', organizer: 'Holmlia Café', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Hip-hop kveld', date: '14', month: 'feb', time: '20:00', location: 'Holmlia Ungdomshus', description: 'Lokal hip-hop og rap.', organizer: 'Holmlia Unge', price: '100 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Fotballtrening', date: '3', month: 'feb', time: '18:00', location: 'Holmlia Kunstgress', description: 'Åpen fotballtrening for voksne.', organizer: 'Holmlia SK', price: 'Gratis', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Matkurs', date: '4', month: 'feb', time: '17:00', location: 'Holmlia Frivilligsentral', description: 'Lær å lage mat fra Somalia.', organizer: 'Frivilligsentralen', price: '200 kr', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Åpen scene', date: '6', month: 'feb', time: '19:00', location: 'Holmlia Bibliotek', description: 'Vis frem talent - musikk, poesi, dans.', organizer: 'Deichman', price: 'Gratis', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Samosa House', category: 'Restaurant', rating: 4.6, address: 'Holmlia Senter', phone: '22 61 00 01', hours: 'Man-Søn: 11-21', description: 'Autentisk somalisk og indisk mat.' },
      { id: 2, name: 'Holmlia Bakeri', category: 'Bakeri', rating: 4.4, address: 'Holmlia Senter', phone: '22 61 00 02', hours: 'Man-Lør: 08-17', description: 'Ferske brød og kaker.' },
      { id: 3, name: 'Frisør Elegansen', category: 'Frisør', rating: 4.5, address: 'Holmlia Senter', phone: '22 61 00 03', hours: 'Man-Lør: 10-18', description: 'Frisør for alle hårtyper.' },
      { id: 4, name: 'Holmlia Treningssenter', category: 'Trening', rating: 4.3, address: 'Holmlia Senter', phone: '22 61 00 04', hours: 'Man-Søn: 06-23', description: 'Rimelig treningssenter.' },
    ],
    park: 'Hvervenbukta',
  },
  'Smestad': {
    events: [
      { id: 1, title: 'Lørdagsmarked', date: '8', month: 'feb', time: '10:00 - 14:00', location: 'Smestad Torg', description: 'Lokalt marked med ferske råvarer og bakevarer.', organizer: 'Smestad Vel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Søndagstur i Sørkedalen', date: '9', month: 'feb', time: '11:00', location: 'Smestad T-bane', description: 'Guidet tur inn i marka. Alle nivåer velkommen.', organizer: 'Smestad Turlag', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Smestad Kro', description: 'Ukentlig quiz med gode premier.', organizer: 'Smestad Kro', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Vinklubb', date: '14', month: 'feb', time: '19:00', location: 'Vinbaren Smestad', description: 'Månedlig vinsmaking med tema.', organizer: 'Smestad Vinklubb', price: '350 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Morgenyoga', date: '3', month: 'feb', time: '07:00 - 08:00', location: 'Smestad Yoga', description: 'Start uken med yoga.', organizer: 'Smestad Yoga', price: '150 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Bokklubb', date: '4', month: 'feb', time: '19:00', location: 'Deichman Smestad', description: 'Månedlig bokklubb - alle velkommen!', organizer: 'Deichman', price: 'Gratis', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Klassisk konsert', date: '6', month: 'feb', time: '19:00', location: 'Smestad Kirke', description: 'Kammermusikk i vakre omgivelser.', organizer: 'Smestad Kirke', price: '200 kr', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Baker Hansen Smestad', category: 'Kafé', rating: 4.7, address: 'Smestadveien 2', phone: '22 51 00 01', hours: 'Man-Fre: 07-17, Lør: 08-16', description: 'Tradisjonsrikt bakeri med ferske bakevarer og kaffe.' },
      { id: 2, name: 'Smestad Delikatesse', category: 'Matbutikk', rating: 4.6, address: 'Smestad Torg 5', phone: '22 51 00 02', hours: 'Man-Lør: 09-18', description: 'Ost, skinke, vin og delikatesser.' },
      { id: 3, name: 'Smestad Kro', category: 'Restaurant', rating: 4.5, address: 'Smestadveien 10', phone: '22 51 00 03', hours: 'Tir-Søn: 16-23', description: 'Klassisk norsk kro med god mat.' },
      { id: 4, name: 'Blomsten Smestad', category: 'Blomster', rating: 4.8, address: 'Smestad Torg 3', phone: '22 51 00 04', hours: 'Man-Fre: 09-17, Lør: 10-14', description: 'Vakre blomsterarrangementer.' },
    ],
    park: 'Sørkedalen',
  },
  'Kampen': {
    events: [
      { id: 1, title: 'Kampen Økologiske marked', date: '8', month: 'feb', time: '10:00 - 15:00', location: 'Kampen Park', description: 'Økologisk mat og lokale produsenter.', organizer: 'Kampen Vel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Yoga på gresset', date: '9', month: 'feb', time: '10:00', location: 'Kampen Park', description: 'Utendørs yoga i parken.', organizer: 'Kampen Yoga', price: '100 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Olympen', description: 'Klassisk quiz i historiske lokaler.', organizer: 'Olympen', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Konsert', date: '14', month: 'feb', time: '21:00', location: 'Kampen Bistro', description: 'Live akustisk musikk.', organizer: 'Kampen Bistro', price: 'Gratis', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Løpeklubb', date: '3', month: 'feb', time: '18:00', location: 'Kampen Park', description: 'Ukentlig løpetur med naboene.', organizer: 'Kampen Løpeklubb', price: 'Gratis', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Strikkekafé', date: '4', month: 'feb', time: '17:00', location: 'Café Kampen', description: 'Ta med strikketøyet og bli med!', organizer: 'Kampen Strikkeklubb', price: 'Gratis', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Kunstkveld', date: '6', month: 'feb', time: '18:00', location: 'Kampen Kunstgalleri', description: 'Åpning av ny utstilling med lokale kunstnere.', organizer: 'Kampen Kunst', price: 'Gratis', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Kampen Bistro', category: 'Kafé', rating: 4.7, address: 'Bøgata 21', phone: '22 85 00 01', hours: 'Man-Søn: 09-23', description: 'Nabolagsbistro med hage.' },
      { id: 2, name: 'Olympen', category: 'Restaurant', rating: 4.6, address: 'Grønlandsleiret 15', phone: '22 85 00 02', hours: 'Man-Søn: 11-01', description: 'Historisk ølhall siden 1892.' },
      { id: 3, name: 'Villa Paradiso', category: 'Restaurant', rating: 4.8, address: 'Olaf Ryes plass 8', phone: '22 85 00 03', hours: 'Man-Søn: 12-23', description: 'Autentisk napolitansk pizza.' },
      { id: 4, name: 'Tranen', category: 'Pub', rating: 4.4, address: 'Thorvald Meyers gate 2', phone: '22 85 00 04', hours: 'Man-Søn: 15-03', description: 'Klassisk nabolagspub.' },
    ],
    park: 'Kampen Park',
  },
  'Grünerløkka': {
    events: [
      { id: 1, title: 'Lørdagsmarked', date: '8', month: 'feb', time: '10:00 - 16:00', location: 'Birkelunden', description: 'Ukentlig marked med lokale produsenter, håndverkere og matboder.', organizer: 'Birkelunden Venner', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Yoga i parken', date: '9', month: 'feb', time: '11:00 - 12:00', location: 'Sofienbergparken', description: 'Drop-in yoga for alle nivåer.', organizer: 'Yoga Studio Løkka', price: '50 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Café Sara', description: 'Test kunnskapene dine i vår ukentlige quiz!', organizer: 'Café Sara', price: '100 kr', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Konsert', date: '14', month: 'feb', time: '21:00', location: 'Blå', description: 'Live musikk med lokale band.', organizer: 'Blå', price: '150 kr', contact: '955 66 777', dayIndex: 4 },
      { id: 5, title: 'Mandagsyoga', date: '3', month: 'feb', time: '18:00 - 19:00', location: 'Vulkan Arena', description: 'Start uken med yoga.', organizer: 'Vulkan Yoga', price: '100 kr', contact: '911 22 333', dayIndex: 0 },
      { id: 6, title: 'Åpen mikrofon', date: '4', month: 'feb', time: '20:00', location: 'Parkteatret', description: 'Kom og vis frem talentet ditt!', organizer: 'Parkteatret', price: 'Gratis', contact: '922 11 444', dayIndex: 1 },
      { id: 7, title: 'Bokkveld', date: '6', month: 'feb', time: '19:00', location: 'Deichman Grünerløkka', description: 'Forfattersamtale og signering.', organizer: 'Deichman', price: 'Gratis', contact: '933 22 555', dayIndex: 3 },
    ],
    businesses: [
      { id: 1, name: 'Tim Wendelboe', category: 'Kafé', rating: 4.9, address: 'Grüners gate 1', phone: '22 00 00 01', hours: 'Man-Fre: 08-18', description: 'Verdensberømt kaffebrenneri og kafé.' },
      { id: 2, name: 'Mathallen Oslo', category: 'Mathall', rating: 4.7, address: 'Vulkan 5', phone: '22 00 00 02', hours: 'Man-Søn: 10-20', description: 'Matmarked med over 30 spesialbutikker.' },
      { id: 3, name: 'Grünerløkka Brukskunst', category: 'Butikk', rating: 4.6, address: 'Markveien 56', phone: '22 00 00 03', hours: 'Man-Lør: 11-18', description: 'Design og interiør.' },
      { id: 4, name: 'Territoriet', category: 'Restaurant', rating: 4.5, address: 'Markveien 58', phone: '22 00 00 04', hours: 'Tir-Søn: 17-23', description: 'Moderne nordisk kjøkken.' },
    ],
    park: 'Sofienbergparken',
  },
  'Vestre Aker': {
    events: [
      { id: 1, title: 'Lørdagsmarked', date: '8', month: 'feb', time: '10:00 - 16:00', location: 'Røa torg', description: 'Ukentlig marked med lokale produsenter.', organizer: 'Røa Vel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Ski-tur', date: '9', month: 'feb', time: '10:00 - 14:00', location: 'Sognsvann', description: 'Guidet skitur i Nordmarka.', organizer: 'Vestre Aker Skilag', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Quiz-kveld', date: '12', month: 'feb', time: '19:00', location: 'Holmenkollen Restaurant', description: 'Ukentlig quiz med premier.', organizer: 'Holmenkollen Restaurant', price: '100 kr', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Konsert', date: '14', month: 'feb', time: '19:00', location: 'Vinderen Kirke', description: 'Klassisk konsert.', organizer: 'Vinderen Kirke', price: '200 kr', contact: '955 66 777', dayIndex: 4 },
    ],
    businesses: [
      { id: 1, name: 'Baker Hansen Røa', category: 'Bakeri', rating: 4.6, address: 'Røa senter', phone: '22 50 00 01', hours: 'Man-Lør: 07-17', description: 'Tradisjonsrikt bakeri med ferske bakervarer.' },
      { id: 2, name: 'Holmenkollen Restaurant', category: 'Restaurant', rating: 4.5, address: 'Holmenkollveien 119', phone: '22 50 00 02', hours: 'Man-Søn: 11-22', description: 'Restaurant med fantastisk utsikt.' },
      { id: 3, name: 'Vinderen Frisør', category: 'Frisør', rating: 4.7, address: 'Slemdalsveien 70', phone: '22 50 00 03', hours: 'Tir-Fre: 10-18', description: 'Moderne frisørsalong.' },
      { id: 4, name: 'Sognsvann Kiosk', category: 'Kafé', rating: 4.3, address: 'Sognsvann', phone: '22 50 00 04', hours: 'Man-Søn: 09-18', description: 'Kafé ved Sognsvann.' },
    ],
    park: 'Sognsvann',
  },
  'Frogner': {
    events: [
      { id: 1, title: 'Matfestival', date: '8', month: 'feb', time: '11:00 - 18:00', location: 'Frognerparken', description: 'Årlig matfestival med lokale restauranter.', organizer: 'Frogner Vel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Kunstutstilling', date: '9', month: 'feb', time: '12:00 - 17:00', location: 'Vigeland-museet', description: 'Spesialutstilling av Vigelands tegninger.', organizer: 'Vigeland-museet', price: '100 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Wine tasting', date: '12', month: 'feb', time: '19:00', location: 'Enoteca', description: 'Italiensk vinsmaking.', organizer: 'Enoteca', price: '350 kr', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Jazz-kveld', date: '14', month: 'feb', time: '20:00', location: 'Herr Nilsen', description: 'Live jazz.', organizer: 'Herr Nilsen', price: '150 kr', contact: '955 66 777', dayIndex: 4 },
    ],
    businesses: [
      { id: 1, name: 'Pascal Konditori', category: 'Konditori', rating: 4.8, address: 'Henrik Ibsens gate 36', phone: '22 55 00 01', hours: 'Man-Søn: 08-19', description: 'Fransk konditori og kafé.' },
      { id: 2, name: 'Frognerseteren', category: 'Restaurant', rating: 4.6, address: 'Holmenkollveien 200', phone: '22 55 00 02', hours: 'Man-Søn: 11-22', description: 'Tradisjonell norsk restaurant.' },
      { id: 3, name: 'Bygdøy Allé Frisør', category: 'Frisør', rating: 4.7, address: 'Bygdøy Allé 23', phone: '22 55 00 03', hours: 'Tir-Fre: 09-18', description: 'Eksklusiv frisørsalong.' },
      { id: 4, name: 'Blomsterverkstedet', category: 'Blomster', rating: 4.9, address: 'Frognerveien 12', phone: '22 55 00 04', hours: 'Man-Lør: 09-17', description: 'Eksklusive blomsterarrangementer.' },
    ],
    park: 'Frognerparken',
  },
  'Sagene': {
    events: [
      { id: 1, title: 'Loppemarked', date: '8', month: 'feb', time: '10:00 - 15:00', location: 'Sagene Samfunnshus', description: 'Stort loppemarked.', organizer: 'Sagene Vel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Treningsgruppe', date: '9', month: 'feb', time: '10:00 - 11:00', location: 'Voldsløkka', description: 'Gratis utendørs trening.', organizer: 'Sagene IF', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Stand-up', date: '12', month: 'feb', time: '20:00', location: 'Sagene Lunsjbar', description: 'Lokal stand-up kveld.', organizer: 'Sagene Lunsjbar', price: '100 kr', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Filmkveld', date: '14', month: 'feb', time: '19:00', location: 'Sagene Samfunnshus', description: 'Gratis filmvisning.', organizer: 'Sagene Filmklubb', price: 'Gratis', contact: '955 66 777', dayIndex: 4 },
    ],
    businesses: [
      { id: 1, name: 'Handwerk', category: 'Kafé', rating: 4.7, address: 'Arendalsgata 2', phone: '22 60 00 01', hours: 'Man-Fre: 08-17', description: 'Spesialkafé med håndbrygget kaffe.' },
      { id: 2, name: 'Sagene Lunsjbar', category: 'Restaurant', rating: 4.5, address: 'Sandakerveien 24', phone: '22 60 00 02', hours: 'Man-Søn: 11-22', description: 'Uformell lunsjbar og restaurant.' },
      { id: 3, name: 'ILA Brainnstorm', category: 'Bar', rating: 4.4, address: 'Uelands gate 61', phone: '22 60 00 03', hours: 'Ons-Søn: 16-01', description: 'Koselig nabolagsbar.' },
      { id: 4, name: 'Sagene Bad', category: 'Bad', rating: 4.6, address: 'Kierschows gate 3', phone: '22 60 00 04', hours: 'Man-Søn: 07-20', description: 'Offentlig svømmehall.' },
    ],
    park: 'Voldsløkka',
  },
  'Gamle Oslo': {
    events: [
      { id: 1, title: 'Matstreif', date: '8', month: 'feb', time: '11:00 - 20:00', location: 'Middelalderparken', description: 'Matfestival ved sjøen.', organizer: 'Gamle Oslo Bydel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Guidet tur', date: '9', month: 'feb', time: '13:00', location: 'Oslo Ladegård', description: 'Historisk byvandring.', organizer: 'Oslo Byes Vel', price: '50 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Konsert', date: '12', month: 'feb', time: '20:00', location: 'Rockefeller', description: 'Live rock.', organizer: 'Rockefeller', price: '300 kr', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Klubbkveld', date: '14', month: 'feb', time: '23:00', location: 'Jaeger', description: 'DJ og dans.', organizer: 'Jaeger', price: '150 kr', contact: '955 66 777', dayIndex: 4 },
    ],
    businesses: [
      { id: 1, name: 'Olympen', category: 'Restaurant', rating: 4.6, address: 'Grønlandsleiret 15', phone: '22 70 00 01', hours: 'Man-Søn: 11-01', description: 'Historisk ølhall og restaurant.' },
      { id: 2, name: 'Punjab Tandoori', category: 'Restaurant', rating: 4.5, address: 'Grønland 24', phone: '22 70 00 02', hours: 'Man-Søn: 14-23', description: 'Autentisk indisk mat.' },
      { id: 3, name: 'Dattera til Hansen', category: 'Kafé', rating: 4.7, address: 'Grønland 10', phone: '22 70 00 03', hours: 'Man-Søn: 10-18', description: 'Moderne kafé i gammel bygning.' },
      { id: 4, name: 'Grønland Basar', category: 'Marked', rating: 4.3, address: 'Grønlandstorget', phone: '22 70 00 04', hours: 'Man-Lør: 09-18', description: 'Internasjonalt matmarked.' },
    ],
    park: 'Middelalderparken',
  },
  'St. Hanshaugen': {
    events: [
      { id: 1, title: 'Piknik', date: '8', month: 'feb', time: '12:00 - 16:00', location: 'St. Hanshaugen park', description: 'Felles piknik i parken.', organizer: 'St. Hanshaugen Vel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Morgenyoga', date: '9', month: 'feb', time: '08:00 - 09:00', location: 'St. Hanshaugen park', description: 'Yoga ved utsiktspunktet.', organizer: 'Haugen Yoga', price: '80 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Quiz', date: '12', month: 'feb', time: '19:00', location: 'Åpent Bakeri', description: 'Pub quiz.', organizer: 'Åpent Bakeri', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Akevitt-smaking', date: '14', month: 'feb', time: '19:00', location: 'Oslovelo', description: 'Norsk akevittsmaking.', organizer: 'Oslovelo', price: '250 kr', contact: '955 66 777', dayIndex: 4 },
    ],
    businesses: [
      { id: 1, name: 'Åpent Bakeri', category: 'Bakeri', rating: 4.8, address: 'Waldemar Thranes gate 49', phone: '22 80 00 01', hours: 'Man-Søn: 07-18', description: 'Kjent for surdeigsbrød.' },
      { id: 2, name: 'Smalhans', category: 'Restaurant', rating: 4.7, address: 'Ullevålsveien 43', phone: '22 80 00 02', hours: 'Tir-Lør: 17-23', description: 'Moderne norsk smårettskonsept.' },
      { id: 3, name: 'Brutus', category: 'Bar', rating: 4.5, address: 'Thereses gate 35', phone: '22 80 00 03', hours: 'Ons-Søn: 17-01', description: 'Vinbar og restaurant.' },
      { id: 4, name: 'Fru Hagen', category: 'Kafé', rating: 4.4, address: 'Thorvald Meyers gate 40', phone: '22 80 00 04', hours: 'Man-Søn: 10-01', description: 'Bohemsk kafé og bar.' },
    ],
    park: 'St. Hanshaugen park',
  },
  'Nordre Aker': {
    events: [
      { id: 1, title: 'Parkrun', date: '8', month: 'feb', time: '09:00', location: 'Torshovdalen', description: 'Gratis 5km løp hver lørdag.', organizer: 'Parkrun Norge', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Barneteater', date: '9', month: 'feb', time: '12:00', location: 'Nydalen Kulturhus', description: 'Teater for de minste.', organizer: 'Nydalen Kulturhus', price: '80 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Pub quiz', date: '12', month: 'feb', time: '19:00', location: 'Justisen', description: 'Ukentlig quiz.', organizer: 'Justisen', price: '50 kr', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Kunstutstilling', date: '14', month: 'feb', time: '11:00 - 16:00', location: 'BI Galleri', description: 'Studentkunst.', organizer: 'BI', price: 'Gratis', contact: '955 66 777', dayIndex: 4 },
    ],
    businesses: [
      { id: 1, name: 'Stockfleths Nydalen', category: 'Kafé', rating: 4.5, address: 'Nydalsveien 28', phone: '22 90 00 01', hours: 'Man-Fre: 07-18', description: 'Kvalitetskaffe i Nydalen.' },
      { id: 2, name: 'Tranen', category: 'Restaurant', rating: 4.6, address: 'Thorvald Meyers gate 2', phone: '22 90 00 02', hours: 'Man-Søn: 15-01', description: 'Klassisk ølstue og restaurant.' },
      { id: 3, name: 'Friskis & Svettis', category: 'Treningssenter', rating: 4.4, address: 'Nydalsveien 33', phone: '22 90 00 03', hours: 'Man-Søn: 06-23', description: 'Rimelig treningssenter.' },
      { id: 4, name: 'Ullevål Hageby Bakeri', category: 'Bakeri', rating: 4.7, address: 'Damplassen 2', phone: '22 90 00 04', hours: 'Man-Lør: 07-17', description: 'Lokalt bakeri.' },
    ],
    park: 'Torshovdalen',
  },
  'Ullern': {
    events: [
      { id: 1, title: 'Tennis-turnering', date: '8', month: 'feb', time: '10:00', location: 'Ullern Tennisklubb', description: 'Åpen turnering.', organizer: 'Ullern TK', price: '200 kr', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Søndagsbrunch', date: '9', month: 'feb', time: '11:00 - 14:00', location: 'Skøyen Gård', description: 'Brunch med utsikt.', organizer: 'Skøyen Gård', price: '350 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Bokkveld', date: '12', month: 'feb', time: '19:00', location: 'Ullern Bibliotek', description: 'Forfatterbesøk.', organizer: 'Deichman', price: 'Gratis', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Filmvisning', date: '14', month: 'feb', time: '18:00', location: 'Colosseum Kino', description: 'Valentines filmkveld.', organizer: 'SF Kino', price: '150 kr', contact: '955 66 777', dayIndex: 4 },
    ],
    businesses: [
      { id: 1, name: 'Skøyen Gård', category: 'Restaurant', rating: 4.5, address: 'Hoffsveien 48', phone: '22 51 00 01', hours: 'Tir-Søn: 11-22', description: 'Historisk gård med restaurant.' },
      { id: 2, name: 'Colosseum Kino', category: 'Kino', rating: 4.7, address: 'Fridtjof Nansens vei 6', phone: '22 51 00 02', hours: 'Varierer', description: 'Europas største kino.' },
      { id: 3, name: 'CC Vest', category: 'Kjøpesenter', rating: 4.3, address: 'Lilleakerveien 16', phone: '22 51 00 03', hours: 'Man-Lør: 10-21', description: 'Kjøpesenter på Lilleaker.' },
      { id: 4, name: 'Bogstadveien Bakeri', category: 'Bakeri', rating: 4.6, address: 'Bogstadveien 54', phone: '22 51 00 04', hours: 'Man-Lør: 07-18', description: 'Tradisjonelt bakeri.' },
    ],
    park: 'Bestumkilen',
  },
  'Sentrum': {
    events: [
      { id: 1, title: 'Bondens marked', date: '8', month: 'feb', time: '10:00 - 16:00', location: 'Youngstorget', description: 'Ferske råvarer direkte fra bonden.', organizer: 'Bondens Marked', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Omvisning', date: '9', month: 'feb', time: '14:00', location: 'Nasjonalgalleriet', description: 'Guidet tur.', organizer: 'Nasjonalmuseet', price: '120 kr', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Stand-up', date: '12', month: 'feb', time: '20:00', location: 'Latter', description: 'Norges beste komikere.', organizer: 'Latter', price: '300 kr', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Teater', date: '14', month: 'feb', time: '19:00', location: 'Nationaltheatret', description: 'Ibsen-forestilling.', organizer: 'Nationaltheatret', price: '400 kr', contact: '955 66 777', dayIndex: 4 },
    ],
    businesses: [
      { id: 1, name: 'Fuglen', category: 'Kafé', rating: 4.8, address: 'Universitetsgata 2', phone: '22 10 00 01', hours: 'Man-Søn: 08-23', description: 'Ikonisk kafé og cocktailbar.' },
      { id: 2, name: 'Ekebergrestauranten', category: 'Restaurant', rating: 4.6, address: 'Kongsveien 15', phone: '22 10 00 02', hours: 'Tir-Søn: 11-22', description: 'Restaurant med panoramautsikt.' },
      { id: 3, name: 'Oslo City', category: 'Kjøpesenter', rating: 4.2, address: 'Stenersgata 1', phone: '22 10 00 03', hours: 'Man-Lør: 10-21', description: 'Sentralt kjøpesenter.' },
      { id: 4, name: 'Theatercaféen', category: 'Restaurant', rating: 4.7, address: 'Stortingsgata 24', phone: '22 10 00 04', hours: 'Man-Søn: 11-23', description: 'Klassisk wiener-kafé.' },
    ],
    park: 'Slottsparken',
  },
  'Nordstrand': {
    events: [
      { id: 1, title: 'Bading', date: '8', month: 'feb', time: '10:00 - 16:00', location: 'Hvervenbukta', description: 'Vinterbad for de tøffe.', organizer: 'Nordstrand Vel', price: 'Gratis', contact: '922 33 444', dayIndex: 5 },
      { id: 2, title: 'Familietur', date: '9', month: 'feb', time: '11:00', location: 'Ekebergskogen', description: 'Guidet naturtur.', organizer: 'DNT Oslo', price: 'Gratis', contact: '933 44 555', dayIndex: 6 },
      { id: 3, title: 'Quiz', date: '12', month: 'feb', time: '19:00', location: 'Ljan Kafé', description: 'Lokalquiz.', organizer: 'Ljan Kafé', price: '50 kr', contact: '944 55 666', dayIndex: 2 },
      { id: 4, title: 'Konsert', date: '14', month: 'feb', time: '19:00', location: 'Nordstrand Kirke', description: 'Korkonsert.', organizer: 'Nordstrand Kirke', price: 'Gratis', contact: '955 66 777', dayIndex: 4 },
    ],
    businesses: [
      { id: 1, name: 'Nordstrand Bakeri', category: 'Bakeri', rating: 4.6, address: 'Nordstrandveien 59', phone: '22 75 00 01', hours: 'Man-Lør: 07-17', description: 'Tradisjonsrikt bakeri.' },
      { id: 2, name: 'Sæterkroa', category: 'Restaurant', rating: 4.5, address: 'Sæterveien 2', phone: '22 75 00 02', hours: 'Man-Søn: 15-22', description: 'Koselig kro i Nordstrandskogen.' },
      { id: 3, name: 'Ljan Treningssenter', category: 'Trening', rating: 4.4, address: 'Ljansbakken 4', phone: '22 75 00 03', hours: 'Man-Søn: 06-23', description: 'Lokalt treningssenter.' },
      { id: 4, name: 'Ekebergparken', category: 'Park', rating: 4.8, address: 'Kongsveien 23', phone: '22 75 00 04', hours: 'Alltid åpen', description: 'Skulpturpark med utsikt.' },
    ],
    park: 'Ekebergparken',
  },
};

// Bydels-informasjon for Alt om-skjermen
const DISTRICT_INFO = {
  'Grünerløkka': {
    historie: {
      title: 'Grünerløkkas historie',
      content: 'Grünerløkka ble oppkalt etter gårdseier Balthazar Grüner som eide området på 1600-tallet. Bydelen utviklet seg som arbeiderstrøk på 1800-tallet med tekstilfabrikker langs Akerselva. Etter byfornyelsen på 1980-90-tallet ble området transformert til et trendy kultursentrum.',
      highlights: ['Akerselvas industri fra 1840', 'Byfornyelse 1980-1990', 'Kunstnermiljø på 2000-tallet'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['11 - Majorstuen-Kjelsås', '12 - Majorstuen-Disen', '13 - Bekkestua-Lilleaker'],
      buss: ['34 - Tonsenhagen-Sentrum', '54 - Kjelsås-Sentrum', '37 - Nydalen-Helsfyr'],
      tbane: ['Grünerløkka mangler T-bane, nærmeste: Carl Berners plass (linje 4/5)'],
      bysykkel: ['Birkelunden', 'Olaf Ryes plass', 'Grüners gate', 'Sofienbergparken'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'Sofienbergparken', desc: 'Stor bypark med lekeplass, ballbane og sommerscene', address: 'Sofienberggata' },
        { name: 'Birkelunden', desc: 'Historisk park med lørdagsmarked og kulturarrangementer', address: 'Grüners gate' },
        { name: 'Olaf Ryes plass', desc: 'Livlig torg med kafeer og uteservering', address: 'Olaf Ryes plass' },
        { name: 'Paulus kirkegård', desc: 'Fredelig grøntområde ved Paulus kirke', address: 'Thorvald Meyers gate' },
      ],
    },
    uteliv: {
      title: 'Uteliv på Løkka',
      barer: ['Blå - Brenneriveien 9', 'Parkteatret Bar - Olaf Ryes plass 11', 'Crowbar - Torggata 32'],
      klubber: ['Blå (klubbkvelder)', 'The Villa (nærliggende)', 'Jaeger (nærliggende)'],
      vinstuer: ['Territoriet - Markveien 58', 'Brutus - Thorvald Meyers gate 26'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['Grünerløkka legesenter - Thorvald Meyers gate 59', 'Markveien legekontor - Markveien 35'],
      apotek: ['Apotek 1 Grünerløkka - Thorvald Meyers gate 53', 'Vitusapotek Mathallen - Vulkan 5'],
      tannlege: ['Løkka Tannklinikk - Markveien 28'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
  'Vestre Aker': {
    historie: {
      title: 'Vestre Akers historie',
      content: 'Vestre Aker var opprinnelig et landbruksområde som ble innlemmet i Oslo i 1948. Området ble kjent for sine villastrøk og tilgang til Nordmarka. Holmenkollen skibakke, bygget i 1892, satte bydelen på verdenskartet.',
      highlights: ['Holmenkollen fra 1892', 'Innlemmet i Oslo 1948', 'Frognerseterens turistattraksjon'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['1 - Holmenkollen-Sentrum (Holmenkollbanen)'],
      buss: ['41 - Røa-Sentrum', '46 - Smestad-Makrellbekken'],
      tbane: ['Røa (linje 2)', 'Holmenkollen (linje 1)', 'Vinderen (linje 1)'],
      bysykkel: ['Sognsvann (sesongbasert)'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'Sognsvann', desc: 'Populært turområde med badeplass og skiløyper', address: 'Sognsveien' },
        { name: 'Nordmarka', desc: 'Oslos store skogsområde for friluftsliv', address: 'Nord for Sognsvann' },
        { name: 'Holmenkollen', desc: 'Skimuseum og utsiktspunkt', address: 'Holmenkollveien' },
        { name: 'Bogstad Gård', desc: 'Historisk herregård med park', address: 'Sørkedalsveien 826' },
      ],
    },
    uteliv: {
      title: 'Uteliv i Vestre Aker',
      barer: ['Holmenkollen Restaurant Bar', 'Frognerseteren (nærliggende)', 'Røa Pub'],
      klubber: ['Majorstuen/Sentrum for klubber'],
      vinstuer: ['Vinderen Vinbar', 'Bogstad Gård'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['Vinderen legesenter - Slemdalsveien 72', 'Røa legekontor - Vækerøveien 207'],
      apotek: ['Apotek 1 Røa - Røa senter', 'Vitusapotek Vinderen - Slemdalsveien 70'],
      tannlege: ['Vinderen Tannhelse - Slemdalsveien 64'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
  'Frogner': {
    historie: {
      title: 'Frogners historie',
      content: 'Frogner har vært et fasjonabelt strøk siden 1800-tallet. Frognerparken med Vigelandsanlegget åpnet i 1940 og er blitt Norges mest besøkte attraksjon. Bydelen er kjent for ambassader, herskapelige bygårder og eksklusive boligområder.',
      highlights: ['Vigelandsanlegget 1940', 'Diplomatstrøk', 'Bygdøy kongsgård'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['12 - Majorstuen-Disen', '19 - Ljabru-Majorstuen'],
      buss: ['30 - Bygdøy', '31 - Snarøya-Fornebu'],
      tbane: ['Majorstuen (alle linjer)', 'Frogner plass (linje 2)'],
      bysykkel: ['Frognerparken', 'Majorstuen', 'Solli plass', 'Bygdøy allé'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'Frognerparken', desc: 'Vigelandsanlegget med 200+ skulpturer', address: 'Kirkeveien' },
        { name: 'Bygdøy', desc: 'Halvøy med museer og badestrender', address: 'Bygdøy' },
        { name: 'Frognerstranda', desc: 'Populær badeplass om sommeren', address: 'Frognerstranda' },
        { name: 'Slottsparken vest', desc: 'Kongelig park nær sentrum', address: 'Drammensveien' },
      ],
    },
    uteliv: {
      title: 'Uteliv på Frogner',
      barer: ['Lorry - Parkveien 12', 'Palace Grill - Solli plass', 'Dinner - Stortingsgata 22'],
      klubber: ['Sentrum for klubber', 'The Villa (nærliggende)'],
      vinstuer: ['Enoteca - Solli plass', 'Wine Bar - Bygdøy allé'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['Frogner legesenter - Frognerveien 2', 'Majorstuen medisinske - Bogstadveien 27'],
      apotek: ['Apotek 1 Majorstuen - Bogstadveien 64', 'Vitusapotek Frogner - Frognerveien 10'],
      tannlege: ['Tannlegene på Frogner - Henrik Ibsens gate 100'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
  'Sagene': {
    historie: {
      title: 'Sagenes historie',
      content: 'Sagene fikk navnet fra sagbrukene langs Akerselva. På 1800-tallet var området et industrisentrum med tekstilfabrikker. Sagene bad, bygget i 1899, er et av Norges fineste jugend-bad og fortsatt i drift.',
      highlights: ['Sagbruk fra 1600-tallet', 'Industri på 1800-tallet', 'Sagene Bad fra 1899'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['11 - Majorstuen-Kjelsås', '12 - Majorstuen-Disen'],
      buss: ['37 - Nydalen-Helsfyr', '54 - Kjelsås-Jernbanetorget'],
      tbane: ['Storo (linje 4/5)', 'Nydalen (linje 4/5)'],
      bysykkel: ['Sagene', 'Torshov', 'Bjølsen', 'Sandaker'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'Voldsløkka', desc: 'Stor idrettspark med fotballbaner', address: 'Nils Bays vei' },
        { name: 'Myraløkka', desc: 'Barnvennlig park ved Akerselva', address: 'Bentsebrugata' },
        { name: 'Akerselva', desc: 'Turvei langs elva gjennom bydelen', address: 'Langs Akerselva' },
        { name: 'Bjølsenparken', desc: 'Rolig nabolagspark', address: 'Moldegata' },
      ],
    },
    uteliv: {
      title: 'Uteliv på Sagene',
      barer: ['Tilt - Sandakerveien 24', 'ILA Brainnstorm - Uelands gate', 'Sagene Lunsjbar'],
      klubber: ['Løkka/Sentrum for klubber'],
      vinstuer: ['Handwerk - Arendalsgata 2'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['Sagene legesenter - Arendalsgata 4', 'Torshov legekontor - Vogts gate 50'],
      apotek: ['Vitusapotek Sagene - Arendalsgata 6'],
      tannlege: ['Sagene Tannhelse - Arendalsgata 2'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
  'Gamle Oslo': {
    historie: {
      title: 'Gamle Oslos historie',
      content: 'Gamle Oslo er Oslos historiske kjerne. Her lå middelalderens Oslo før byen brant i 1624 og ble flyttet til Christiania. Middelalderparken bevarer ruinene av den gamle byen, inkludert Oslo Ladegård og Mariakirken.',
      highlights: ['Middelalder-Oslo', 'Bybrannen 1624', 'Oslo Ladegård fra 1200-tallet'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['18 - Holtet-Rikshospitalet', '19 - Ljabru-Majorstuen'],
      buss: ['34 - Tonsenhagen-Helsfyr', '37 - Nydalen-Helsfyr', '60 - Tonsenhagen-Oslo S'],
      tbane: ['Grønland (linje 1-5)', 'Tøyen (linje 1-5)', 'Ensjø (linje 3)'],
      bysykkel: ['Oslo S', 'Grønland', 'Tøyen', 'Kampen'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'Middelalderparken', desc: 'Historisk park med ruiner fra gamlebyen', address: 'Bispegata' },
        { name: 'Tøyenparken', desc: 'Stor bypark med badeland og Munchmuseet', address: 'Tøyengata' },
        { name: 'Botanisk hage', desc: 'Universitetets hage med 7500 plantearter', address: 'Sars gate 1' },
        { name: 'Kampen park', desc: 'Idyllisk nabolagspark', address: 'Norderhovsgata' },
      ],
    },
    uteliv: {
      title: 'Uteliv i Gamle Oslo',
      barer: ['Olympen - Grønlandsleiret 15', 'Café Con Bar - Grønland', 'Grünerløkka nærliggende'],
      klubber: ['Blå - Brenneriveien 9', 'The Villa - Møllergata', 'Jaeger - Grensen'],
      vinstuer: ['Dattera til Hansen - Grønland 10', 'Brutus (nærliggende)'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['Grønland legesenter - Grønlandsleiret 39', 'Tøyen legekontor - Kolstadgata 1'],
      apotek: ['Apotek 1 Grønland - Grønlandsleiret 14', 'Vitusapotek Tøyen - Tøyengata 2'],
      tannlege: ['Tøyen Tannklinikk - Tøyengata 53'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
  'St. Hanshaugen': {
    historie: {
      title: 'St. Hanshaugens historie',
      content: 'St. Hanshaugen park ble anlagt i 1879 og var en av Norges første offentlige parker. Området utviklet seg fra landbruk til boligstrøk på 1800-tallet. Vannbassenget på toppen gir spektakulær utsikt over Oslo.',
      highlights: ['Parken fra 1879', 'Vannbassenget som utsiktspunkt', 'Hageby-arkitektur'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['11 - Majorstuen-Kjelsås', '17 - Rikshospitalet-Grefsen'],
      buss: ['37 - Nydalen-Helsfyr'],
      tbane: ['Ullevål stadion (linje 4/5)', 'Bislett (planlagt)'],
      bysykkel: ['St. Hanshaugen', 'Bislett', 'Adamstuen', 'Ullevål'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'St. Hanshaugen park', desc: 'Historisk park med utsiktstårn', address: 'Colletts gate' },
        { name: 'Bislett stadion', desc: 'Idrettsanlegg med historie', address: 'Bislett' },
        { name: 'Geitmyra skolehager', desc: 'Skolehager for barn', address: 'Geitmyrsveien' },
        { name: 'Ullevål Hageby', desc: 'Idyllisk hageby-område', address: 'John Colletts allé' },
      ],
    },
    uteliv: {
      title: 'Uteliv på Haugen',
      barer: ['Teddy\'s Soft Bar - Pilestredet', 'Pigalle - Grensen', 'Kunstnernes Hus Bar'],
      klubber: ['Mono - Pløens gate', 'Sentrum for klubber'],
      vinstuer: ['Delicatessen - Sofies gate', 'Smalhans - Ullevålsveien'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['Pilestredet legesenter - Pilestredet 56', 'Ullevål legekontor - Ullevålsveien 3'],
      apotek: ['Apotek 1 Bislett - Therese gate 5', 'Vitusapotek Ullevål - Ullevålsveien 1'],
      tannlege: ['Bislett Tannklinikk - Bislett gate 12'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
  'Nordre Aker': {
    historie: {
      title: 'Nordre Akers historie',
      content: 'Nordre Aker var et landbruksområde frem til tidlig 1900-tall. BI (Handelshøyskolen) etablerte seg i Nydalen i 2005. Området har gjennomgått stor transformasjon fra industri til moderne bolig- og næringsområde.',
      highlights: ['Ullevål sykehus fra 1887', 'Nydalen transformasjon 2000-tallet', 'BI Campus fra 2005'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['11 - Majorstuen-Kjelsås', '12 - Majorstuen-Disen'],
      buss: ['25 - Majorstuen-Løren', '54 - Kjelsås-Jernbanetorget'],
      tbane: ['Nydalen (linje 4/5)', 'Storo (linje 4/5)', 'Ullevål stadion (linje 4/5)'],
      bysykkel: ['Nydalen', 'Storo', 'Ullevål stadion', 'Torshovdalen'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'Torshovdalen', desc: 'Stor park med løkker og lekeplass', address: 'Sandakerveien' },
        { name: 'Grefsenåsen', desc: 'Turområde med utsikt over Oslo', address: 'Grefsenveien' },
        { name: 'Korsvoll', desc: 'Rolig grøntområde', address: 'Korsvollbakken' },
        { name: 'Ullevål hageby', desc: 'Idyllisk hageby', address: 'John Colletts allé' },
      ],
    },
    uteliv: {
      title: 'Uteliv i Nordre Aker',
      barer: ['Nydalen Bryggeri', 'Grefsenkollen Restaurant Bar', 'Torshov Café (nærliggende)'],
      klubber: ['Sentrum/Løkka for klubber'],
      vinstuer: ['Grefsen Vin', 'Vulkan Vinbar (nærliggende)'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['Nydalen legesenter - Nydalsveien 36', 'Grefsen legekontor - Grefsenveien 28'],
      apotek: ['Vitusapotek Nydalen - Nydalsveien 28', 'Apotek 1 Storo - Storo Storsenter'],
      tannlege: ['Nydalen Tannhelse - Nydalsveien 32'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
  'Ullern': {
    historie: {
      title: 'Ullerns historie',
      content: 'Ullern var et jordbruksområde som ble en del av Oslo i 1948. Lilleaker utviklet seg som industriområde med Lilleborg fabrikker. I dag er bydelen kjent for villastrøk, Colosseum kino og CC Vest kjøpesenter.',
      highlights: ['Lilleaker fabrikker', 'Colosseum kino fra 1928', 'Innlemmet i Oslo 1948'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['13 - Lilleaker-Bekkestua'],
      buss: ['25 - Majorstuen-Skøyen', '28 - Fornebu-Sentrum'],
      tbane: ['Montebello (linje 2)', 'Ullernåsen (linje 2)', 'Lilleaker (linje 2)'],
      bysykkel: ['Skøyen', 'Lilleaker'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'Bestumkilen', desc: 'Fjordområde med tursti', address: 'Bestumkilen' },
        { name: 'Ullernåsen', desc: 'Skogsområde med turstier', address: 'Ullernåsen' },
        { name: 'Hoff parken', desc: 'Lokal park med lekeplass', address: 'Hoffsveien' },
        { name: 'Vækerøparken', desc: 'Grøntområde ved fjorden', address: 'Vækerøveien' },
      ],
    },
    uteliv: {
      title: 'Uteliv i Ullern',
      barer: ['CC Vest - Lilleaker', 'Majorstuen (nærliggende)'],
      klubber: ['Sentrum for klubber'],
      vinstuer: ['Majorstuen vinbarer (nærliggende)'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['Ullern legesenter - Ullernchausseen 64', 'Skøyen legekontor - Hoffsveien 10'],
      apotek: ['Apotek 1 CC Vest - Lilleakerveien 16', 'Vitusapotek Skøyen - Karenslyst allé 12'],
      tannlege: ['Ullern Tannklinikk - Ullernchausseen 62'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
  'Sentrum': {
    historie: {
      title: 'Oslo Sentrums historie',
      content: 'Oslo sentrum har vært byens hjerte siden Christiania ble grunnlagt i 1624 etter bybrannen. Karl Johans gate, oppkalt etter Kong Karl Johan, ble hovedgaten på 1800-tallet. Nationaltheatret og Stortinget representerer byens kulturelle og politiske tyngdepunkt.',
      highlights: ['Christiania grunnlagt 1624', 'Karl Johans gate', 'Stortinget fra 1866'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['Alle trikkelinjer passerer sentrum'],
      buss: ['Alle regionbusser', 'Flybussen', 'Nattbusser'],
      tbane: ['Nationaltheatret (alle linjer)', 'Stortinget (alle linjer)', 'Jernbanetorget (alle linjer)'],
      bysykkel: ['Aker Brygge', 'Rådhusplassen', 'Karl Johan', 'Oslo S', 'Nationaltheatret'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'Slottsparken', desc: 'Kongelig park rundt Slottet', address: 'Slottsplassen' },
        { name: 'Aker Brygge', desc: 'Havnepromenade med utsikt', address: 'Aker Brygge' },
        { name: 'Rådhusplassen', desc: 'Sentral plass ved fjorden', address: 'Rådhusplassen' },
        { name: 'Studenterlunden', desc: 'Park ved Nationaltheatret', address: 'Karl Johans gate' },
      ],
    },
    skoler: {
      title: 'Skoler og utdanning',
      grunnskoler: ['Oslo International School', 'Ruseløkka skole'],
      vgs: ['Oslo Katedralskole', 'Hartvig Nissens skole'],
      barnehager: ['Sentrum barnehage', 'Vika barnehage'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['City legesenter - Akersgata 55', 'Sentrum legekontor - Stortingsgata 10'],
      apotek: ['Vitusapotek Oslo City', 'Apotek 1 Byporten', 'Apotek 1 Karl Johan'],
      tannlege: ['Oslo Tannklinikk - Karl Johans gate 25'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
  'Nordstrand': {
    historie: {
      title: 'Nordstrands historie',
      content: 'Nordstrand var et landbruksområde som ble del av Oslo i 1948. Bydelen er kjent for Ekebergåsen med skulpturpark og utsikt over Oslo. Hvervenbukta og Ljan er populære badeområder. Bydelen har bevart mye av sitt grønne preg.',
      highlights: ['Ekebergskråningen', 'Innlemmet i Oslo 1948', 'Skulpturpark fra 2013'],
    },
    transport: {
      title: 'Kollektivtransport',
      trikk: ['18 - Holtet-Rikshospitalet', '19 - Ljabru-Majorstuen'],
      buss: ['79 - Ljabru-Sentrum', '83 - Nordstrand-Sentrum'],
      tbane: ['Nordstrand (linje 3)', 'Ljan (linje 3)', 'Holtet (linje 3)'],
      bysykkel: ['Nordstrand stasjon', 'Ekebergparken'],
    },
    parker: {
      title: 'Parker og grøntområder',
      list: [
        { name: 'Ekebergparken', desc: 'Skulpturpark med panoramautsikt', address: 'Kongsveien 23' },
        { name: 'Ekebergskogen', desc: 'Turområde med historie', address: 'Ekebergveien' },
        { name: 'Hvervenbukta', desc: 'Populær badeplass', address: 'Hvervenbukta' },
        { name: 'Ljanselva', desc: 'Naturreservat langs elva', address: 'Ljanselva' },
      ],
    },
    skoler: {
      title: 'Skoler og barnehager',
      grunnskoler: ['Nordstrand skole', 'Munkerud skole', 'Ekeberg skole', 'Ljan skole'],
      vgs: ['Nordstrand VGS'],
      barnehager: ['Nordstrand barnehage', 'Ljan barnehage', 'Ekeberg barnehage'],
    },
    helse: {
      title: 'Helsetjenester',
      legekontor: ['Nordstrand legesenter - Nordstrandveien 60', 'Ljan legekontor - Ljansbrukveien 4'],
      apotek: ['Apotek 1 Nordstrand - Nordstrandveien 58', 'Vitusapotek Lambertseter'],
      tannlege: ['Nordstrand Tannklinikk - Nordstrandveien 56'],
      legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
    },
  },
};

// Default info for districts without specific data
const DEFAULT_DISTRICT_INFO = {
  historie: {
    title: 'Bydelens historie',
    content: 'Denne bydelen har en rik historie som er en del av Oslos utvikling. Bydelen ble innlemmet i Oslo på 1900-tallet og har siden utviklet seg til et moderne boligområde.',
    highlights: ['Innlemmet i Oslo', 'Moderne utvikling', 'Lokalt fellesskap'],
  },
  transport: {
    title: 'Kollektivtransport',
    trikk: ['Se Ruter for aktuelle linjer'],
    buss: ['Flere busslinjer betjener området'],
    tbane: ['T-baneforbindelse tilgjengelig'],
    bysykkel: ['Sjekk Oslo Bysykkel for stasjoner'],
  },
  parker: {
    title: 'Parker og grøntområder',
    list: [
      { name: 'Lokale parker', desc: 'Bydelen har flere grøntområder', address: 'Se kart' },
    ],
  },
  skoler: {
    title: 'Skoler og barnehager',
    grunnskoler: ['Flere grunnskoler i området'],
    vgs: ['Videregående skoler tilgjengelig'],
    barnehager: ['Kommunale og private barnehager'],
  },
  helse: {
    title: 'Helsetjenester',
    legekontor: ['Lokale legesentre finnes i området'],
    apotek: ['Apotek tilgjengelig'],
    tannlege: ['Tannlegetjenester i nærområdet'],
    legevakt: 'Oslo Legevakt - Storgata 40 (116 117)',
  },
};

// Funksjon for å hente bydels-info
const getDistrictInfo = (district) => {
  return DISTRICT_INFO[district] || DEFAULT_DISTRICT_INFO;
};

// Fallback data for districts without specific data
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'Lørdagsmarked',
    date: '8',
    month: 'feb',
    time: '10:00 - 16:00',
    location: 'Torget',
    description: 'Ukentlig marked med lokale produsenter, håndverkere og matboder. Finn ferske grønnsaker, hjemmebakt brød, vintage klær og mye mer. Perfekt for hele familien!',
    organizer: 'Bydelsforeningen',
    price: 'Gratis inngang',
    contact: '922 33 444',
    dayIndex: 5,
  },
  {
    id: 2,
    title: 'Yoga i parken',
    date: '9',
    month: 'feb',
    time: '11:00 - 12:00',
    location: 'Bydelens park',
    description: 'Drop-in yoga for alle nivåer. Ta med egen matte og flaske vann.',
    organizer: 'Lokal Yoga',
    price: '50 kr',
    contact: '933 44 555',
    dayIndex: 6,
  },
  {
    id: 3,
    title: 'Pub quiz',
    date: '12',
    month: 'feb',
    time: '19:00',
    location: 'Lokalpuben',
    description: 'Test kunnskapene dine i vår ukentlige quiz! Lag på 2-6 personer. Premier til de tre beste lagene. Påmelding fra kl 18:30.',
    organizer: 'Lokalpuben',
    price: '100 kr per lag',
    contact: '944 55 666',
    dayIndex: 2,
  },
  {
    id: 4,
    title: 'Konsert',
    date: '14',
    month: 'feb',
    time: '21:00',
    location: 'Kulturhuset',
    description: 'Live musikk med lokale band. Dørene åpner kl 20:00.',
    organizer: 'Kulturhuset',
    price: '150 kr',
    contact: '955 66 777',
    dayIndex: 4,
  },
  {
    id: 5,
    title: 'Barneaktiviteter',
    date: '3',
    month: 'feb',
    time: '10:00 - 12:00',
    location: 'Biblioteket',
    description: 'Gratis aktiviteter for barn 3-10 år.',
    organizer: 'Deichman',
    price: 'Gratis',
    contact: '911 22 333',
    dayIndex: 0,
  },
  {
    id: 6,
    title: 'Språkkafé',
    date: '4',
    month: 'feb',
    time: '17:00 - 19:00',
    location: 'Frivillighetssentralen',
    description: 'Øv norsk i uformelle omgivelser.',
    organizer: 'Frivillighetssentralen',
    price: 'Gratis',
    contact: '922 11 444',
    dayIndex: 1,
  },
  {
    id: 7,
    title: 'Filmkveld',
    date: '6',
    month: 'feb',
    time: '19:00',
    location: 'Kulturhuset',
    description: 'Gratis filmvisning for alle.',
    organizer: 'Kulturhuset',
    price: 'Gratis',
    contact: '933 22 555',
    dayIndex: 3,
  },
];

const DEFAULT_BUSINESSES = [
  {
    id: 1,
    name: 'Lokalt Bakeri',
    category: 'Bakeri',
    rating: 4.8,
    address: 'Hovedgaten 45',
    phone: '22 35 67 89',
    hours: 'Man-Fre: 07-18, Lør-Søn: 08-16',
    description: 'Tradisjonelt bakeri med ferske brød, boller og kaker hver dag.',
  },
  {
    id: 2,
    name: 'Kafé på hjørnet',
    category: 'Kafé',
    rating: 4.5,
    address: 'Torget 32',
    phone: '22 46 78 90',
    hours: 'Man-Søn: 09-22',
    description: 'Koselig kafé med hjemmelaget mat.',
  },
  {
    id: 3,
    name: 'Frisøren',
    category: 'Frisør',
    rating: 4.7,
    address: 'Sentergata 12',
    phone: '22 57 89 01',
    hours: 'Tir-Fre: 10-18, Lør: 10-15',
    description: 'Moderne frisørsalong for dame og herre.',
  },
  {
    id: 4,
    name: 'Blomsterbutikken',
    category: 'Blomster',
    rating: 4.9,
    address: 'Parkveien 8',
    phone: '22 68 90 12',
    hours: 'Man-Fre: 09-17, Lør: 10-14',
    description: 'Vakre buketter og planter til alle anledninger.',
  },
];

// Funksjon for å hente bydels-spesifikke data
const getDistrictEvents = (district) => {
  return DISTRICT_DATA[district]?.events || DEFAULT_EVENTS;
};

const getDistrictBusinesses = (district) => {
  return DISTRICT_DATA[district]?.businesses || DEFAULT_BUSINESSES;
};

// Bydels-spesifikke oppdateringer
const getDistrictUpdates = (district) => {
  const park = DISTRICT_DATA[district]?.park || 'parken';
  return [
    {
      id: 1,
      author: 'Maria H.',
      time: '2 timer siden',
      content: `Noen som har sett en svart katt i området rundt ${park}?`,
      fullContent: `Noen som har sett en svart katt i området rundt ${park}? Han heter Milo og har vært borte siden i går kveld. Han har hvit flekk på brystet og blå halsbånd. Vennligst ta kontakt hvis du ser ham!`,
      likes: 12,
      comments: 5,
      contact: '912 34 567'
    },
    {
      id: 2,
      author: 'Erik S.',
      time: '5 timer siden',
      content: `Takk til alle som kom på dugnaden i ${park} i går!`,
      fullContent: `Takk til alle som kom på dugnaden i ${park} i går! Parken ser strålende ut. Vi var over 30 frivillige som plukket søppel, plantet blomster og malte benker. Neste dugnad blir i april!`,
      likes: 45,
      comments: 12,
      contact: '923 45 678'
    },
    {
      id: 3,
      author: 'Lisa B.',
      time: '1 dag siden',
      content: `Husk søppelplukking i ${park} på lørdag kl 10:00!`,
      fullContent: `Husk søppelplukking i ${park} på lørdag kl 10:00! Vi møtes ved hovedinngangen. Hansker og poser blir utdelt. Ta med godt humør!`,
      likes: 28,
      comments: 8,
      contact: '934 56 789'
    },
  ];
};

const DEFAULT_UPDATES = [
  {
    id: 1,
    author: 'Maria H.',
    time: '2 timer siden',
    content: 'Noen som har sett en svart katt i området?',
    fullContent: 'Noen som har sett en svart katt i området? Han heter Milo og har vært borte siden i går kveld.',
    likes: 12,
    comments: 5,
    contact: '912 34 567'
  },
  {
    id: 2,
    author: 'Erik S.',
    time: '5 timer siden',
    content: 'Takk til alle som kom på dugnaden i går!',
    fullContent: 'Takk til alle som kom på dugnaden i går! Parken ser strålende ut.',
    likes: 45,
    comments: 12,
    contact: '923 45 678'
  },
  {
    id: 3,
    author: 'Lisa B.',
    time: '1 dag siden',
    content: 'Husk søppelplukking på lørdag kl 10:00!',
    fullContent: 'Husk søppelplukking på lørdag kl 10:00! Vi møtes ved hovedinngangen.',
    likes: 28,
    comments: 8,
    contact: '934 56 789'
  },
];

// Bydels-spesifikke nyheter
const getDistrictNews = (district) => {
  const park = DISTRICT_DATA[district]?.park || 'parken';
  const districtName = district || 'bydelen';
  return [
    {
      id: 1,
      title: `Ny sykkelsti åpner i ${districtName}`,
      category: 'Trafikk',
      color: '#3b82f6',
      date: '2. feb',
      fullContent: `Den nye sykkelstien i ${districtName} står endelig ferdig etter to års arbeid. Stien gir syklister en trygg rute gjennom nabolaget.\n\nOrdfører Raymond Johansen klipper snoren på lørdag kl 12:00.`,
      source: 'Oslo Kommune',
      readTime: '3 min'
    },
    {
      id: 2,
      title: `${park} får ny lekeplass`,
      category: 'Fritid',
      color: '#10b981',
      date: '1. feb',
      fullContent: `Bydelen har bevilget 2,5 millioner kroner til oppgradering av lekeplassen i ${park}. Prosjektet starter i mars.\n\nDen nye lekeplassen vil inkludere klatrestativ, sandkasse og vannlek.`,
      source: `Bydel ${districtName}`,
      readTime: '2 min'
    },
    {
      id: 3,
      title: `Kulturhuset i ${districtName} fyller 10 år`,
      category: 'Kultur',
      color: '#f59e0b',
      date: '30. jan',
      fullContent: `Kulturhuset i ${districtName} markerer 10-årsjubileum med en hel uke med gratisarrangementer!\n\nProgram inkluderer konserter, kunstutstilling, teater og jubileumsfest.`,
      source: 'Kulturhuset',
      readTime: '4 min'
    },
  ];
};

const DEFAULT_NEWS = [
  {
    id: 1,
    title: 'Ny sykkelsti åpner',
    category: 'Trafikk',
    color: '#3b82f6',
    date: '2. feb',
    fullContent: 'Den nye sykkelstien står endelig ferdig.',
    source: 'Oslo Kommune',
    readTime: '3 min'
  },
  {
    id: 2,
    title: 'Parken får ny lekeplass',
    category: 'Fritid',
    color: '#10b981',
    date: '1. feb',
    fullContent: 'Ny lekeplass kommer i vår.',
    source: 'Bydelen',
    readTime: '2 min'
  },
  {
    id: 3,
    title: 'Kulturhuset fyller 10 år',
    category: 'Kultur',
    color: '#f59e0b',
    date: '30. jan',
    fullContent: 'Jubileumsuke med gratisarrangementer!',
    source: 'Kulturhuset',
    readTime: '4 min'
  },
];

// Add Item Modal Component
const AddItemModal = ({ visible, onClose, onAdd, title, fields, extraContent }) => {
  const [values, setValues] = useState({});

  const handleAdd = () => {
    // Check required fields (skip optional businessName if empty)
    const requiredFields = fields.filter(f => f.key !== 'businessName');
    if (requiredFields.every(f => values[f.key]?.trim())) {
      onAdd(values);
      setValues({});
      onClose();
    } else {
      Alert.alert('Feil', 'Vennligst fyll ut alle feltene');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <ScrollView contentContainerStyle={styles.modalScrollContent}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            {extraContent}
            {fields.map((field) => (
              <TextInput
                key={field.key}
                style={styles.input}
                placeholder={field.placeholder}
                value={values[field.key] || ''}
                onChangeText={(text) => setValues({ ...values, [field.key]: text })}
              />
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => { setValues({}); onClose(); }}>
                <Text style={styles.cancelButtonText}>Avbryt</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addButtonText}>Legg til</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Item Detail Modal
const ItemDetailModal = ({ visible, item, onClose }) => {
  if (!item) return null;

  const handleCall = () => {
    if (item.phone) {
      Linking.openURL(`tel:${item.phone.replace(/\s/g, '')}`);
    }
  };

  const handleSMS = () => {
    if (item.phone) {
      Linking.openURL(`sms:${item.phone.replace(/\s/g, '')}?body=Hei! Jeg så at du har "${item.title}" til utlån på nabolagsappen. Er den fortsatt tilgjengelig?`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.detailModalContent}>
          <View style={styles.detailHeader}>
            <View style={[styles.detailIcon, { backgroundColor: '#fff3e6' }]}>
              <FontAwesome5 name={item.icon || 'box'} size={40} color="#e67e22" />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.detailTitle}>{item.title}</Text>
          <Text style={styles.detailDescription}>{item.description}</Text>

          <View style={styles.ownerSection}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>{item.owner?.charAt(0) || '?'}</Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerLabel}>Eier</Text>
              <Text style={styles.ownerName}>{item.owner || 'Ukjent'}</Text>
            </View>
          </View>

          <View style={styles.contactButtons}>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#10b981' }]} onPress={handleCall}>
              <Ionicons name="call" size={22} color="#fff" />
              <Text style={styles.contactButtonText}>Ring</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#3b82f6' }]} onPress={handleSMS}>
              <Ionicons name="chatbubble" size={22} color="#fff" />
              <Text style={styles.contactButtonText}>Send SMS</Text>
            </TouchableOpacity>
          </View>

          {item.phone && (
            <Text style={styles.phoneNumber}>{item.phone}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Leiesentralen Screen
const LeiesentralenScreen = ({ onBack, items, onAddItem, onDeleteItem }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleAdd = (values) => {
    const newItem = {
      id: Date.now(),
      title: values.title,
      description: values.description,
      icon: 'box',
      owner: values.owner,
      phone: values.phone,
    };
    onAddItem(newItem);
  };

  const openDetail = (item) => {
    setSelectedItem(item);
    setDetailVisible(true);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessible={true} accessibilityLabel="Gå tilbake" accessibilityHint="Navigerer til forrige skjerm" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Leiesentralen</Text>
      </View>
      <ScrollView style={styles.screenContent}>
        <Text style={styles.subtitle}>Del og lån ting i nabolaget</Text>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listItem}
            activeOpacity={0.7}
            onPress={() => openDetail(item)}
            delayLongPress={500}
            onLongPress={() => {
              Alert.alert('Slett', `Vil du slette "${item.title}"?`, [
                { text: 'Avbryt', style: 'cancel' },
                { text: 'Slett', style: 'destructive', onPress: () => onDeleteItem(item.id) },
              ]);
            }}
            accessible={true}
            accessibilityLabel={`${item.title}, ${item.description}`}
            accessibilityHint="Trykk for å se detaljer, hold inne for å slette"
            accessibilityRole="button"
          >
            <View style={[styles.listIcon, { backgroundColor: '#fff3e6' }]}>
              <FontAwesome5 name={item.icon} size={24} color="#e67e22" />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.listDescription}>{item.description}</Text>
              {item.owner && <Text style={styles.ownerTag}>👤 {item.owner}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#e67e22' }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Legg til ny gjenstand</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Trykk for å se detaljer • Hold inne for å slette</Text>
      </ScrollView>
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
        title="Legg til gjenstand"
        fields={[
          { key: 'title', placeholder: 'Navn på gjenstand' },
          { key: 'description', placeholder: 'Beskrivelse' },
          { key: 'owner', placeholder: 'Ditt navn' },
          { key: 'phone', placeholder: 'Telefonnummer' },
        ]}
      />
      <ItemDetailModal
        visible={detailVisible}
        item={selectedItem}
        onClose={() => setDetailVisible(false)}
      />
    </View>
  );
};

// Event Detail Modal
const EventDetailModal = ({ visible, event, onClose, isFavorite, toggleFavorite }) => {
  if (!event) return null;

  const handleCall = () => {
    if (event.contact) {
      Linking.openURL(`tel:${event.contact.replace(/\s/g, '')}`);
    }
  };

  const handleShare = () => {
    Alert.alert('Del', `${event.title}\n${event.date}. ${event.month} kl ${event.time}\n📍 ${event.location}`);
  };

  const favorite = isFavorite ? isFavorite(event.id) : false;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.eventDetailModal}>
          <View style={styles.eventModalHeader}>
            <TouchableOpacity onPress={() => toggleFavorite && toggleFavorite(event.id)} style={styles.favoriteButton}>
              <Ionicons name={favorite ? "heart" : "heart-outline"} size={28} color={favorite ? "#e91e63" : "#666"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.eventCloseButton}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.eventDateBadge}>
            <Text style={styles.eventDateBig}>{event.date}</Text>
            <Text style={styles.eventMonthBig}>{event.month}</Text>
          </View>

          <Text style={styles.eventDetailTitle}>{event.title}</Text>

          <View style={styles.eventInfoRow}>
            <MaterialIcons name="access-time" size={20} color="#e67e22" />
            <Text style={styles.eventInfoText}>{event.time}</Text>
          </View>

          <View style={styles.eventInfoRow}>
            <MaterialIcons name="location-on" size={20} color="#e67e22" />
            <Text style={styles.eventInfoText}>{event.location}</Text>
          </View>

          {event.price && (
            <View style={styles.eventInfoRow}>
              <MaterialIcons name="local-offer" size={20} color="#e67e22" />
              <Text style={styles.eventInfoText}>{event.price}</Text>
            </View>
          )}

          {event.organizer && (
            <View style={styles.eventInfoRow}>
              <MaterialIcons name="person" size={20} color="#e67e22" />
              <Text style={styles.eventInfoText}>Arrangør: {event.organizer}</Text>
            </View>
          )}

          {event.description && (
            <View style={styles.eventDescriptionBox}>
              <Text style={styles.eventDescriptionTitle}>Om arrangementet</Text>
              <Text style={styles.eventDescriptionText}>{event.description}</Text>
            </View>
          )}

          <View style={styles.eventButtons}>
            {event.contact && (
              <TouchableOpacity style={[styles.eventButton, { backgroundColor: '#10b981' }]} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.eventButtonText}>Kontakt</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.eventButton, { backgroundColor: '#3b82f6' }]} onPress={handleShare}>
              <Ionicons name="share-social" size={20} color="#fff" />
              <Text style={styles.eventButtonText}>Del</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Hva Skjer Screen
const HvaSkjerScreen = ({ onBack, events, onAddEvent, onDeleteEvent, district, selectedDay, onDaySelect, favorites, toggleFavorite, isFavorite, userProfile, userBusinessName }) => {
  const shortName = getShortName(district);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const days = ['MANDAG', 'TIRSDAG', 'ONSDAG', 'TORSDAG', 'FREDAG', 'LØRDAG', 'SØNDAG'];
  const isBusiness = userProfile === 'business';

  // Filtrer arrangementer basert på valgt dag
  const filteredEvents = selectedDay !== null
    ? events.filter(event => event.dayIndex === selectedDay)
    : events;

  const handleAdd = (values) => {
    // Beregn dayIndex basert på dato (forenklet - bruker dagens ukedag som standard)
    const dayIndex = selectedDay !== null ? selectedDay : new Date().getDay();
    const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Konverter søndag=0 til søndag=6
    const newEvent = {
      id: Date.now(),
      title: values.title,
      date: values.date,
      month: values.month,
      time: values.time,
      location: values.location,
      description: values.description,
      organizer: values.organizer,
      price: values.price,
      contact: values.contact,
      dayIndex: adjustedDayIndex,
      isBusiness: isBusiness,
      businessName: isBusiness ? userBusinessName : null,
    };
    onAddEvent(newEvent);
  };

  const openDetail = (event) => {
    setSelectedEvent(event);
    setDetailVisible(true);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessible={true} accessibilityLabel="Gå tilbake" accessibilityHint="Navigerer til forrige skjerm" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Hva skjer på {shortName}?</Text>
      </View>

      {/* Dag-faner */}
      <View style={styles.dayNavigationInner}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <DayTab
            day="ALLE"
            isActive={selectedDay === null}
            onPress={() => onDaySelect(null)}
          />
          {days.map((day, index) => (
            <DayTab
              key={day}
              day={day}
              isActive={selectedDay === index}
              onPress={() => onDaySelect(selectedDay === index ? null : index)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.screenContent}>
        <Text style={styles.subtitle}>
          {selectedDay !== null
            ? `Arrangementer på ${days[selectedDay].toLowerCase()}`
            : `Kommende arrangementer på ${shortName}`}
        </Text>
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>
              Ingen arrangementer{selectedDay !== null ? ` på ${days[selectedDay].toLowerCase()}` : ''}
            </Text>
            <Text style={styles.emptyStateHint}>
              Trykk på en annen dag eller legg til et arrangement
            </Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.listItem}
            activeOpacity={0.7}
            onPress={() => openDetail(event)}
            delayLongPress={500}
            onLongPress={() => {
              Alert.alert('Slett', `Vil du slette "${event.title}"?`, [
                { text: 'Avbryt', style: 'cancel' },
                { text: 'Slett', style: 'destructive', onPress: () => onDeleteEvent(event.id) },
              ]);
            }}
            accessible={true}
            accessibilityLabel={`${event.title}, ${event.date} ${event.month}, ${event.time}, ${event.location}`}
            accessibilityHint="Trykk for å se detaljer, hold inne for å slette"
            accessibilityRole="button"
          >
            <View style={[styles.dateBox, event.isBusiness && styles.dateBoxBusiness]}>
              <Text style={styles.dateText}>{event.date}</Text>
              <Text style={styles.monthText}>{event.month}</Text>
            </View>
            <View style={styles.listContent}>
              <View style={styles.eventTitleRow}>
                <Text style={styles.listTitle}>{event.title}</Text>
                {event.isBusiness && (
                  <View style={styles.businessBadge}>
                    <Ionicons name="business" size={10} color="#fff" />
                    <Text style={styles.businessBadgeText}>Bedrift</Text>
                  </View>
                )}
              </View>
              {event.isBusiness && event.businessName && (
                <Text style={styles.businessNameText}>Av {event.businessName}</Text>
              )}
              <View style={styles.eventDetail}>
                <MaterialIcons name="access-time" size={14} color="#888" />
                <Text style={styles.eventDetailText}>{event.time}</Text>
              </View>
              <View style={styles.eventDetail}>
                <MaterialIcons name="location-on" size={14} color="#888" />
                <Text style={styles.eventDetailText}>{event.location}</Text>
              </View>
            </View>
            {isFavorite && isFavorite(event.id) && (
              <Ionicons name="heart" size={20} color="#e91e63" style={{ marginRight: 8 }} />
            )}
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))
        )}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: isBusiness ? '#9b59b6' : '#e67e22' }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name={isBusiness ? "business" : "add-circle"} size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Legg til arrangement</Text>
        </TouchableOpacity>
        {isBusiness && (
          <View style={styles.postingAsIndicator}>
            <Ionicons name="business" size={14} color="#9b59b6" />
            <Text style={styles.postingAsText}>Legger ut som {userBusinessName}</Text>
          </View>
        )}
        <Text style={styles.hint}>Trykk for å se detaljer • Hold inne for å slette</Text>
      </ScrollView>
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
        title={isBusiness ? `Nytt arrangement fra ${userBusinessName}` : "Legg til arrangement"}
        fields={[
          { key: 'title', placeholder: 'Navn på arrangement' },
          { key: 'date', placeholder: 'Dato (f.eks. 15)' },
          { key: 'month', placeholder: 'Måned (f.eks. feb)' },
          { key: 'time', placeholder: 'Tidspunkt (f.eks. 18:00)' },
          { key: 'location', placeholder: 'Sted' },
          { key: 'description', placeholder: 'Beskrivelse' },
          { key: 'price', placeholder: 'Pris (f.eks. Gratis)' },
        ]}
      />
      <EventDetailModal
        visible={detailVisible}
        event={selectedEvent}
        onClose={() => setDetailVisible(false)}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
    </View>
  );
};

// Business Detail Modal
const BusinessDetailModal = ({ visible, business, onClose }) => {
  if (!business) return null;

  const handleCall = () => {
    if (business.phone) {
      Linking.openURL(`tel:${business.phone.replace(/\s/g, '')}`);
    }
  };

  const handleDirections = () => {
    if (business.address) {
      const address = encodeURIComponent(business.address + ', Oslo');
      Linking.openURL(`https://maps.google.com/?q=${address}`);
    }
  };

  const handleWebsite = () => {
    if (business.website) {
      Linking.openURL(`https://${business.website}`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.businessDetailModal}>
          <TouchableOpacity onPress={onClose} style={styles.eventCloseButton}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>

          <View style={styles.businessHeader}>
            <View style={styles.businessAvatar}>
              <Text style={styles.businessAvatarText}>{business.name.charAt(0)}</Text>
            </View>
            <View style={styles.businessRating}>
              <Ionicons name="star" size={18} color="#fbbf24" />
              <Text style={styles.businessRatingText}>{business.rating}</Text>
            </View>
          </View>

          <Text style={styles.businessDetailTitle}>{business.name}</Text>
          <Text style={styles.businessCategory}>{business.category}</Text>

          {business.address && (
            <View style={styles.businessInfoRow}>
              <MaterialIcons name="location-on" size={20} color="#9b59b6" />
              <Text style={styles.businessInfoText}>{business.address}</Text>
            </View>
          )}

          {business.phone && (
            <View style={styles.businessInfoRow}>
              <MaterialIcons name="phone" size={20} color="#9b59b6" />
              <Text style={styles.businessInfoText}>{business.phone}</Text>
            </View>
          )}

          {business.hours && (
            <View style={styles.businessInfoRow}>
              <MaterialIcons name="access-time" size={20} color="#9b59b6" />
              <Text style={styles.businessInfoText}>{business.hours}</Text>
            </View>
          )}

          {business.description && (
            <View style={styles.businessDescriptionBox}>
              <Text style={styles.businessDescriptionTitle}>Om oss</Text>
              <Text style={styles.businessDescriptionText}>{business.description}</Text>
            </View>
          )}

          <View style={styles.businessButtons}>
            {business.phone && (
              <TouchableOpacity style={[styles.businessButton, { backgroundColor: '#10b981' }]} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.businessButtonText}>Ring</Text>
              </TouchableOpacity>
            )}
            {business.address && (
              <TouchableOpacity style={[styles.businessButton, { backgroundColor: '#3b82f6' }]} onPress={handleDirections}>
                <Ionicons name="navigate" size={20} color="#fff" />
                <Text style={styles.businessButtonText}>Veibeskrivelse</Text>
              </TouchableOpacity>
            )}
          </View>

          {business.website && (
            <TouchableOpacity style={styles.websiteButton} onPress={handleWebsite}>
              <Ionicons name="globe-outline" size={18} color="#9b59b6" />
              <Text style={styles.websiteButtonText}>{business.website}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Løkka Lokalt Screen
const LokkaLokaltScreen = ({ onBack, businesses, onAddBusiness, onDeleteBusiness, district }) => {
  const shortName = getShortName(district);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleAdd = (values) => {
    const newBusiness = {
      id: Date.now(),
      name: values.name,
      category: values.category,
      rating: parseFloat(values.rating) || 4.0,
      address: values.address,
      phone: values.phone,
      hours: values.hours,
      description: values.description,
    };
    onAddBusiness(newBusiness);
  };

  const openDetail = (biz) => {
    setSelectedBusiness(biz);
    setDetailVisible(true);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessible={true} accessibilityLabel="Gå tilbake" accessibilityHint="Navigerer til forrige skjerm" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{shortName} Lokalt</Text>
      </View>
      <ScrollView style={styles.screenContent}>
        <Text style={styles.subtitle}>Lokale bedrifter og butikker på {shortName}</Text>
        {businesses.map((biz) => (
          <TouchableOpacity
            key={biz.id}
            style={styles.listItem}
            activeOpacity={0.7}
            onPress={() => openDetail(biz)}
            accessible={true}
            accessibilityLabel={`${biz.name}, ${biz.category}, vurdering ${biz.rating}`}
            accessibilityHint="Trykk for å se detaljer"
            accessibilityRole="button"
          >
            <View style={[styles.avatar, { backgroundColor: '#9b59b6' }]}>
              <Text style={styles.avatarText}>{biz.name.charAt(0)}</Text>
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{biz.name}</Text>
              <Text style={styles.listDescription}>{biz.category}</Text>
              {biz.address && <Text style={styles.addressTag}>📍 {biz.address}</Text>}
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={styles.ratingText}>{biz.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.businessRegistrationBox}>
          <Text style={styles.businessRegistrationTitle}>Eier du en bedrift?</Text>
          <Text style={styles.businessRegistrationText}>Registrer din bedrift gratis og bli synlig for alle i nabolaget</Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#9b59b6', marginTop: 12 }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="business" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Registrer din bedrift</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>Trykk på en bedrift for å se detaljer</Text>
      </ScrollView>
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
        title="Registrer din bedrift"
        fields={[
          { key: 'name', placeholder: 'Bedriftens navn' },
          { key: 'category', placeholder: 'Kategori (f.eks. Kafé, Restaurant, Frisør)' },
          { key: 'address', placeholder: 'Adresse' },
          { key: 'phone', placeholder: 'Telefonnummer' },
          { key: 'email', placeholder: 'E-post (for verifisering)' },
          { key: 'hours', placeholder: 'Åpningstider' },
          { key: 'description', placeholder: 'Beskriv din bedrift' },
        ]}
      />
      <BusinessDetailModal
        visible={detailVisible}
        business={selectedBusiness}
        onClose={() => setDetailVisible(false)}
      />
    </View>
  );
};

// Update Detail Modal
const UpdateDetailModal = ({ visible, update, onClose }) => {
  if (!update) return null;
  const [liked, setLiked] = useState(false);

  const handleContact = () => {
    if (update.contact) {
      Linking.openURL(`sms:${update.contact.replace(/\s/g, '')}`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.updateDetailModal}>
          <TouchableOpacity onPress={onClose} style={styles.eventCloseButton}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>

          <View style={styles.updateDetailHeader}>
            <View style={styles.updateDetailAvatar}>
              <Text style={styles.updateDetailAvatarText}>{update.author.charAt(0)}</Text>
            </View>
            <View style={styles.updateDetailAuthorInfo}>
              <Text style={styles.updateDetailAuthorName}>{update.author}</Text>
              <Text style={styles.updateDetailTime}>{update.time}</Text>
            </View>
          </View>

          <ScrollView style={styles.updateDetailScroll}>
            <Text style={styles.updateDetailContent}>{update.fullContent || update.content}</Text>
          </ScrollView>

          <View style={styles.updateDetailStats}>
            <View style={styles.updateStat}>
              <Ionicons name="heart" size={18} color="#e74c3c" />
              <Text style={styles.updateStatText}>{update.likes || 0} liker dette</Text>
            </View>
            <View style={styles.updateStat}>
              <Ionicons name="chatbubble" size={18} color="#888" />
              <Text style={styles.updateStatText}>{update.comments || 0} kommentarer</Text>
            </View>
          </View>

          <View style={styles.updateDetailButtons}>
            <TouchableOpacity
              style={[styles.updateDetailButton, liked && styles.updateDetailButtonActive]}
              onPress={() => setLiked(!liked)}
            >
              <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color={liked ? "#e74c3c" : "#666"} />
              <Text style={[styles.updateDetailButtonText, liked && { color: '#e74c3c' }]}>Lik</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateDetailButton}>
              <Ionicons name="chatbubble-outline" size={22} color="#666" />
              <Text style={styles.updateDetailButtonText}>Kommenter</Text>
            </TouchableOpacity>
            {update.contact && (
              <TouchableOpacity style={styles.updateDetailButton} onPress={handleContact}>
                <Ionicons name="mail-outline" size={22} color="#666" />
                <Text style={styles.updateDetailButtonText}>Kontakt</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Oppdateringer Screen
const OppdateringerScreen = ({ onBack, updates, onAddUpdate, onDeleteUpdate, district }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const shortName = getShortName(district);

  const handleAdd = (values) => {
    const newUpdate = {
      id: Date.now(),
      author: values.author,
      time: 'Nå',
      content: values.content,
      fullContent: values.content,
      likes: 0,
      comments: 0,
      contact: values.contact,
    };
    onAddUpdate(newUpdate);
  };

  const openDetail = (update) => {
    setSelectedUpdate(update);
    setDetailVisible(true);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessible={true} accessibilityLabel="Gå tilbake" accessibilityHint="Navigerer til forrige skjerm" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Oppdateringer fra {shortName}</Text>
      </View>
      <ScrollView style={styles.screenContent}>
        <Text style={styles.subtitle}>Siste fra nabolaget</Text>
        {updates.map((update) => (
          <TouchableOpacity
            key={update.id}
            activeOpacity={0.7}
            onPress={() => openDetail(update)}
            delayLongPress={500}
            onLongPress={() => {
              Alert.alert('Slett', 'Vil du slette denne oppdateringen?', [
                { text: 'Avbryt', style: 'cancel' },
                { text: 'Slett', style: 'destructive', onPress: () => onDeleteUpdate(update.id) },
              ]);
            }}
          >
            <View style={styles.updateCard}>
              <View style={styles.updateHeader}>
                <View style={[styles.avatar, { backgroundColor: '#c77dba', width: 40, height: 40 }]}>
                  <Text style={[styles.avatarText, { fontSize: 16 }]}>{update.author.charAt(0)}</Text>
                </View>
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{update.author}</Text>
                  <Text style={styles.timeText}>{update.time}</Text>
                </View>
              </View>
              <Text style={styles.updateContent} numberOfLines={3}>{update.content}</Text>
              <View style={styles.updateActions}>
                <View style={styles.updateAction}>
                  <Ionicons name="heart-outline" size={18} color="#888" />
                  <Text style={styles.updateActionText}>{update.likes || 0}</Text>
                </View>
                <View style={styles.updateAction}>
                  <Ionicons name="chatbubble-outline" size={18} color="#888" />
                  <Text style={styles.updateActionText}>{update.comments || 0}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#c77dba' }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Skriv en oppdatering</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Trykk for å lese mer • Hold inne for å slette</Text>
      </ScrollView>
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
        title="Ny oppdatering"
        fields={[
          { key: 'author', placeholder: 'Ditt navn' },
          { key: 'content', placeholder: 'Hva vil du dele?' },
          { key: 'contact', placeholder: 'Telefon (valgfritt)' },
        ]}
      />
      <UpdateDetailModal
        visible={detailVisible}
        update={selectedUpdate}
        onClose={() => setDetailVisible(false)}
      />
    </View>
  );
};

// Søk Screen
const SearchScreen = ({ onBack, items, events, businesses, updates, news, onNavigate, district }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const shortName = getShortName(district);

  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results = [];

    // Søk i gjenstander
    items.forEach((item) => {
      if (item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) {
        results.push({ type: 'item', data: item, category: 'Leiesentralen' });
      }
    });

    // Søk i arrangementer
    events.forEach((event) => {
      if (event.title.toLowerCase().includes(query) || event.location.toLowerCase().includes(query)) {
        results.push({ type: 'event', data: event, category: `Hva skjer på ${shortName}` });
      }
    });

    // Søk i bedrifter
    businesses.forEach((biz) => {
      if (biz.name.toLowerCase().includes(query) || biz.category.toLowerCase().includes(query)) {
        results.push({ type: 'business', data: biz, category: `${shortName} Lokalt` });
      }
    });

    // Søk i oppdateringer
    updates.forEach((update) => {
      if (update.content.toLowerCase().includes(query) || update.author.toLowerCase().includes(query)) {
        results.push({ type: 'update', data: update, category: 'Oppdateringer' });
      }
    });

    // Søk i nyheter
    news.forEach((item) => {
      if (item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
        results.push({ type: 'news', data: item, category: 'Nyheter' });
      }
    });

    return results;
  };

  const results = getSearchResults();

  const renderResult = (result, index) => {
    switch (result.type) {
      case 'item':
        return (
          <TouchableOpacity key={`item-${index}`} style={styles.searchResult} onPress={() => onNavigate('leiesentralen')}>
            <View style={[styles.searchResultIcon, { backgroundColor: '#fff3e6' }]}>
              <FontAwesome5 name={result.data.icon} size={18} color="#e67e22" />
            </View>
            <View style={styles.searchResultContent}>
              <Text style={styles.searchResultCategory}>{result.category}</Text>
              <Text style={styles.searchResultTitle}>{result.data.title}</Text>
              <Text style={styles.searchResultDesc}>{result.data.description}</Text>
            </View>
          </TouchableOpacity>
        );
      case 'event':
        return (
          <TouchableOpacity key={`event-${index}`} style={styles.searchResult} onPress={() => onNavigate('hvaskjer')}>
            <View style={[styles.searchResultIcon, { backgroundColor: '#fef3c7' }]}>
              <MaterialIcons name="event" size={20} color="#e67e22" />
            </View>
            <View style={styles.searchResultContent}>
              <Text style={styles.searchResultCategory}>{result.category}</Text>
              <Text style={styles.searchResultTitle}>{result.data.title}</Text>
              <Text style={styles.searchResultDesc}>{result.data.location} - {result.data.time}</Text>
            </View>
          </TouchableOpacity>
        );
      case 'business':
        return (
          <TouchableOpacity key={`biz-${index}`} style={styles.searchResult} onPress={() => onNavigate('lokalt')}>
            <View style={[styles.searchResultIcon, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="business" size={20} color="#9b59b6" />
            </View>
            <View style={styles.searchResultContent}>
              <Text style={styles.searchResultCategory}>{result.category}</Text>
              <Text style={styles.searchResultTitle}>{result.data.name}</Text>
              <Text style={styles.searchResultDesc}>{result.data.category} - ⭐ {result.data.rating}</Text>
            </View>
          </TouchableOpacity>
        );
      case 'update':
        return (
          <TouchableOpacity key={`update-${index}`} style={styles.searchResult} onPress={() => onNavigate('oppdateringer')}>
            <View style={[styles.searchResultIcon, { backgroundColor: '#fce7f3' }]}>
              <Ionicons name="chatbubble" size={20} color="#c77dba" />
            </View>
            <View style={styles.searchResultContent}>
              <Text style={styles.searchResultCategory}>{result.category}</Text>
              <Text style={styles.searchResultTitle}>{result.data.author}</Text>
              <Text style={styles.searchResultDesc} numberOfLines={2}>{result.data.content}</Text>
            </View>
          </TouchableOpacity>
        );
      case 'news':
        return (
          <TouchableOpacity key={`news-${index}`} style={styles.searchResult} onPress={() => onNavigate('nyheter')}>
            <View style={[styles.searchResultIcon, { backgroundColor: '#e0e7ff' }]}>
              <MaterialIcons name="article" size={20} color="#7b4397" />
            </View>
            <View style={styles.searchResultContent}>
              <Text style={styles.searchResultCategory}>{result.category}</Text>
              <Text style={styles.searchResultTitle}>{result.data.title}</Text>
              <Text style={styles.searchResultDesc}>{result.data.category} - {result.data.date}</Text>
            </View>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessible={true} accessibilityLabel="Gå tilbake" accessibilityHint="Navigerer til forrige skjerm" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Søk</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Søk i ${district}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView style={styles.screenContent}>
        {searchQuery.trim() === '' ? (
          <View style={styles.searchPlaceholder}>
            <Ionicons name="search" size={60} color="#ddd" />
            <Text style={styles.searchPlaceholderText}>Søk etter gjenstander, arrangementer, bedrifter, oppdateringer eller nyheter</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.searchPlaceholder}>
            <Ionicons name="sad-outline" size={60} color="#ddd" />
            <Text style={styles.searchPlaceholderText}>Ingen resultater for "{searchQuery}"</Text>
          </View>
        ) : (
          <>
            <Text style={styles.searchResultCount}>{results.length} resultat{results.length !== 1 ? 'er' : ''}</Text>
            {results.map((result, index) => renderResult(result, index))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

// Alt Om Screen
const AltOmScreen = ({ onBack, district }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const districtInfo = getDistrictInfo(district);

  const sections = [
    { id: 'historie', title: 'Historie', icon: 'history', desc: `Lær om ${district}s historie` },
    { id: 'transport', title: 'Transport', icon: 'directions-bus', desc: 'Kollektivtransport og parkering' },
    { id: 'parker', title: 'Parker', icon: 'park', desc: 'Grøntområder i nabolaget' },
    { id: 'uteliv', title: 'Uteliv', icon: 'local-bar', desc: 'Barer, klubber og natteliv' },
    { id: 'helse', title: 'Helse', icon: 'local-hospital', desc: 'Legekontor, apotek og tannleger' },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const renderHistorieContent = () => {
    const historie = districtInfo.historie;
    return (
      <View style={styles.altOmExpandedContent}>
        <Text style={styles.altOmContentTitle}>{historie.title}</Text>
        <Text style={styles.altOmContentText}>{historie.content}</Text>
        <Text style={styles.altOmHighlightsTitle}>Høydepunkter:</Text>
        {historie.highlights.map((highlight, idx) => (
          <View key={idx} style={styles.altOmHighlightItem}>
            <Ionicons name="checkmark-circle" size={18} color="#7b4397" />
            <Text style={styles.altOmHighlightText}>{highlight}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTransportContent = () => {
    const transport = districtInfo.transport;
    return (
      <View style={styles.altOmExpandedContent}>
        <Text style={styles.altOmContentTitle}>{transport.title}</Text>

        <View style={styles.altOmTransportSection}>
          <View style={styles.altOmTransportHeader}>
            <MaterialIcons name="tram" size={20} color="#e67e22" />
            <Text style={styles.altOmTransportTitle}>Trikk</Text>
          </View>
          {transport.trikk.map((line, idx) => (
            <Text key={idx} style={styles.altOmTransportLine}>• {line}</Text>
          ))}
        </View>

        <View style={styles.altOmTransportSection}>
          <View style={styles.altOmTransportHeader}>
            <MaterialIcons name="directions-bus" size={20} color="#3b82f6" />
            <Text style={styles.altOmTransportTitle}>Buss</Text>
          </View>
          {transport.buss.map((line, idx) => (
            <Text key={idx} style={styles.altOmTransportLine}>• {line}</Text>
          ))}
        </View>

        <View style={styles.altOmTransportSection}>
          <View style={styles.altOmTransportHeader}>
            <MaterialIcons name="subway" size={20} color="#10b981" />
            <Text style={styles.altOmTransportTitle}>T-bane</Text>
          </View>
          {transport.tbane.map((line, idx) => (
            <Text key={idx} style={styles.altOmTransportLine}>• {line}</Text>
          ))}
        </View>

        <View style={styles.altOmTransportSection}>
          <View style={styles.altOmTransportHeader}>
            <MaterialIcons name="pedal-bike" size={20} color="#a855f7" />
            <Text style={styles.altOmTransportTitle}>Bysykkel-stasjoner</Text>
          </View>
          {transport.bysykkel.map((station, idx) => (
            <Text key={idx} style={styles.altOmTransportLine}>• {station}</Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.altOmExternalLink}
          onPress={() => Linking.openURL('https://ruter.no')}
        >
          <Ionicons name="open-outline" size={18} color="#7b4397" />
          <Text style={styles.altOmExternalLinkText}>Åpne Ruter.no</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderParkerContent = () => {
    const parker = districtInfo.parker;
    return (
      <View style={styles.altOmExpandedContent}>
        <Text style={styles.altOmContentTitle}>{parker.title}</Text>
        {parker.list.map((park, idx) => (
          <View key={idx} style={styles.altOmParkCard}>
            <View style={styles.altOmParkHeader}>
              <MaterialIcons name="park" size={22} color="#10b981" />
              <Text style={styles.altOmParkName}>{park.name}</Text>
            </View>
            <Text style={styles.altOmParkDesc}>{park.desc}</Text>
            <View style={styles.altOmParkLocation}>
              <Ionicons name="location-outline" size={14} color="#888" />
              <Text style={styles.altOmParkAddress}>{park.address}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderUtelivContent = () => {
    const uteliv = districtInfo.uteliv || { title: 'Uteliv', barer: ['Lokale barer i området'], klubber: ['Se Oslo sentrum for klubber'], vinstuer: ['Vinbarer i nærheten'] };
    return (
      <View style={styles.altOmExpandedContent}>
        <Text style={styles.altOmContentTitle}>{uteliv.title}</Text>

        <View style={styles.altOmSchoolSection}>
          <View style={styles.altOmSchoolHeader}>
            <MaterialIcons name="local-bar" size={20} color="#e67e22" />
            <Text style={styles.altOmSchoolTitle}>Barer</Text>
          </View>
          {uteliv.barer.map((bar, idx) => (
            <Text key={idx} style={styles.altOmSchoolItem}>• {bar}</Text>
          ))}
        </View>

        <View style={styles.altOmSchoolSection}>
          <View style={styles.altOmSchoolHeader}>
            <MaterialIcons name="nightlife" size={20} color="#a855f7" />
            <Text style={styles.altOmSchoolTitle}>Klubber</Text>
          </View>
          {uteliv.klubber.map((klubb, idx) => (
            <Text key={idx} style={styles.altOmSchoolItem}>• {klubb}</Text>
          ))}
        </View>

        <View style={styles.altOmSchoolSection}>
          <View style={styles.altOmSchoolHeader}>
            <MaterialIcons name="wine-bar" size={20} color="#dc2626" />
            <Text style={styles.altOmSchoolTitle}>Vinbarer</Text>
          </View>
          {uteliv.vinstuer.map((vin, idx) => (
            <Text key={idx} style={styles.altOmSchoolItem}>• {vin}</Text>
          ))}
        </View>
      </View>
    );
  };

  const renderHelseContent = () => {
    const helse = districtInfo.helse;
    return (
      <View style={styles.altOmExpandedContent}>
        <Text style={styles.altOmContentTitle}>{helse.title}</Text>

        <TouchableOpacity
          style={styles.altOmLegevaktCard}
          onPress={() => Linking.openURL('tel:116117')}
        >
          <View style={styles.altOmLegevaktHeader}>
            <MaterialIcons name="local-hospital" size={24} color="#fff" />
            <Text style={styles.altOmLegevaktTitle}>Legevakt</Text>
          </View>
          <Text style={styles.altOmLegevaktText}>{helse.legevakt}</Text>
          <View style={styles.altOmLegevaktCall}>
            <Ionicons name="call" size={16} color="#fff" />
            <Text style={styles.altOmLegevaktCallText}>Ring 116 117</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.altOmHelseSection}>
          <View style={styles.altOmHelseHeader}>
            <MaterialIcons name="medical-services" size={20} color="#3b82f6" />
            <Text style={styles.altOmHelseTitle}>Legekontor</Text>
          </View>
          {helse.legekontor.map((lege, idx) => (
            <Text key={idx} style={styles.altOmHelseItem}>• {lege}</Text>
          ))}
        </View>

        <View style={styles.altOmHelseSection}>
          <View style={styles.altOmHelseHeader}>
            <MaterialIcons name="local-pharmacy" size={20} color="#10b981" />
            <Text style={styles.altOmHelseTitle}>Apotek</Text>
          </View>
          {helse.apotek.map((apotek, idx) => (
            <Text key={idx} style={styles.altOmHelseItem}>• {apotek}</Text>
          ))}
        </View>

        <View style={styles.altOmHelseSection}>
          <View style={styles.altOmHelseHeader}>
            <FontAwesome5 name="tooth" size={18} color="#a855f7" />
            <Text style={styles.altOmHelseTitle}>Tannlege</Text>
          </View>
          {helse.tannlege.map((tannlege, idx) => (
            <Text key={idx} style={styles.altOmHelseItem}>• {tannlege}</Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.altOmExternalLink}
          onPress={() => Linking.openURL('https://helsenorge.no')}
        >
          <Ionicons name="open-outline" size={18} color="#7b4397" />
          <Text style={styles.altOmExternalLinkText}>Besøk Helsenorge.no</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderExpandedContent = (sectionId) => {
    switch (sectionId) {
      case 'historie': return renderHistorieContent();
      case 'transport': return renderTransportContent();
      case 'parker': return renderParkerContent();
      case 'uteliv': return renderUtelivContent();
      case 'helse': return renderHelseContent();
      default: return null;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessible={true} accessibilityLabel="Gå tilbake" accessibilityHint="Navigerer til forrige skjerm" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Alt om {district}</Text>
      </View>
      <ScrollView style={styles.screenContent}>
        <Text style={styles.subtitle}>Alt du trenger å vite om {district}</Text>
        {sections.map((section) => (
          <View key={section.id}>
            <TouchableOpacity
              style={[
                styles.listItem,
                expandedSection === section.id && styles.listItemExpanded
              ]}
              onPress={() => toggleSection(section.id)}
              accessible={true}
              accessibilityLabel={`${section.title}, ${section.desc}`}
              accessibilityHint={expandedSection === section.id ? "Trykk for å lukke" : "Trykk for å utvide"}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandedSection === section.id }}
            >
              <View style={[styles.listIcon, { backgroundColor: '#f3e8ff' }]}>
                <MaterialIcons name={section.icon} size={28} color="#7b4397" />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>{section.title}</Text>
                <Text style={styles.listDescription}>{section.desc}</Text>
              </View>
              <Ionicons
                name={expandedSection === section.id ? "chevron-down" : "chevron-forward"}
                size={24}
                color={expandedSection === section.id ? "#7b4397" : "#ccc"}
              />
            </TouchableOpacity>
            {expandedSection === section.id && renderExpandedContent(section.id)}
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

// News Detail Modal
const NewsDetailModal = ({ visible, newsItem, onClose }) => {
  if (!newsItem) return null;

  const handleShare = () => {
    Alert.alert('Del nyhet', newsItem.title);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.newsDetailModal}>
          <TouchableOpacity onPress={onClose} style={styles.eventCloseButton}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>

          <View style={[styles.newsDetailBadge, { backgroundColor: newsItem.color }]}>
            <Text style={styles.newsDetailCategory}>{newsItem.category}</Text>
          </View>

          <Text style={styles.newsDetailTitle}>{newsItem.title}</Text>

          <View style={styles.newsDetailMeta}>
            <Ionicons name="calendar-outline" size={16} color="#888" />
            <Text style={styles.newsDetailMetaText}>{newsItem.date}</Text>
            {newsItem.readTime && (
              <>
                <Text style={styles.newsDetailMetaDot}>•</Text>
                <Ionicons name="time-outline" size={16} color="#888" />
                <Text style={styles.newsDetailMetaText}>{newsItem.readTime} lesetid</Text>
              </>
            )}
          </View>

          <ScrollView style={styles.newsDetailScroll}>
            <Text style={styles.newsDetailContent}>{newsItem.fullContent || newsItem.title}</Text>

            {newsItem.source && (
              <View style={styles.newsSource}>
                <Text style={styles.newsSourceLabel}>Kilde:</Text>
                <Text style={styles.newsSourceText}>{newsItem.source}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.newsDetailButtons}>
            <TouchableOpacity style={styles.newsShareButton} onPress={handleShare}>
              <Ionicons name="share-social" size={20} color="#7b4397" />
              <Text style={styles.newsShareButtonText}>Del artikkel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Nyheter Screen
const NyheterScreen = ({ onBack, news, onAddNews, onDeleteNews, district }) => {
  const shortName = getShortName(district);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleAdd = (values) => {
    const newNews = {
      id: Date.now(),
      title: values.title,
      category: values.category,
      color: colors[Math.floor(Math.random() * colors.length)],
      date: new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' }),
      fullContent: values.content,
      source: values.source,
      readTime: '2 min',
    };
    onAddNews(newNews);
  };

  const openDetail = (item) => {
    setSelectedNews(item);
    setDetailVisible(true);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessible={true} accessibilityLabel="Gå tilbake" accessibilityHint="Navigerer til forrige skjerm" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Nyheter på {shortName}</Text>
      </View>
      <ScrollView style={styles.screenContent}>
        <Text style={styles.subtitle}>Siste nytt fra {district}</Text>
        {news.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.newsCard}
            activeOpacity={0.7}
            onPress={() => openDetail(item)}
            delayLongPress={500}
            onLongPress={() => {
              Alert.alert('Slett', `Vil du slette "${item.title}"?`, [
                { text: 'Avbryt', style: 'cancel' },
                { text: 'Slett', style: 'destructive', onPress: () => onDeleteNews(item.id) },
              ]);
            }}
          >
            <View style={styles.newsHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: item.color }]}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.newsDate}>{item.date}</Text>
            </View>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <View style={styles.readMore}>
              <Text style={styles.readMoreText}>Les mer</Text>
              <Ionicons name="arrow-forward" size={16} color="#7b4397" />
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#7b4397' }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Legg til nyhet</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Trykk for å lese mer • Hold inne for å slette</Text>
      </ScrollView>
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
        title="Legg til nyhet"
        fields={[
          { key: 'title', placeholder: 'Overskrift' },
          { key: 'category', placeholder: 'Kategori (f.eks. Trafikk)' },
          { key: 'content', placeholder: 'Innhold' },
          { key: 'source', placeholder: 'Kilde (valgfritt)' },
        ]}
      />
      <NewsDetailModal
        visible={detailVisible}
        newsItem={selectedNews}
        onClose={() => setDetailVisible(false)}
      />
    </View>
  );
};

// Card Components
const Card = ({ title, icon, bgColor, textColor = '#fff', onPress }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: bgColor }]}
    onPress={onPress}
    accessible={true}
    accessibilityLabel={title}
    accessibilityHint={`Trykk for å åpne ${title}`}
    accessibilityRole="button"
  >
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={[styles.plusButton, { backgroundColor: textColor === '#fff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)' }]}>
        <Ionicons name="add" size={20} color={textColor === '#fff' ? '#fff' : '#e67e22'} />
      </View>
    </View>
    <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
  </TouchableOpacity>
);

const SmallCard = ({ title, icon, bgColor, onPress }) => (
  <TouchableOpacity
    style={[styles.smallCard, { backgroundColor: bgColor }]}
    onPress={onPress}
    accessible={true}
    accessibilityLabel={title}
    accessibilityHint={`Trykk for å åpne ${title}`}
    accessibilityRole="button"
  >
    <View style={styles.smallCardHeader}>
      <View style={styles.smallIconContainer}>{icon}</View>
      <View style={styles.smallPlusButton}>
        <Ionicons name="add" size={18} color="#fff" />
      </View>
    </View>
    <Text style={styles.smallCardTitle}>{title}</Text>
  </TouchableOpacity>
);

const DayTab = ({ day, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.dayTab, isActive && styles.dayTabActive]}
    onPress={onPress}
    accessible={true}
    accessibilityLabel={`${day}${isActive ? ', valgt' : ''}`}
    accessibilityHint={`Trykk for å se arrangementer på ${day.toLowerCase()}`}
    accessibilityRole="tab"
    accessibilityState={{ selected: isActive }}
  >
    <Text style={[styles.dayTabText, isActive && styles.dayTabTextActive]}>{day}</Text>
  </TouchableOpacity>
);

// Side Menu Component
const SideMenu = ({ onNavigate, userProfile, businessName, onChangeProfile }) => {
  const isBusiness = userProfile === 'business';
  return (
    <View style={styles.sideMenu} accessibilityRole="navigation" accessibilityLabel="Hovedmeny">
      {/* Profile indicator */}
      <TouchableOpacity
        style={[styles.sideMenuProfile, isBusiness ? styles.sideMenuProfileBusiness : styles.sideMenuProfilePrivate]}
        onPress={onChangeProfile}
        accessible={true}
        accessibilityLabel={isBusiness ? `Bedrift: ${businessName}. Trykk for å bytte profil` : "Privatperson. Trykk for å bytte profil"}
        accessibilityRole="button"
      >
        <Ionicons name={isBusiness ? "business" : "person"} size={18} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sideMenuItem} onPress={() => onNavigate('search')} accessible={true} accessibilityLabel="Søk" accessibilityHint="Søk i nabolaget" accessibilityRole="button">
        <Ionicons name="search-outline" size={26} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.sideMenuItem, styles.sideMenuItemColored, { backgroundColor: '#3b82f6' }]} onPress={() => onNavigate('altom')} accessible={true} accessibilityLabel="Alt om nabolaget" accessibilityHint="Informasjon om ditt nabolag" accessibilityRole="button">
        <Feather name="arrow-right-circle" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.sideMenuItem, styles.sideMenuItemColored, { backgroundColor: '#1e3a5f' }]} onPress={() => onNavigate('nyheter')} accessible={true} accessibilityLabel="Nyheter" accessibilityHint="Lokale nyheter" accessibilityRole="button">
        <MaterialIcons name="article" size={26} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.sideMenuItem, styles.sideMenuItemColored, { backgroundColor: '#fff' }]} onPress={() => onNavigate('hvaskjer')} accessible={true} accessibilityLabel="Hva skjer" accessibilityHint="Arrangementer i nabolaget" accessibilityRole="button">
        <MaterialIcons name="event" size={26} color="#e67e22" />
      </TouchableOpacity>
      <View style={styles.sideMenuDivider} accessibilityElementsHidden={true} />
      <TouchableOpacity style={[styles.sideMenuPlus, { backgroundColor: '#e67e22' }]} onPress={() => onNavigate('leiesentralen')} accessible={true} accessibilityLabel="Leiesentralen" accessibilityHint="Lån og utlån av ting" accessibilityRole="button">
        <FontAwesome5 name="hands-helping" size={16} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.sideMenuPlus, { backgroundColor: '#9b59b6' }]} onPress={() => onNavigate('lokalt')} accessible={true} accessibilityLabel="Lokale bedrifter" accessibilityHint="Butikker og restauranter" accessibilityRole="button">
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.sideMenuPlus, { backgroundColor: '#c77dba' }]} onPress={() => onNavigate('oppdateringer')} accessible={true} accessibilityLabel="Oppdateringer" accessibilityHint="Oppdateringer fra fellesskapet" accessibilityRole="button">
        <Ionicons name="heart-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// Home Screen
const HomeScreen = ({ onNavigate, district, isLoadingLocation, onRefreshLocation, selectedDay, onDaySelect, refreshing, onRefresh, userProfile, businessName, onChangeProfile }) => {
  const days = ['MANDAG', 'TIRSDAG', 'ONSDAG', 'TORSDAG', 'FREDAG', 'LØRDAG', 'SØNDAG'];
  const shortName = getShortName(district);

  const handleDayPress = (index) => {
    // Hvis samme dag trykkes igjen, nullstill (vis alle)
    if (selectedDay === index) {
      onDaySelect(null);
    } else {
      onDaySelect(index);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SideMenu onNavigate={onNavigate} userProfile={userProfile} businessName={businessName} onChangeProfile={onChangeProfile} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" colors={['#fff']} />
        }
      >
        <TouchableOpacity onPress={onRefreshLocation} style={styles.headerContainer}>
          {isLoadingLocation ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="location" size={20} color="#fff" style={styles.locationIcon} />
              <Text style={styles.header}>{district}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.cardsContainer}>
          <View style={styles.row}>
            <Card
              title="Leiesentralen"
              bgColor="#e67e22"
              icon={<FontAwesome5 name="hands-helping" size={24} color="#fff" />}
              onPress={() => onNavigate('leiesentralen')}
            />
            <Card
              title={`Hva skjer på ${shortName}?`}
              bgColor="#fff"
              textColor="#333"
              icon={<MaterialIcons name="event" size={28} color="#e67e22" />}
              onPress={() => onNavigate('hvaskjer')}
            />
          </View>

          <View style={styles.row}>
            <Card
              title={`${shortName} Lokalt`}
              bgColor="#9b59b6"
              icon={<Ionicons name="checkmark-circle" size={26} color="#fff" />}
              onPress={() => onNavigate('lokalt')}
            />
            <Card
              title="Oppdateringer fra Fellesskapet"
              bgColor="#c77dba"
              icon={<Ionicons name="heart-outline" size={26} color="#fff" />}
              onPress={() => onNavigate('oppdateringer')}
            />
          </View>

          <View style={styles.row}>
            <SmallCard
              title={`Alt om ${district}`}
              bgColor="#3b82f6"
              icon={<Feather name="arrow-right-circle" size={22} color="#fff" />}
              onPress={() => onNavigate('altom')}
            />
            <SmallCard
              title={`Nyheter på ${shortName}`}
              bgColor="#1e3a5f"
              icon={<MaterialIcons name="article" size={24} color="#fff" />}
              onPress={() => onNavigate('nyheter')}
            />
          </View>
        </View>

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

        <View style={styles.dayNavigation}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <DayTab
              day="ALLE"
              isActive={selectedDay === null}
              onPress={() => onDaySelect(null)}
            />
            {days.map((day, index) => (
              <DayTab
                key={day}
                day={day}
                isActive={selectedDay === index}
                onPress={() => handleDayPress(index)}
              />
            ))}
          </ScrollView>
        </View>
        {selectedDay !== null && (
          <TouchableOpacity
            style={styles.dayFilterBanner}
            onPress={() => onNavigate('hvaskjer')}
          >
            <Ionicons name="calendar" size={18} color="#fff" />
            <Text style={styles.dayFilterText}>
              Viser arrangementer for {days[selectedDay].toLowerCase()}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

// Profile Selection Styles (must be before component)
const profileStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#a855f7' },
  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 18, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  appName: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center', fontStyle: 'italic', marginBottom: 40 },
  subtitle: { fontSize: 22, fontWeight: '600', color: '#fff', textAlign: 'center', marginBottom: 24 },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 3, borderColor: 'transparent' },
  optionCardActive: { borderColor: '#e67e22', backgroundColor: '#fff9f5' },
  optionCardActiveBusiness: { borderColor: '#9b59b6', backgroundColor: '#faf5ff' },
  optionIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff3e6', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  optionIconActive: { backgroundColor: '#e67e22' },
  optionIconActiveBusiness: { backgroundColor: '#9b59b6' },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  optionTitleActive: { color: '#333' },
  optionDesc: { fontSize: 13, color: '#666', lineHeight: 18 },
  businessInput: { backgroundColor: '#fff', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16, borderWidth: 2, borderColor: '#9b59b6' },
  continueButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c3aed', paddingVertical: 16, borderRadius: 12, marginTop: 10 },
  continueButtonText: { fontSize: 18, fontWeight: '600', color: '#fff', marginRight: 8 },
});

// Profile Selection Screen
const ProfileSelectionScreen = ({ onSelectProfile }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    if (!selectedType) {
      Alert.alert('Velg profiltype', 'Vennligst velg om du er privatperson eller bedrift');
      return;
    }
    if (selectedType === 'business' && !businessName.trim()) {
      Alert.alert('Mangler bedriftsnavn', 'Vennligst skriv inn bedriftsnavnet ditt');
      return;
    }
    onSelectProfile(selectedType, selectedType === 'business' ? businessName.trim() : null);
  };

  return (
    <View style={[profileStyles.container, { paddingTop: insets.top + 40 }]}>
      <View style={profileStyles.content}>
        <Text style={profileStyles.title}>Velkommen til</Text>
        <Text style={profileStyles.appName}>Nabolaget</Text>
        <Text style={profileStyles.subtitle}>Hvem er du?</Text>

        <TouchableOpacity
          style={[profileStyles.optionCard, selectedType === 'private' && profileStyles.optionCardActive]}
          onPress={() => setSelectedType('private')}
        >
          <View style={[profileStyles.optionIcon, selectedType === 'private' && profileStyles.optionIconActive]}>
            <Ionicons name="happy-outline" size={32} color={selectedType === 'private' ? '#fff' : '#e67e22'} />
          </View>
          <View style={profileStyles.optionText}>
            <Text style={[profileStyles.optionTitle, selectedType === 'private' && profileStyles.optionTitleActive]}>Privatperson</Text>
            <Text style={profileStyles.optionDesc}>Utforsk nabolaget, finn arrangementer og lokale bedrifter</Text>
          </View>
          {selectedType === 'private' && <Ionicons name="checkmark-circle" size={24} color="#e67e22" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[profileStyles.optionCard, selectedType === 'business' && profileStyles.optionCardActiveBusiness]}
          onPress={() => setSelectedType('business')}
        >
          <View style={[profileStyles.optionIcon, selectedType === 'business' && profileStyles.optionIconActiveBusiness]}>
            <Ionicons name="business" size={32} color={selectedType === 'business' ? '#fff' : '#9b59b6'} />
          </View>
          <View style={profileStyles.optionText}>
            <Text style={[profileStyles.optionTitle, selectedType === 'business' && profileStyles.optionTitleActive]}>Bedrift</Text>
            <Text style={profileStyles.optionDesc}>Promoter din bedrift og arrangementer til lokale beboere</Text>
          </View>
          {selectedType === 'business' && <Ionicons name="checkmark-circle" size={24} color="#9b59b6" />}
        </TouchableOpacity>

        {selectedType === 'business' && (
          <TextInput
            style={profileStyles.businessInput}
            placeholder="Skriv inn bedriftsnavnet ditt"
            value={businessName}
            onChangeText={setBusinessName}
            placeholderTextColor="#999"
          />
        )}

        <TouchableOpacity style={profileStyles.continueButton} onPress={handleContinue}>
          <Text style={profileStyles.continueButtonText}>Fortsett</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main App
export default function App() {
  const [screen, setScreen] = useState('home');
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [businesses, setBusinesses] = useState(DEFAULT_BUSINESSES);
  const [updates, setUpdates] = useState(DEFAULT_UPDATES);
  const [news, setNews] = useState(DEFAULT_NEWS);
  const [isLoading, setIsLoading] = useState(true);
  const [district, setDistrict] = useState('Oslo');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [hasLoadedDistrictData, setHasLoadedDistrictData] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null); // null = vis alle, 0-6 = mandag-søndag
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // null = not set, 'private', 'business'
  const [businessName, setBusinessName] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Oppdater data når bydel endres
  useEffect(() => {
    if (district && district !== 'Oslo' && !hasLoadedDistrictData) {
      // Last bydels-spesifikke data
      setEvents(getDistrictEvents(district));
      setBusinesses(getDistrictBusinesses(district));
      setUpdates(getDistrictUpdates(district));
      setNews(getDistrictNews(district));
      setHasLoadedDistrictData(true);
    }
  }, [district, hasLoadedDistrictData]);

  // Get location and find district
  const getLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Tillatelse', 'Vi trenger tilgang til posisjonen din for å finne bydelen.');
        setDistrict('Oslo');
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      const nearestDistrict = findNearestDistrict(latitude, longitude);
      setDistrict(nearestDistrict);

      // Save district to storage
      await AsyncStorage.setItem('current_district', nearestDistrict);
    } catch (error) {
      console.log('Location error:', error);
      // Try to load last known district
      const savedDistrict = await AsyncStorage.getItem('current_district');
      if (savedDistrict) {
        setDistrict(savedDistrict);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const loadProfile = async () => {
    try {
      const [storedProfile, storedBusinessName] = await Promise.all([
        AsyncStorage.getItem('user_profile'),
        AsyncStorage.getItem('business_name'),
      ]);
      if (storedProfile) {
        setUserProfile(storedProfile);
        if (storedBusinessName) setBusinessName(storedBusinessName);
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    } finally {
      setProfileLoaded(true);
    }
  };

  // Load data from storage on app start
  useEffect(() => {
    loadAllData();
    loadProfile();
    getLocation();
  }, []);

  const handleSelectProfile = async (profileType, bizName) => {
    try {
      await AsyncStorage.setItem('user_profile', profileType);
      if (bizName) {
        await AsyncStorage.setItem('business_name', bizName);
        setBusinessName(bizName);
      }
      setUserProfile(profileType);
    } catch (error) {
      console.log('Error saving profile:', error);
    }
  };

  const handleChangeProfile = () => {
    Alert.alert(
      'Bytt profil',
      'Er du sikker på at du vil bytte profiltype?',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Bytt',
          onPress: async () => {
            await AsyncStorage.removeItem('user_profile');
            await AsyncStorage.removeItem('business_name');
            setUserProfile(null);
            setBusinessName(null);
          }
        },
      ]
    );
  };

  const loadAllData = async () => {
    try {
      const [storedItems, storedEvents, storedBusinesses, storedUpdates, storedNews, storedFavorites] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ITEMS),
        AsyncStorage.getItem(STORAGE_KEYS.EVENTS),
        AsyncStorage.getItem(STORAGE_KEYS.BUSINESSES),
        AsyncStorage.getItem(STORAGE_KEYS.UPDATES),
        AsyncStorage.getItem(STORAGE_KEYS.NEWS),
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
      ]);

      if (storedItems) setItems(JSON.parse(storedItems));
      if (storedEvents) setEvents(JSON.parse(storedEvents));
      if (storedBusinesses) setBusinesses(JSON.parse(storedBusinesses));
      if (storedUpdates) setUpdates(JSON.parse(storedUpdates));
      if (storedNews) setNews(JSON.parse(storedNews));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save functions
  const saveItems = async (newItems) => {
    setItems(newItems);
    await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(newItems));
  };

  const saveEvents = async (newEvents) => {
    setEvents(newEvents);
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(newEvents));
  };

  const saveBusinesses = async (newBusinesses) => {
    setBusinesses(newBusinesses);
    await AsyncStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(newBusinesses));
  };

  const saveUpdates = async (newUpdates) => {
    setUpdates(newUpdates);
    await AsyncStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(newUpdates));
  };

  const saveNews = async (newNews) => {
    setNews(newNews);
    await AsyncStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newNews));
  };

  // Add/Delete handlers
  const handleAddItem = (item) => saveItems([item, ...items]);
  const handleDeleteItem = (id) => saveItems(items.filter(i => i.id !== id));

  const handleAddEvent = (event) => saveEvents([event, ...events]);
  const handleDeleteEvent = (id) => saveEvents(events.filter(e => e.id !== id));

  const handleAddBusiness = (biz) => saveBusinesses([biz, ...businesses]);
  const handleDeleteBusiness = (id) => saveBusinesses(businesses.filter(b => b.id !== id));

  const handleAddUpdate = (update) => saveUpdates([update, ...updates]);
  const handleDeleteUpdate = (id) => saveUpdates(updates.filter(u => u.id !== id));

  const handleAddNews = (item) => saveNews([item, ...news]);
  const handleDeleteNews = (id) => saveNews(news.filter(n => n.id !== id));

  const goBack = () => setScreen('home');

  const onRefresh = async () => {
    setRefreshing(true);
    await getLocation();
    // Oppdater data for bydelen
    setEvents(getDistrictEvents(district));
    setBusinesses(getDistrictBusinesses(district));
    setUpdates(getDistrictUpdates(district));
    setNews(getDistrictNews(district));
    setRefreshing(false);
  };

  const toggleFavorite = async (eventId) => {
    const newFavorites = favorites.includes(eventId)
      ? favorites.filter(id => id !== eventId)
      : [...favorites, eventId];
    setFavorites(newFavorites);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
  };

  const isFavorite = (eventId) => favorites.includes(eventId);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#a855f7', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 18 }}>Laster...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Show profile selection if not set
  if (!userProfile) {
    return (
      <SafeAreaProvider>
        <ProfileSelectionScreen onSelectProfile={handleSelectProfile} />
      </SafeAreaProvider>
    );
  }

  if (screen === 'search') {
    return <SearchScreen onBack={goBack} items={items} events={events} businesses={businesses} updates={updates} news={news} onNavigate={setScreen} district={district} />;
  }
  if (screen === 'leiesentralen') {
    return <LeiesentralenScreen onBack={goBack} items={items} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} />;
  }
  if (screen === 'hvaskjer') {
    return <HvaSkjerScreen onBack={goBack} events={events} onAddEvent={handleAddEvent} onDeleteEvent={handleDeleteEvent} district={district} selectedDay={selectedDay} onDaySelect={setSelectedDay} favorites={favorites} toggleFavorite={toggleFavorite} isFavorite={isFavorite} userProfile={userProfile} userBusinessName={businessName} />;
  }
  if (screen === 'lokalt') {
    return <LokkaLokaltScreen onBack={goBack} businesses={businesses} onAddBusiness={handleAddBusiness} onDeleteBusiness={handleDeleteBusiness} district={district} />;
  }
  if (screen === 'oppdateringer') {
    return <OppdateringerScreen onBack={goBack} updates={updates} onAddUpdate={handleAddUpdate} onDeleteUpdate={handleDeleteUpdate} district={district} />;
  }
  if (screen === 'altom') {
    return <AltOmScreen onBack={goBack} district={district} />;
  }
  if (screen === 'nyheter') {
    return <NyheterScreen onBack={goBack} news={news} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} district={district} />;
  }

  return <HomeScreen onNavigate={setScreen} district={district} isLoadingLocation={isLoadingLocation} onRefreshLocation={getLocation} selectedDay={selectedDay} onDaySelect={setSelectedDay} refreshing={refreshing} onRefresh={onRefresh} userProfile={userProfile} businessName={businessName} onChangeProfile={handleChangeProfile} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#a855f7', paddingTop: 50, flexDirection: 'row' },
  scrollView: { flex: 1 },

  // Side Menu
  sideMenu: {
    width: 60,
    backgroundColor: '#7c3aed',
    paddingTop: 70,
    alignItems: 'center',
    paddingBottom: 25,
    marginTop: -50,
  },
  sideMenuItem: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 10,
  },
  sideMenuItemColored: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sideMenuDivider: {
    width: 36,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 14,
  },
  sideMenuPlus: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sideMenuProfile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  sideMenuProfilePrivate: { backgroundColor: '#e67e22' },
  sideMenuProfileBusiness: { backgroundColor: '#9b59b6' },
  header: { fontSize: 32, fontWeight: 'bold', color: '#fff', fontStyle: 'italic' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, minHeight: 40 },
  locationIcon: { marginRight: 8 },
  cardsContainer: { paddingHorizontal: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: { width: '48%', borderRadius: 16, padding: 16, minHeight: 120, justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  plusButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  smallCard: { width: '48%', borderRadius: 16, padding: 14, minHeight: 100, justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  smallCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  smallIconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  smallPlusButton: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.3)' },
  smallCardTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginTop: 8 },
  adBanner: { backgroundColor: '#fbbf24', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative' },
  adLeft: { flex: 1 },
  adSmallText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  adBigText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  adRight: { backgroundColor: '#dc2626', borderRadius: 8, padding: 10, alignItems: 'center' },
  adLabel: { fontSize: 10, color: '#fff', fontWeight: '600' },
  adPrice: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  adTag: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  adTagText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  dayNavigation: { backgroundColor: '#1f2937', marginTop: 4, paddingVertical: 3, paddingHorizontal: 8 },
  dayTab: { paddingHorizontal: 14, paddingVertical: 12, marginHorizontal: 4, borderRadius: 8, minHeight: 44 },
  dayTabActive: { backgroundColor: '#374151' },
  dayTabText: { fontSize: 13, color: '#9ca3af', fontWeight: '700' },
  dayTabTextActive: { color: '#fff' },
  dayFilterBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#a855f7', marginHorizontal: 16, marginTop: 12, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  dayFilterText: { color: '#fff', fontSize: 14, fontWeight: '600', marginHorizontal: 8, flex: 1 },
  dayNavigationInner: { backgroundColor: '#1f2937', paddingVertical: 3, paddingHorizontal: 8 },

  // Empty state
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyStateText: { fontSize: 16, color: '#555', marginTop: 16, fontWeight: '500' },
  emptyStateHint: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },

  // Screen styles
  screenContainer: { flex: 1, backgroundColor: '#fff' },
  screenHeader: { backgroundColor: '#a855f7', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 16, padding: 8, minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  screenContent: { flex: 1, padding: 16 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  hint: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 10, marginBottom: 30 },

  // Business registration box
  businessRegistrationBox: { backgroundColor: '#f3e8ff', borderRadius: 16, padding: 20, marginTop: 20, alignItems: 'center', borderWidth: 2, borderColor: '#9b59b6', borderStyle: 'dashed' },
  businessRegistrationTitle: { fontSize: 18, fontWeight: 'bold', color: '#7b4397', marginBottom: 8 },
  businessRegistrationText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },

  // List styles
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 12, padding: 18, marginBottom: 14, minHeight: 80 },
  listIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  listContent: { flex: 1 },
  listTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  listDescription: { fontSize: 14, color: '#555', marginTop: 2 },
  listItemExpanded: { backgroundColor: '#f9f5ff', borderColor: '#a855f7', borderWidth: 1 },

  // Alt Om expanded content
  altOmExpandedContent: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#a855f7' },
  altOmContentTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  altOmContentText: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 16 },
  altOmHighlightsTitle: { fontSize: 14, fontWeight: '600', color: '#7b4397', marginBottom: 8 },
  altOmHighlightItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  altOmHighlightText: { fontSize: 14, color: '#555', marginLeft: 8 },

  // Transport section
  altOmTransportSection: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  altOmTransportHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  altOmTransportTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginLeft: 8 },
  altOmTransportLine: { fontSize: 14, color: '#666', marginLeft: 28, marginBottom: 4 },

  // Park cards
  altOmParkCard: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10, marginBottom: 12 },
  altOmParkHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  altOmParkName: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 8 },
  altOmParkDesc: { fontSize: 14, color: '#555', marginBottom: 6 },
  altOmParkLocation: { flexDirection: 'row', alignItems: 'center' },
  altOmParkAddress: { fontSize: 13, color: '#555', marginLeft: 4 },

  // School section
  altOmSchoolSection: { marginBottom: 16 },
  altOmSchoolHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  altOmSchoolTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginLeft: 8 },
  altOmSchoolItem: { fontSize: 14, color: '#666', marginLeft: 28, marginBottom: 4 },

  // Health section
  altOmLegevaktCard: { backgroundColor: '#dc2626', padding: 14, borderRadius: 10, marginBottom: 16 },
  altOmLegevaktHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  altOmLegevaktTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginLeft: 8 },
  altOmLegevaktText: { fontSize: 14, color: '#fff', marginBottom: 10 },
  altOmLegevaktCall: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  altOmLegevaktCallText: { fontSize: 14, fontWeight: '600', color: '#fff', marginLeft: 6 },
  altOmHelseSection: { marginBottom: 16 },
  altOmHelseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  altOmHelseTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginLeft: 8 },
  altOmHelseItem: { fontSize: 14, color: '#666', marginLeft: 28, marginBottom: 4 },

  // External link
  altOmExternalLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3e8ff', padding: 12, borderRadius: 8, marginTop: 8 },
  altOmExternalLinkText: { fontSize: 14, fontWeight: '600', color: '#7b4397', marginLeft: 8 },

  // Date box
  dateBox: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#e67e22', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  dateBoxBusiness: { backgroundColor: '#9b59b6' },
  dateText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  monthText: { fontSize: 12, color: '#fff' },

  // Business badge for events
  eventTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  businessBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#9b59b6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  businessBadgeText: { fontSize: 10, color: '#fff', fontWeight: '600', marginLeft: 3 },
  businessNameText: { fontSize: 12, color: '#9b59b6', fontWeight: '500', marginTop: 2 },

  // Poster type selector
  posterTypeSelector: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  posterTypeLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  posterTypeButtons: { flexDirection: 'row', gap: 10 },
  posterTypeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#f5f5f5', borderWidth: 2, borderColor: '#e0e0e0' },
  posterTypeButtonActive: { backgroundColor: '#e67e22', borderColor: '#e67e22' },
  posterTypeButtonActiveBusiness: { backgroundColor: '#9b59b6', borderColor: '#9b59b6' },
  posterTypeButtonText: { fontSize: 14, fontWeight: '600', color: '#666', marginLeft: 6 },
  posterTypeButtonTextActive: { color: '#fff' },
  postingAsIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  postingAsText: { fontSize: 13, color: '#9b59b6', marginLeft: 6, fontWeight: '500' },

  // Event detail
  eventDetail: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  eventDetailText: { fontSize: 12, color: '#555', marginLeft: 4 },

  // Avatar
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },

  // Rating
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 14, fontWeight: '600', color: '#333', marginLeft: 4 },

  // Update card
  updateCard: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 12 },
  updateHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 15, fontWeight: '600', color: '#333' },
  timeText: { fontSize: 12, color: '#555' },
  updateContent: { fontSize: 15, color: '#333', lineHeight: 22 },
  updateActions: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  updateAction: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  updateActionText: { fontSize: 14, color: '#555', marginLeft: 4 },

  // News card
  newsCard: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 12 },
  newsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  newsDate: { fontSize: 12, color: '#555' },
  newsTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  readMore: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  readMoreText: { fontSize: 14, fontWeight: '600', color: '#7b4397', marginRight: 4 },

  // Action button
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: 16, marginTop: 20 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalScrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelButton: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#f5f5f5', marginRight: 8, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, color: '#666', fontWeight: '600' },
  addButton: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#a855f7', marginLeft: 8, alignItems: 'center' },
  addButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },

  // Search styles
  searchContainer: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  searchPlaceholder: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  searchPlaceholderText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 16, paddingHorizontal: 40 },
  searchResultCount: { fontSize: 14, color: '#666', marginBottom: 16 },
  searchResult: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 12, padding: 14, marginBottom: 10 },
  searchResultIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  searchResultContent: { flex: 1 },
  searchResultCategory: { fontSize: 11, color: '#555', fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  searchResultTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  searchResultDesc: { fontSize: 13, color: '#666' },

  // Item Detail Modal styles
  detailModalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '90%', maxWidth: 400 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  detailIcon: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  closeButton: { padding: 4 },
  detailTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  detailDescription: { fontSize: 16, color: '#666', marginBottom: 20 },
  ownerSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, marginBottom: 20 },
  ownerAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#e67e22', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  ownerAvatarText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  ownerInfo: { flex: 1 },
  ownerLabel: { fontSize: 12, color: '#555', marginBottom: 2 },
  ownerName: { fontSize: 16, fontWeight: '600', color: '#333' },
  ownerTag: { fontSize: 12, color: '#e67e22', marginTop: 4 },
  contactButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  contactButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, marginHorizontal: 4 },
  contactButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  phoneNumber: { fontSize: 14, color: '#555', textAlign: 'center' },

  // Event Detail Modal styles
  eventDetailModal: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '90%', maxWidth: 400, maxHeight: '85%' },
  eventModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  favoriteButton: { padding: 4 },
  eventCloseButton: { padding: 4 },
  eventDateBadge: { width: 70, height: 70, borderRadius: 16, backgroundColor: '#e67e22', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  eventDateBig: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  eventMonthBig: { fontSize: 14, color: '#fff', textTransform: 'uppercase' },
  eventDetailTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  eventInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  eventInfoText: { fontSize: 16, color: '#555', marginLeft: 10 },
  eventDescriptionBox: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginTop: 16, marginBottom: 16 },
  eventDescriptionTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  eventDescriptionText: { fontSize: 15, color: '#333', lineHeight: 22 },
  eventButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  eventButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, marginHorizontal: 4 },
  eventButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },

  // Business Detail Modal styles
  businessDetailModal: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '90%', maxWidth: 400, maxHeight: '85%' },
  businessHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  businessAvatar: { width: 70, height: 70, borderRadius: 20, backgroundColor: '#9b59b6', justifyContent: 'center', alignItems: 'center' },
  businessAvatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  businessRating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  businessRatingText: { fontSize: 16, fontWeight: 'bold', color: '#b45309', marginLeft: 4 },
  businessDetailTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  businessCategory: { fontSize: 16, color: '#9b59b6', fontWeight: '600', marginBottom: 16 },
  businessInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  businessInfoText: { fontSize: 15, color: '#555', marginLeft: 10, flex: 1 },
  businessDescriptionBox: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginTop: 12, marginBottom: 16 },
  businessDescriptionTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  businessDescriptionText: { fontSize: 15, color: '#333', lineHeight: 22 },
  businessButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  businessButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, marginHorizontal: 4 },
  businessButtonText: { color: '#fff', fontSize: 14, fontWeight: '600', marginLeft: 6 },
  websiteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  websiteButtonText: { fontSize: 14, color: '#9b59b6', marginLeft: 6, textDecorationLine: 'underline' },
  addressTag: { fontSize: 12, color: '#9b59b6', marginTop: 4 },

  // Update Detail Modal styles
  updateDetailModal: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '90%', maxWidth: 400, maxHeight: '80%' },
  updateDetailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  updateDetailAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#c77dba', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  updateDetailAvatarText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  updateDetailAuthorInfo: { flex: 1 },
  updateDetailAuthorName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  updateDetailTime: { fontSize: 14, color: '#555', marginTop: 2 },
  updateDetailScroll: { maxHeight: 200, marginBottom: 16 },
  updateDetailContent: { fontSize: 16, color: '#333', lineHeight: 24 },
  updateDetailStats: { flexDirection: 'row', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee', marginBottom: 12 },
  updateStat: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  updateStatText: { fontSize: 14, color: '#666', marginLeft: 6 },
  updateDetailButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  updateDetailButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 },
  updateDetailButtonActive: { backgroundColor: '#fee2e2', borderRadius: 20 },
  updateDetailButtonText: { fontSize: 14, color: '#666', marginLeft: 6, fontWeight: '500' },

  // News Detail Modal styles
  newsDetailModal: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '90%', maxWidth: 400, maxHeight: '85%' },
  newsDetailBadge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginBottom: 12 },
  newsDetailCategory: { fontSize: 13, fontWeight: '600', color: '#fff', textTransform: 'uppercase' },
  newsDetailTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 12, lineHeight: 30 },
  newsDetailMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  newsDetailMetaText: { fontSize: 14, color: '#555', marginLeft: 4 },
  newsDetailMetaDot: { marginHorizontal: 8, color: '#555' },
  newsDetailScroll: { maxHeight: 280, marginBottom: 16 },
  newsDetailContent: { fontSize: 16, color: '#333', lineHeight: 26 },
  newsSource: { flexDirection: 'row', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  newsSourceLabel: { fontSize: 14, color: '#555' },
  newsSourceText: { fontSize: 14, color: '#333', fontWeight: '500', marginLeft: 6 },
  newsDetailButtons: { alignItems: 'center' },
  newsShareButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: '#7b4397', borderRadius: 12 },
  newsShareButtonText: { fontSize: 15, color: '#7b4397', fontWeight: '600', marginLeft: 8 },
});
