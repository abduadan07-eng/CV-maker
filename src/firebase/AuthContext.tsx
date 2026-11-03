import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth, googleProvider, testFirestoreConnection } from './config';
import { syncUserProfile } from './cvFirestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isCloudConnected: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  useEffect(() => {
    // Test initial connection to Firestore
    testFirestoreConnection().then(connected => {
      setIsCloudConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await syncUserProfile(currentUser);
        } catch (err) {
          console.warn('Initial profile sync notice:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isCloudConnected,
        signInWithGoogle,
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
