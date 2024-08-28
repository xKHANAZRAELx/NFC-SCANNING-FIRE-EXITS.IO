import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

NfcManager.start();

const App = () => {
  const [statusMessage, setStatusMessage] = useState('Initializing NFC reader...');
  
  useEffect(() => {
    const checkNfcSupport = async () => {
      const isNfcSupported = await NfcManager.isSupported();
      if (isNfcSupported) {
        setStatusMessage('NFC reader is ready to scan. Please hold your device near an NFC tag.');
      } else {
        setStatusMessage('NFC scanning is not supported on this device.');
      }
    };

    checkNfcSupport();

    return () => {
      NfcManager.setEventListener(NfcTech.Ndef, () => {});
      NfcManager.setEventListener(NfcTech.Ndef, null);
      NfcManager.stop();
    };
  }, []);

  const scanNFC = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      const nfcData = tag.ndefMessage[0].payload;
      const decodedData = new TextDecoder().decode(nfcData);
      const timeOfDay = determineTimeOfDay();

      // Google Sheets Integration
      fetch('https://script.google.com/macros/s/AKfycbxir4SvkAzLI-u_MKRkUWev8pWSL8IpbhlQyyQvgIj8OzHv02aQcJcCILG9GtFn4V2_/exec', {
        method: 'POST',
        body: JSON.stringify({
          location: decodedData,
          timeOfDay: timeOfDay
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.text())
      .then(data => {
        setStatusMessage('NFC tag scanned and data sent to Google Sheets.');
        console.log('Data sent to Google Sheets:', data);
      })
      .catch(error => {
        setStatusMessage('Error sending data to Google Sheets.');
        console.error('Error sending data to Google Sheets:', error);
      });

      // AppSheet Integration (if needed)
      fetch('YOUR_APPSHEET_API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_APPSHEET_API_KEY'
        },
        body: JSON.stringify({
          location: decodedData,
          timeOfDay: timeOfDay
        })
      })
      .then(response => response.json())
      .then(data => {
        setStatusMessage('NFC tag scanned and data sent to AppSheet.');
        console.log('Data sent to AppSheet:', data);
      })
      .catch(error => {
        setStatusMessage('Error sending data to AppSheet.');
        console.error('Error sending data to AppSheet:', error);
      });

    } catch (ex) {
      console.warn(ex);
      setStatusMessage('Error during NFC scan.');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const determineTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'morning';
    } else if (hour < 18) {
      return 'afternoon';
    } else {
      return 'night';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>NFC Scanner</Text>
      <Text style={styles.status}>{statusMessage}</Text>
      <TouchableOpacity style={styles.button} onPress={scanNFC}>
        <Text style={styles.buttonText}>Scan NFC Tag</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#008CBA',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default App;
