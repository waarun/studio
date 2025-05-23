
"use client";

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { ReactNode } from 'react';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean; // Simplified admin check
  setMockAuth: (mockUser: User | null, adminStatus: boolean) => void; // New function
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  setMockAuth: () => {}, // Default no-op function
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const setMockAuth = (mockUser: User | null, adminStatus: boolean) => {
    setUser(mockUser);
    setIsAdmin(adminStatus);
    setLoading(false); // Ensure loading state is updated
  };

  useEffect(() => {
    // If a mock user is already set (e.g. by dev login), don't run Firebase auth listener immediately
    // This check is simplistic; a more robust solution might involve a flag.
    if (user && user.uid === 'dev-admin-uid') {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Simplified admin check: check for a specific UID or a custom claim
        // For a real app, use custom claims set on the backend
        // e.g. const tokenResult = await firebaseUser.getIdTokenResult();
        // setIsAdmin(!!tokenResult.claims.admin);
        
        // Placeholder: if user's email contains 'admin', consider them admin.
        // Replace this with proper role management (e.g. custom claims via Firebase Functions)
        setIsAdmin(firebaseUser.email?.includes('admin@eventide.com') || false);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Rerun if user changes from external source (e.g. initial load from mock)

  if (loading && !user) { // Keep loading state if user is not yet defined but loading is true
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
