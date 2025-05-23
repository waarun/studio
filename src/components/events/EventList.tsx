import type { Event } from '@/types';
import EventCard from './EventCard';

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  if (!events || events.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No events found. Check back soon!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
