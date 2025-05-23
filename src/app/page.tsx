import EventList from '@/components/events/EventList';
import type { Event } from '@/types';

// Dummy data - replace with API call or Firestore fetch
const DUMMY_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    date: '2024-10-15',
    time: '09:00 AM',
    location: 'Online',
    description: 'Join us for the biggest tech conference of the year. Explore new technologies and network with experts.',
    price: 49.99,
    imageUrl: 'https://placehold.co/600x400/3F51B5/FFFFFF.png?text=TechConf',
    organizer: 'Tech Inc.',
    keywords: 'technology, programming, AI, machine learning, web development'
  },
  {
    id: '2',
    title: 'Art & Music Festival',
    date: '2024-11-05',
    time: '02:00 PM',
    location: 'City Park Amphitheater',
    description: 'A vibrant festival celebrating local artists and musicians. Food, fun, and creativity for all ages.',
    price: 15.00,
    imageUrl: 'https://placehold.co/600x400/7E57C2/FFFFFF.png?text=ArtFest',
    organizer: 'City Arts Council',
    keywords: 'art, music, festival, local, family friendly'
  },
  {
    id: '3',
    title: 'Startup Pitch Night',
    date: '2024-09-28',
    time: '06:00 PM',
    location: 'Innovation Hub Downtown',
    description: 'Watch innovative startups pitch their ideas to a panel of investors. Networking opportunities available.',
    price: 0, // Free event
    imageUrl: 'https://placehold.co/600x400/4CAF50/FFFFFF.png?text=StartupNight',
    organizer: 'Venture Catalysts',
    keywords: 'startup, entrepreneurship, investment, business, networking'
  },
    {
    id: '4',
    title: 'Culinary Workshop: Italian Cuisine',
    date: '2024-10-22',
    time: '11:00 AM',
    location: 'The Grand Kitchen Studio',
    description: 'Learn to cook authentic Italian dishes with Chef Giovanni. Hands-on experience and delicious food guaranteed.',
    price: 75.00,
    imageUrl: 'https://placehold.co/600x400/FF9800/FFFFFF.png?text=CookingClass',
    organizer: 'Chef Giovanni',
    keywords: 'cooking, italian food, workshop, culinary, foodies'
  },
];


export default function HomePage() {
  // In a real app, fetch events from an API or Firestore
  // const [events, setEvents] = useState<Event[]>([]);
  // useEffect(() => { asyncFetchEvents().then(setEvents); }, []);

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card shadow-md rounded-lg">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Welcome to Eventide</h1>
        <p className="mt-2 text-lg text-muted-foreground">Discover, book, and enjoy amazing events near you or online.</p>
      </section>
      
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center sm:text-left">Upcoming Events</h2>
        <EventList events={DUMMY_EVENTS} />
      </section>
    </div>
  );
}
