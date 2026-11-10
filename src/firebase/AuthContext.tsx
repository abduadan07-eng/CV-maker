import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { auth, googleProvider, testFirestoreConnection } from './config';
import { syncUserProfile } from './cvFirestore';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  username?: string;
  emailVerified?: boolean;
}

interface StoredAccount {
  uid: string;
  email: string;
  passwordHash: string;
  displayName: string;
  photoURL: string;
  username: string;
  createdAt: string;
}

const STORAGE_KEY_SESSION = 'cv_maker_active_session_v2';
const STORAGE_KEY_ACCOUNTS = 'cv_maker_registered_accounts_v2';

interface AuthContextType {
  user: AppUser | User | null;
  loading: boolean;
  isCloudConnected: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: (useRedirect?: boolean) => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<boolean>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string; username?: string }) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to hash password simply for client store
function hashSecret(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return 'h_' + Math.abs(hash) + '_' + str.length;
}

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Failed to save accounts to storage:', e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    // 1. Test initial connection to Firestore
    testFirestoreConnection().then(connected => {
      setIsCloudConnected(connected);
    });

    // 2. Check for an active local session first
    try {
      const savedSessionRaw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (savedSessionRaw) {
        const parsed = JSON.parse(savedSessionRaw);
        if (parsed && parsed.uid && parsed.email) {
          setUser(parsed);
          setLoading(false);
        }
      }
    } catch (e) {
      console.warn('Failed restoring local session:', e);
    }

    // 3. Handle any incoming redirect auth result (e.g. mobile redirect login)
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setUser(result.user);
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          }));
          await syncUserProfile(result.user);
        }
      })
      .catch((err) => {
        console.warn('Redirect auth result warning:', err);
      });

    // 4. Firebase onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        }));
        try {
          await syncUserProfile(currentUser);
        } catch (err) {
          console.warn('Initial profile sync notice:', err);
        }
      } else {
        // If Firebase says no user, only clear if current session is not a local account
        const savedSessionRaw = localStorage.getItem(STORAGE_KEY_SESSION);
        if (!savedSessionRaw) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (useRedirect: boolean = false): Promise<boolean> => {
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, googleProvider);
        return true;
      }

      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setUser(result.user);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }));
        await syncUserProfile(result.user);
      }
      closeAuthModal();
      return true;
    } catch (error: any) {
      // Check if popup was blocked or failed in WebView / mobile
      if (error?.code === 'auth/popup-blocked') {
        console.warn('Popup blocked, attempting redirect sign-in');
        try {
          await signInWithRedirect(auth, googleProvider);
          return true;
        } catch (redirectErr) {
          console.error('Redirect sign-in error:', redirectErr);
          throw redirectErr;
        }
      }

      // Check if user simply closed the popup or cancelled the request
      const isPopupClosedByUser =
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/user-cancelled' ||
        (typeof error?.message === 'string' &&
          (error.message.includes('popup-closed-by-user') ||
           error.message.includes('cancelled-popup-request')));

      if (isPopupClosedByUser) {
        return false;
      }

      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Firebase Auth first
    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
      if (result.user) {
        setUser(result.user);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }));
        await syncUserProfile(result.user);
        closeAuthModal();
        return true;
      }
    } catch (firebaseErr: any) {
      console.warn('Firebase Email Sign-In notice:', firebaseErr?.code || firebaseErr?.message);

      // If wrong password, throw so the user knows
      if (firebaseErr?.code === 'auth/wrong-password' || firebaseErr?.code === 'auth/invalid-credential') {
        throw firebaseErr;
      }
      // If OPERATION_NOT_ALLOWED or user-not-found or network error, check our local store
    }

    // 2. Check local accounts store
    const accounts = getStoredAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.passwordHash !== hashSecret(password)) {
        const error = new Error('Email-ka ama Password-ka waa khalad.');
        (error as any).code = 'auth/wrong-password';
        throw error;
      }

      const appUser: AppUser = {
        uid: existing.uid,
        email: existing.email,
        displayName: existing.displayName,
        photoURL: existing.photoURL || null,
        username: existing.username
      };

      setUser(appUser);
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(appUser));
      await syncUserProfile(appUser).catch(() => {});
      closeAuthModal();
      return true;
    }

    // If account doesn't exist anywhere
    const error = new Error('Lama helin akoon leh email-kan. Fadlan marka hore isdiiwaangeli (Sign Up).');
    (error as any).code = 'auth/user-not-found';
    throw error;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (displayName || '').trim() || cleanEmail.split('@')[0];

    // 1. Try Firebase Auth first
    try {
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      if (result.user) {
        if (cleanName) {
          await updateProfile(result.user, { displayName: cleanName });
        }
        const appUser: AppUser = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: cleanName || result.user.displayName,
          photoURL: result.user.photoURL
        };
        setUser(appUser);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(appUser));
        await syncUserProfile(appUser).catch(() => {});
        closeAuthModal();
        return true;
      }
    } catch (firebaseErr: any) {
      console.warn('Firebase Email SignUp notice:', firebaseErr?.code || firebaseErr?.message);

      if (firebaseErr?.code === 'auth/email-already-in-use') {
        throw firebaseErr;
      }
      // If OPERATION_NOT_ALLOWED or other configuration issue, fallback to robust internal account engine!
    }

    // 2. Built-in account creation engine
    const accounts = getStoredAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      const error = new Error('Email-kan hore ayaa loo isticmaalay. Fadlan gal akoonkaaga (Sign In).');
      (error as any).code = 'auth/email-already-in-use';
      throw error;
    }

    const newUid = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    const newAccount: StoredAccount = {
      uid: newUid,
      email: cleanEmail,
      passwordHash: hashSecret(password),
      displayName: cleanName,
      photoURL: '',
      username: cleanEmail.split('@')[0],
      createdAt: new Date().toISOString()
    };

    accounts.push(newAccount);
    saveStoredAccounts(accounts);

    const appUser: AppUser = {
      uid: newAccount.uid,
      email: newAccount.email,
      displayName: newAccount.displayName,
      photoURL: null,
      username: newAccount.username
    };

    setUser(appUser);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(appUser));
    await syncUserProfile(appUser).catch(() => {});
    closeAuthModal();
    return true;
  };

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string; username?: string }) => {
    if (!user) return;

    const updatedUser: AppUser = {
      uid: user.uid,
      email: user.email,
      displayName: data.displayName !== undefined ? data.displayName : (user.displayName || null),
      photoURL: data.photoURL !== undefined ? data.photoURL : (user.photoURL || null),
      username: data.username !== undefined ? data.username : (user as any).username
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedUser));

    // Update in local accounts list if stored
    const accounts = getStoredAccounts();
    const idx = accounts.findIndex(a => a.uid === user.uid);
    if (idx !== -1) {
      if (data.displayName !== undefined) accounts[idx].displayName = data.displayName;
      if (data.photoURL !== undefined) accounts[idx].photoURL = data.photoURL;
      if (data.username !== undefined) accounts[idx].username = data.username;
      saveStoredAccounts(accounts);
    }

    // Update in Firebase if real Firebase user
    if (auth.currentUser && (data.displayName || data.photoURL)) {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName || auth.currentUser.displayName || undefined,
        photoURL: data.photoURL || auth.currentUser.photoURL || undefined
      }).catch(console.warn);
    }

    // Sync to Firestore
    await syncUserProfile(updatedUser).catch(console.warn);
  };

  const signOutUser = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      setUser(null);
      await signOut(auth).catch(() => {});
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isCloudConnected,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        updateUserProfile,
        signOutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
