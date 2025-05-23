"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CalendarDays, Clock, MapPin, DollarSign, ArrowLeft, Ticket, Star } from 'lucide-react';
import type { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useWatchlist } from '@/hooks/useWatchlist';

// Dummy data - replace with API call or Firestore fetch by ID
const DUMMY_EVENTS: Event[] = [
    {
    id: '1',
    title: 'Tech Conference 2024',
    date: '2024-10-15',
    time: '09:00 AM',
    location: 'Online',
    description: 'Join us for the biggest tech conference of the year. Explore new technologies, insightful talks from industry leaders, hands-on workshops, and network with experts from around the globe. This year focuses on AI, Quantum Computing, and Sustainable Tech.',
    price: 49.99,
    imageUrl: 'https://placehold.co/1200x600/3F51B5/FFFFFF.png?text=TechConf+Details',
    organizer: 'Tech Inc.',
    keywords: 'technology, programming, AI, machine learning, web development, quantum, sustainable'
  },
  {
    id: '2',
    title: 'Art & Music Festival',
    date: '2024-11-05',
    time: '02:00 PM',
    location: 'City Park Amphitheater, 123 Main St, Anytown, USA',
    description: 'A vibrant festival celebrating local artists and musicians. Enjoy live bands, art installations, food trucks, and craft stalls. Fun for the whole family with dedicated kids zones and interactive activities.',
    price: 15.00,
    imageUrl: 'https://placehold.co/1200x600/7E57C2/FFFFFF.png?text=ArtFest+Details',
    organizer: 'City Arts Council',
    keywords: 'art, music, festival, local, family friendly, outdoor, live performance'
  },
   {
    id: '3',
    title: 'Startup Pitch Night',
    date: '2024-09-28',
    time: '06:00 PM',
    location: 'Innovation Hub Downtown, 789 Tech Ave, Anytown, USA',
    description: 'Watch innovative startups pitch their groundbreaking ideas to a panel of seasoned investors and VCs. An excellent opportunity for networking with entrepreneurs, mentors, and potential co-founders. Light refreshments will be served.',
    price: 0,
    imageUrl: 'https://placehold.co/1200x600/4CAF50/FFFFFF.png?text=StartupNight+Details',
    organizer: 'Venture Catalysts',
    keywords: 'startup, entrepreneurship, investment, business, networking, innovation, pitch'
  },
  {
    id: '4',
    title: 'Culinary Workshop: Italian Cuisine',
    date: '2024-10-22',
    time: '11:00 AM',
    location: 'The Grand Kitchen Studio, 456 Gourmet Rd, Anytown, USA',
    description: 'Learn to cook authentic Italian dishes with renowned Chef Giovanni. This hands-on workshop covers pasta making from scratch, classic sauces, and a traditional dessert. All ingredients and equipment provided. Enjoy your creations at the end!',
    price: 75.00,
    imageUrl: 'https://placehold.co/1200x600/FF9800/FFFFFF.png?text=CookingClass+Details',
    organizer: 'Chef Giovanni',
    keywords: 'cooking, italian food, workshop, culinary, foodies, hands-on, gourmet'
  },
];


export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { user } = useAuth();
  const { toast } = useToast();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Find the event (replace with actual data fetching)
  const event = DUMMY_EVENTS.find(e => e.id === id);

  if (!event) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-6">The event you are looking for does not exist or may have been moved.</p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Events
        </Button>
      </div>
    );
  }

  const isWatched = watchlist.some(watchedEvent => watchedEvent.id === event.id);

  const handleWatchToggle = () => {
    if (isWatched) {
      removeFromWatchlist(event.id);
      toast({ title: "Removed from Watchlist", description: `"${event.title}" is no longer in your watchlist.` });
    } else {
      addToWatchlist(event);
      toast({ title: "Added to Watchlist", description: `"${event.title}" is now in your watchlist.` });
    }
  };

  const handleBookEvent = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to book this event.',
        variant: 'destructive',
        action: <Button onClick={() => router.push('/login')} size="sm">Login</Button>,
      });
      return;
    }
    // Placeholder for booking logic
    toast({
      title: 'Booking Successful (Placeholder)',
      description: `You've "booked" a seat for ${event.title}. Check your dashboard!`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Button>

      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="p-0 relative">
          <Image
            src={event.imageUrl || `https://placehold.co/1200x600.png?text=${encodeURIComponent(event.title)}`}
            alt={event.title}
            width={1200}
            height={400}
            className="w-full h-64 md:h-96 object-cover"
            data-ai-hint="event stage"
          />
          {event.price === 0 && (
             <Badge variant="destructive" className="absolute top-4 right-4 text-lg px-4 py-2 bg-accent text-accent-foreground">FREE</Badge>
          )}
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <CardTitle className="text-3xl md:text-4xl font-bold mb-4 text-primary">{event.title}</CardTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-3 text-accent" />
              <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-accent" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center col-span-1 md:col-span-2">
              <MapPin className="h-5 w-5 mr-3 text-accent" />
              <span>{event.location}</span>
            </div>
            {event.organizer && (
              <div className="flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-accent lucide lucide-megaphone"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                <span>Organized by: {event.organizer}</span>
              </div>
            )}
          </div>

          <h3 className="text-xl font-semibold mb-2 text-foreground">About this event</h3>
          <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed mb-8">{event.description}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/50 rounded-lg">
            <div className="text-3xl font-bold text-primary">
              {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free Event'}
            </div>
            <div className="flex gap-3">
              <Button variant={isWatched ? "secondary" : "outline"} size="lg" onClick={handleWatchToggle}>
                {isWatched ? <Star className="h-5 w-5 mr-2 fill-current" /> : <Star className="h-5 w-5 mr-2" />}
                {isWatched ? 'Watching' : 'Add to Watchlist'}
              </Button>
              <Button size="lg" onClick={handleBookEvent} className="bg-accent hover:bg-accent/90">
                <Ticket className="mr-2 h-5 w-5" /> Book Seat
              </Button>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}
