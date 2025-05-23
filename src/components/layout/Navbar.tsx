
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut, UserCircle, Shield, LayoutDashboard, CalendarPlus, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function Navbar() {
  const { user, loading, isAdmin, setMockAuth } = useAuth(); // Added setMockAuth
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth); // This will trigger onAuthStateChanged in AuthProvider
      // Explicitly clear mock auth state from React state and localStorage
      setMockAuth(null, false); 
      toast({ title: 'Logged out successfully.' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: 'Logout failed.', description: (error as Error).message, variant: 'destructive' });
    }
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          Eventide
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {loading ? (
            <div className="h-8 w-20 bg-primary-foreground/20 animate-pulse rounded-md"></div>
          ) : user ? (
            <>
              <Button variant="ghost" size="sm" className="hover:bg-primary-foreground/10" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
                </Link>
              </Button>
              {isAdmin && (
                <Button variant="ghost" size="sm" className="hover:bg-primary-foreground/10" asChild>
                  <Link href="/admin">
                    <Shield className="mr-1 h-4 w-4" /> Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-primary-foreground/10">
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
              <UserCircle className="h-7 w-7 text-primary-foreground" />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hover:bg-primary-foreground/10" asChild>
                <Link href="/login">
                  <LogIn className="mr-1 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button variant="secondary" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
