import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signUp } from '../src/services/firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    try {
      const { user, error } = await signUp(email, password);
      
      if (error) {
        let errorMessage = 'Kayıt sırasında bir hata oluştu';
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Bu email adresi zaten kullanımda';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Geçersiz email adresi';
            break;
          case 'auth/weak-password':
            errorMessage = 'Şifre çok zayıf';
            break;
        }
        
        Alert.alert('Hata', errorMessage);
      } else {
        Alert.alert(
          'Başarılı',
          'Kayıt başarılı! Lütfen email adresinizi doğrulayın.',
          [
            {
              text: 'Tamam',
              onPress: () => router.replace('/login')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Kayıt Ol</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Şifre Tekrar"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </Text>
        </TouchableOpacity>
        
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Zaten hesabınız var mı? Giriş yapın</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
}); 