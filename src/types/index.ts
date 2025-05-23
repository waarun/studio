export interface Event {
  id: string;
  title: string;
  date: string; // Consider using Date object or ISO string
  time: string;
  location: string;
  description: string;
  price: number; // Or string if currency formatting is complex
  imageUrl?: string;
  organizer?: string; // Could be user ID or name
  keywords?: string; // Comma-separated keywords for AI
}

// Add other types like User, Booking as needed
// For Firebase User, you can import firebase/auth User type
// import type { User as FirebaseUser } from 'firebase/auth';
// export type User = FirebaseUser & { customClaims?: { admin?: boolean } };
