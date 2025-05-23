"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Star, Loader2 } from 'lucide-react';
import EventCard from '@/components/events/EventCard'; // Re-use EventCard for watched list

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Or a message, but useEffect should redirect
  }

  // Placeholder for actual bookings
  const bookedEvents = []; 

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.displayName || user.email}!</h1>
        <p className="text-muted-foreground">Manage your event bookings and watchlist here.</p>
      </section>

      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ticket className="mr-2 h-6 w-6 text-primary" /> My Bookings
            </CardTitle>
            <CardDescription>Events you have booked tickets for.</CardDescription>
          </CardHeader>
          <CardContent>
            {bookedEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven&apos;t booked any events yet.</p>
                <Button onClick={() => router.push('/')}>Explore Events</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Placeholder for booked event cards */}
                {/* {bookedEvents.map(event => <BookedEventCard key={event.id} event={event} />)} */}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      
      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-6 w-6 text-accent" /> My Watchlist
            </CardTitle>
            <CardDescription>Events you are interested in.</CardDescription>
          </CardHeader>
          <CardContent>
            {watchlist.length === 0 ? (
               <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Your watchlist is empty. Add some events!</p>
                <Button onClick={() => router.push('/')}>Browse Events</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchlist.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
