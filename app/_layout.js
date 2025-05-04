import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from '../src/services/firebase';

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      const inAuthGroup = segments[0] === '(auth)';
      
      if (!user && !inAuthGroup) {
        // Kullanıcı giriş yapmamış ve auth grubunda değilse, login sayfasına yönlendir
        router.replace('/login');
      } else if (user && inAuthGroup) {
        // Kullanıcı giriş yapmış ve auth grubundaysa, ana sayfaya yönlendir
        router.replace('/wing-selection');
      }
    });

    return () => unsubscribe();
  }, [segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="wing-selection"
        options={{
          title: 'Kanat Profili Seçimi',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="test"
        options={{
          title: 'Rüzgar Tüneli Testi',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
} 