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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isCloudConnected: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: (useRedirect?: boolean) => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<boolean>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    // Test initial connection to Firestore
    testFirestoreConnection().then(connected => {
      setIsCloudConnected(connected);
    });

    // Handle any incoming redirect auth result (e.g., mobile redirect login)
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await syncUserProfile(result.user);
        }
      })
      .catch((err) => {
        console.warn('Redirect auth result warning:', err);
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

  const signInWithGoogle = async (useRedirect: boolean = false): Promise<boolean> => {
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, googleProvider);
        return true;
      }

      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
      }
      closeAuthModal();
      return true;
    } catch (error: any) {
      // Check if popup was blocked (frequent on mobile / Samsung Browser)
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
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    if (result.user) {
      await syncUserProfile(result.user);
    }
    closeAuthModal();
    return true;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<boolean> => {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (result.user) {
      if (displayName?.trim()) {
        await updateProfile(result.user, { displayName: displayName.trim() });
        await syncUserProfile({
          ...result.user,
          displayName: displayName.trim()
        } as User);
      } else {
        await syncUserProfile(result.user);
      }
    }
    closeAuthModal();
    return true;
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
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
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
