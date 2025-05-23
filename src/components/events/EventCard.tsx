"use client";

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, MapPin, DollarSign, Star, Eye } from 'lucide-react';
import type { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useToast } from '@/hooks/use-toast';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { toast } = useToast();
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
  
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={event.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(event.title)}`}
          alt={event.title}
          width={600}
          height={300}
          className="w-full h-48 object-cover"
          data-ai-hint="event concert"
        />
        {event.price === 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2 bg-accent text-accent-foreground">FREE</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2 line-clamp-2 text-primary">{event.title}</CardTitle>
        <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-accent" />
            <span>{new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-accent" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-accent" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-3 text-sm mb-3">{event.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex flex-col sm:flex-row justify-between items-center gap-2 border-t">
        <div className="font-semibold text-lg text-primary">
          {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant={isWatched ? "secondary" : "outline"} size="sm" onClick={handleWatchToggle} className="flex-1 sm:flex-none">
            {isWatched ? <Star className="h-4 w-4 mr-1 fill-current" /> : <Star className="h-4 w-4 mr-1" />}
            {isWatched ? 'Watching' : 'Watch'}
          </Button>
          <Button asChild size="sm" className="flex-1 sm:flex-none bg-primary hover:bg-primary/90">
            <Link href={`/events/${event.id}`}>
              <Eye className="h-4 w-4 mr-1" /> View Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
