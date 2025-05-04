import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged, 
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDCECB8N59CZWMbf4sPBJuPpcCgbfMw89s",
  authDomain: "desktop-wind-tunnel-project.firebaseapp.com",
  databaseURL: "https://desktop-wind-tunnel-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "desktop-wind-tunnel-project",
  storageBucket: "desktop-wind-tunnel-project.firebasestorage.app",
  messagingSenderId: "164242396344",
  appId: "1:164242396344:web:9b93eb12374f8c873d904d",
  measurementId: "G-G5PE2ELYDG"
};

// Firebase'i başlat (sadece bir kez)
let app;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Email doğrulama gönder
    try {
      await sendEmailVerification(user);
      console.log('Email verification sent successfully');
    } catch (verificationError) {
      console.error('Error sending verification email:', verificationError);
      throw verificationError;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Firebase Sign Up Error:', error);
    return { user: null, error };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Firebase Sign In Error:', error);
    return { user: null, error };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Firebase Sign Out Error:', error);
    return { error };
  }
};

export const getCurrentUser = () => {
  return auth?.currentUser;
};

export const onAuthStateChanged = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return { error: null };
  } catch (error) {
    console.error('Send Verification Email Error:', error);
    return { error };
  }
};

export { auth }; 