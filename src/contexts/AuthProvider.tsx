
"use client";

import type { User, IdTokenResult, UserMetadata } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { ReactNode } from 'react';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

const MOCK_USER_STORAGE_KEY = 'eventideMockUser';

interface StoredMockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  setMockAuth: (mockUser: User | null, adminStatus: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  setMockAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Effect to load mock user from localStorage on initial client-side mount
  useEffect(() => {
    // This code runs only on the client after hydration
    try {
      const storedMockUserJSON = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (storedMockUserJSON) {
        const storedMockUser: StoredMockUser = JSON.parse(storedMockUserJSON);
        // Create a User-like object from stored data
        const mockUserForState: User = {
          uid: storedMockUser.uid,
          email: storedMockUser.email,
          displayName: storedMockUser.displayName,
          emailVerified: true, // Assume verified for mock
          isAnonymous: false,
          metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() } as UserMetadata,
          providerData: [],
          providerId: 'mock',
          refreshToken: 'mock-refresh-token',
          delete: async () => { console.log('Mock user delete called'); },
          getIdToken: async () => 'mock-id-token',
          getIdTokenResult: async () => ({
            token: 'mock-id-token',
            claims: { admin: storedMockUser.isAdmin } as any, // Cast to any for simplicity on claims
            authTime: new Date().toISOString(),
            expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
            issuedAtTime: new Date().toISOString(),
            signInFactor: null,
            signInProvider: 'mock',
          } as IdTokenResult),
          reload: async () => { console.log('Mock user reload called'); },
          toJSON: () => ({ uid: storedMockUser.uid, email: storedMockUser.email, displayName: storedMockUser.displayName }),
        };
        setUser(mockUserForState);
        setIsAdmin(storedMockUser.isAdmin);
        setLoading(false); // Mock user loaded, initial loading phase for mock path is done
      }
    } catch (error) {
      console.error("Failed to load mock user from localStorage:", error);
      localStorage.removeItem(MOCK_USER_STORAGE_KEY); // Clear corrupted data
    }
    // If no mock user in localStorage, setLoading(false) will be handled by onAuthStateChanged
  }, []); // Empty array means this runs once on mount (client-side)

  const setMockAuth = (mockUser: User | null, adminStatus: boolean) => {
    setUser(mockUser);
    setIsAdmin(adminStatus);
    if (mockUser) {
      const storableMockUser: StoredMockUser = {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        isAdmin: adminStatus,
      };
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(storableMockUser));
    } else {
      localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    }
    setLoading(false); // State is now determined (either mock or no mock)
  };

  // Effect for Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Real Firebase user logged in
        setUser(firebaseUser);
        // Admin check logic for real Firebase user
        const emailIsAdmin = firebaseUser.email?.includes('admin@eventide.com') || false;
        // In a real app, use custom claims:
        // const tokenResult = await firebaseUser.getIdTokenResult();
        // const claimsAdmin = !!tokenResult.claims.admin;
        setIsAdmin(emailIsAdmin /* || claimsAdmin */);
        localStorage.removeItem(MOCK_USER_STORAGE_KEY); // Real user takes precedence, clear any mock user
      } else {
        // No Firebase user (logout or initial state with no session)
        // If a mock user isn't currently intended to be active (i.e., not in localStorage from a setMockAuth call or initial load),
        // then ensure user state is null.
        const mockUserStillInStorage = localStorage.getItem(MOCK_USER_STORAGE_KEY);
        if (!mockUserStillInStorage) {
          setUser(null);
          setIsAdmin(false);
        }
        // If mockUserStillInStorage *is* present, it means a mock user is intended to be active,
        // so onAuthStateChanged(null) shouldn't clear the React state for that user.
        // It will be cleared by an explicit call to setMockAuth(null, ...) e.g. during mock logout.
      }
      setLoading(false); // Firebase auth state determined, or re-confirmed, loading is complete.
    });

    return () => unsubscribe();
  }, []); // Empty array means this runs once on mount for listener setup

  if (loading) {
    // Basic loading state to prevent layout shifts or content flashing
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary text-primary-foreground p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full" />
        </main>
        <footer className="bg-muted text-muted-foreground p-4 text-center">
          <Skeleton className="h-4 w-48 mx-auto" />
        </footer>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, setMockAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
