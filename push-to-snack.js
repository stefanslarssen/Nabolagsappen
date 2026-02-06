const { Snack } = require('snack-sdk');
const fs = require('fs');
const path = require('path');

async function pushToSnack() {
  // Les App.js
  const appCode = fs.readFileSync(path.join(__dirname, 'App.js'), 'utf8');

  // Opprett Snack
  const snack = new Snack({
    name: 'Nabolagsappen',
    description: 'Nabolagsapp for Oslo',
    sdkVersion: '51.0.0',
    files: {
      'App.js': {
        type: 'CODE',
        contents: appCode
      }
    },
    dependencies: {
      '@expo/vector-icons': { version: '^14.0.0' },
      '@react-native-async-storage/async-storage': { version: '1.23.1' },
      'expo-location': { version: '~17.0.1' },
      'react-native-safe-area-context': { version: '4.10.1' }
    }
  });

  console.log('Laster opp til Expo Snack...');

  try {
    // Lagre snack
    const { id, url } = await snack.saveAsync();
    console.log('\n✅ Snack opprettet!');
    console.log('ID:', id);
    console.log('URL:', url);
    console.log('\nÅpne denne i nettleseren:', `https://snack.expo.dev/${id}`);
  } catch (error) {
    console.error('Feil:', error.message);
  }
}

pushToSnack();
