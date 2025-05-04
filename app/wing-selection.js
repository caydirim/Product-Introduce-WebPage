import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const wingTypes = [
  {
    id: 'naca0012',
    name: 'NACA 0012',
    description: 'Simetrik kanat profili',
    image: require('../assets/wings/naca0012.png')
  },
  {
    id: 'naca2412',
    name: 'NACA 2412',
    description: 'Kamberli kanat profili',
    image: require('../assets/wings/naca2412.png')
  },
  {
    id: 'naca4412',
    name: 'NACA 4412',
    description: 'Yüksek kamberli kanat profili',
    image: require('../assets/wings/naca4412.png')
  },
  {
    id: 'naca1408',
    name: 'NACA 1408',
    description: 'Düşük kamberli kanat profili',
    image: require('../assets/wings/naca1408.png')
  }
];

export default function WingSelection() {
  const router = useRouter();

  const handleWingSelect = (wingId) => {
    router.push({
      pathname: '/test',
      params: { wingId }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kanat Profili Seçin</Text>
      <View style={styles.wingList}>
        {wingTypes.map((wing) => (
          <TouchableOpacity
            key={wing.id}
            style={styles.wingItem}
            onPress={() => handleWingSelect(wing.id)}
          >
            <View style={styles.wingContent}>
              <Image source={wing.image} style={styles.wingImage} />
              <View style={styles.wingTextContainer}>
                <Text style={styles.wingName}>{wing.name}</Text>
                <Text style={styles.wingDescription}>{wing.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  wingList: {
    gap: 15
  },
  wingItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  wingContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  wingImage: {
    width: 80,
    height: 60,
    marginRight: 15,
    resizeMode: 'contain'
  },
  wingTextContainer: {
    flex: 1
  },
  wingName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  wingDescription: {
    fontSize: 14,
    color: '#666'
  }
}); 