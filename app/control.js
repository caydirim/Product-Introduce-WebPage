import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { router, Link } from 'expo-router';

export default function ControlScreen() {
  const [fanSpeed, setFanSpeed] = useState(0);
  const [attackAngle, setAttackAngle] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    // WiFi bağlantısı için gerekli kodlar buraya gelecek
    setIsConnected(true);
    Alert.alert('Success', 'Connected to Wind Tunnel');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    Alert.alert('Info', 'Disconnected from Wind Tunnel');
  };

  const handleStartTest = () => {
    if (!isConnected) {
      Alert.alert('Error', 'Please connect to Wind Tunnel first');
      return;
    }
    // Test başlatma işlemleri buraya gelecek
    Alert.alert('Info', 'Test started');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wind Tunnel Control</Text>
      <Link href="/users" style={styles.button}>
        <Text style={styles.buttonText}>View Users</Text>
      </Link>
      <View style={styles.connectionStatus}>
        <Text style={styles.statusText}>
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
        <TouchableOpacity
          style={[styles.button, isConnected ? styles.disconnectButton : styles.connectButton]}
          onPress={isConnected ? handleDisconnect : handleConnect}
        >
          <Text style={styles.buttonText}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlSection}>
        <Text style={styles.label}>Fan Speed: {fanSpeed}%</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={fanSpeed}
          onValueChange={setFanSpeed}
          disabled={!isConnected}
        />

        <Text style={styles.label}>Attack Angle: {attackAngle}°</Text>
        <Slider
          style={styles.slider}
          minimumValue={-15}
          maximumValue={15}
          value={attackAngle}
          onValueChange={setAttackAngle}
          disabled={!isConnected}
        />
      </View>

      <TouchableOpacity
        style={[styles.startButton, !isConnected && styles.disabledButton]}
        onPress={handleStartTest}
        disabled={!isConnected}
      >
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Test Results</Text>
        <LineChart
          data={{
            labels: ['0', '5', '10', '15', '20', '25'],
            datasets: [
              {
                data: [0, 0, 0, 0, 0, 0],
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  connectionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
  },
  disconnectButton: {
    backgroundColor: '#FF5252',
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 