import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const wingTypes = {
  naca0012: {
    name: 'NACA 0012',
    description: 'Simetrik kanat profili',
    maxSpeed: 30
  },
  naca2412: {
    name: 'NACA 2412',
    description: 'Kamberli kanat profili',
    maxSpeed: 30
  },
  naca4412: {
    name: 'NACA 4412',
    description: 'Yüksek kamberli kanat profili',
    maxSpeed: 30
  },
  naca1408: {
    name: 'NACA 1408',
    description: 'Düşük kamberli kanat profili',
    maxSpeed: 30
  }
};

export default function TestScreen() {
  const { wingId } = useLocalSearchParams();
  const [testStatus, setTestStatus] = useState('ready');
  const [windSpeed, setWindSpeed] = useState(0);
  const [angleOfAttack, setAngleOfAttack] = useState(0);
  const [liftForce, setLiftForce] = useState(0);
  const [dragForce, setDragForce] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const [chartData, setChartData] = useState({
    labels: ['0'],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: [0],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 2
      }
    ]
  });
  const dataPoints = useRef([]);

  const calculateForces = (speed, angle) => {
    // Basit aerodinamik hesaplamalar (gerçek değerler için daha karmaşık formüller kullanılmalı)
    const lift = Math.pow(speed, 2) * Math.cos(angle * Math.PI / 180) * 0.5;
    const drag = Math.pow(speed, 2) * Math.sin(angle * Math.PI / 180) * 0.2;
    return { lift, drag };
  };

  const updateChart = (speed, lift, drag) => {
    // Ensure values are finite numbers
    const safeSpeed = isFinite(speed) ? Number(speed.toFixed(1)) : 0;
    const safeLift = isFinite(lift) ? Number(lift.toFixed(1)) : 0;
    const safeDrag = isFinite(drag) ? Number(drag.toFixed(1)) : 0;

    setChartData(prevData => {
      const newLabels = [...prevData.labels, safeSpeed.toString()];
      const newLiftData = [...prevData.datasets[0].data, safeLift];
      const newDragData = [...prevData.datasets[1].data, safeDrag];

      // Keep only the last 10 data points
      if (newLabels.length > 10) {
        newLabels.shift();
        newLiftData.shift();
        newDragData.shift();
      }

      return {
        labels: newLabels,
        datasets: [
          {
            ...prevData.datasets[0],
            data: newLiftData
          },
          {
            ...prevData.datasets[1],
            data: newDragData
          }
        ]
      };
    });
  };

  const startTest = () => {
    if (testStatus === 'running') return;
    
    setTestStatus('running');
    dataPoints.current = [];
    let currentSpeed = 0;
    const interval = setInterval(() => {
      currentSpeed += 0.5;
      if (currentSpeed >= wingTypes[wingId].maxSpeed) {
        clearInterval(interval);
        setTestStatus('completed');
        currentSpeed = wingTypes[wingId].maxSpeed;
      }
      setWindSpeed(currentSpeed);
      const { lift, drag } = calculateForces(currentSpeed, angleOfAttack);
      setLiftForce(lift);
      setDragForce(drag);
      setPressure(currentSpeed * 10);
      setTemperature(25 + currentSpeed * 0.1);
      updateChart(currentSpeed, lift, drag);
    }, 500);
  };

  const handleAngleChange = (newAngle) => {
    if (newAngle >= 0 && newAngle <= wingTypes[wingId].maxSpeed) {
      setAngleOfAttack(newAngle);
      const { lift, drag } = calculateForces(windSpeed, newAngle);
      setLiftForce(lift);
      setDragForce(drag);
      updateChart(windSpeed, lift, drag);
    }
  };

  const saveTestResults = () => {
    Alert.alert('Başarılı', 'Test sonuçları kaydedildi');
    router.back();
  };

  return (
    <LinearGradient
      colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Rüzgar Tüneli Testi</Text>
          <Text style={styles.subtitle}>{wingTypes[wingId].name}</Text>
          <Text style={styles.description}>{wingTypes[wingId].description}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Rüzgar Hızı</Text>
            <View style={styles.speedMeter}>
              <Text style={styles.speedValue}>{windSpeed.toFixed(1)} m/s</Text>
              <View style={styles.speedBar}>
                <View 
                  style={[
                    styles.speedProgress, 
                    { width: `${(windSpeed / wingTypes[wingId].maxSpeed) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>

          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Hücum Açısı</Text>
            <View style={styles.angleControls}>
              <TouchableOpacity
                style={styles.angleButton}
                onPress={() => handleAngleChange(angleOfAttack - 1)}
                disabled={angleOfAttack <= 0}
              >
                <Text style={styles.angleButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.angleValue}>{angleOfAttack}°</Text>
              <TouchableOpacity
                style={styles.angleButton}
                onPress={() => handleAngleChange(angleOfAttack + 1)}
                disabled={angleOfAttack >= wingTypes[wingId].maxSpeed}
              >
                <Text style={styles.angleButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Kuvvet Değişimi</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '4',
                strokeWidth: '1',
                stroke: '#ffa726'
              }
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            fromZero={true}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 128, 255, 1)' }]} />
              <Text style={styles.legendText}>Kaldırma Kuvveti</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 1)' }]} />
              <Text style={styles.legendText}>Sürükleme Kuvveti</Text>
            </View>
          </View>
        </View>

        <View style={styles.dataContainer}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Kaldırma Kuvveti</Text>
            <Text style={styles.dataValue}>{liftForce.toFixed(2)} N</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Sürükleme Kuvveti</Text>
            <Text style={styles.dataValue}>{dragForce.toFixed(2)} N</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Basınç</Text>
            <Text style={styles.dataValue}>{pressure.toFixed(2)} Pa</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Sıcaklık</Text>
            <Text style={styles.dataValue}>{temperature.toFixed(1)} °C</Text>
          </View>
        </View>

        <View style={styles.testArea}>
          {testStatus === 'ready' && (
            <TouchableOpacity style={styles.startButton} onPress={startTest}>
              <Text style={styles.startButtonText}>Testi Başlat</Text>
            </TouchableOpacity>
          )}

          {testStatus === 'running' && (
            <View style={styles.runningTest}>
              <Text style={styles.runningText}>Test Devam Ediyor...</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progress, 
                      { width: `${(windSpeed / wingTypes[wingId].maxSpeed) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round((windSpeed / wingTypes[wingId].maxSpeed) * 100)}%
                </Text>
              </View>
            </View>
          )}

          {testStatus === 'completed' && (
            <View style={styles.completedTest}>
              <Text style={styles.completedText}>Test Tamamlandı!</Text>
              <View style={styles.resultsContainer}>
                <Text style={styles.resultText}>
                  Maksimum Hız: {windSpeed.toFixed(1)} m/s{'\n'}
                  Maksimum Hücum Açısı: {angleOfAttack}°{'\n'}
                  Maksimum Kaldırma Kuvveti: {liftForce.toFixed(2)} N{'\n'}
                  Maksimum Sürükleme Kuvveti: {dragForce.toFixed(2)} N
                </Text>
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={saveTestResults}>
                <Text style={styles.saveButtonText}>Sonuçları Kaydet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 22,
    color: 'white',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  controlsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    margin: 20,
  },
  controlGroup: {
    marginBottom: 20,
  },
  controlLabel: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  speedMeter: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
  },
  speedValue: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  speedBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  speedProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  angleControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
  },
  angleButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  angleButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  angleValue: {
    fontSize: 24,
    color: 'white',
    marginHorizontal: 20,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center'
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    color: 'white',
    fontSize: 12,
  },
  dataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  dataCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 15,
  },
  dataLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  testArea: {
    padding: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  runningTest: {
    alignItems: 'center',
  },
  runningText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    color: 'white',
    marginTop: 10,
  },
  completedTest: {
    alignItems: 'center',
  },
  completedText: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 