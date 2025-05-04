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
import { signIn, sendVerificationEmail } from '../src/services/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen email ve şifrenizi girin');
      return;
    }

    setLoading(true);
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        let errorMessage = 'Giriş sırasında bir hata oluştu';
        
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Geçersiz email adresi';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Bu hesap devre dışı bırakılmış';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Kullanıcı bulunamadı';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Hatalı şifre';
            break;
        }
        
        Alert.alert('Hata', errorMessage);
      } else {
        if (!user.emailVerified) {
          Alert.alert(
            'Email Doğrulama',
            'Email adresiniz doğrulanmamış. Doğrulama maili gönderilsin mi?',
            [
              {
                text: 'Hayır',
                style: 'cancel'
              },
              {
                text: 'Evet',
                onPress: async () => {
                  try {
                    await sendVerificationEmail(user);
                    Alert.alert('Başarılı', 'Doğrulama maili gönderildi');
                  } catch (error) {
                    Alert.alert('Hata', 'Doğrulama maili gönderilemedi');
                  }
                }
              }
            ]
          );
        } else {
          router.replace('/wing-selection');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Hata', 'Giriş sırasında bir hata oluştu');
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
        <Text style={styles.title}>Giriş Yap</Text>
        
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
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleEmailLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Text>
        </TouchableOpacity>
        
        <Link href="/register" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Hesabınız yok mu? Kayıt olun</Text>
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