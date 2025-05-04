import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from '../src/services/firebase';

export default function Index() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setInitialRoute(user ? '/wing-selection' : '/login');
    });

    return () => unsubscribe();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Redirect href={initialRoute} />;
} 