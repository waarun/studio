
"use server";

import { revalidatePath } from 'next/cache';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Event } from '@/types';
import { generateEventDescription } from '@/ai/flows/generate-event-description.ts';
import type { GenerateEventDescriptionInput, GenerateEventDescriptionOutput } from '@/ai/flows/generate-event-description.ts';

// Action to add a new event to Firestore
export async function addEvent(eventData: Omit<Event, 'id'>): Promise<{ id: string } | { error: string }> {
  try {
    // Consider adding validation here with Zod if not handled sufficiently by the form
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    revalidatePath('/'); // Revalidate home page to show new event
    revalidatePath('/admin/events'); // Revalidate admin events page
    revalidatePath('/admin'); // Revalidate admin dashboard page
    return { id: docRef.id };
  } catch (error) {
    console.error("SERVER ACTION ERROR: Error adding event to Firestore:", error); // Enhanced logging
    let errorMessage = "Failed to create event due to an unexpected server error. Check server logs for details.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      // Attempt to stringify if it's a complex object, but be cautious
      try {
        const errorString = JSON.stringify(error);
        errorMessage = `Non-Error object received: ${errorString}`;
      } catch (e) {
        // Fallback if stringify fails or if it's a very unusual error type
        errorMessage = "Failed to create event. An unknown error object was received by the server action.";
      }
    }
    return { error: `Server Action Failed: ${errorMessage}` };
  }
}


// Action to generate event description using AI
export async function generateDescriptionAction(
  input: GenerateEventDescriptionInput
): Promise<GenerateEventDescriptionOutput> {
  // Input validation can be added here if needed

  try {
    const output = await generateEventDescription(input);
    return output;
  } catch (error) {
    console.error("AI description generation failed:", error);
    // This will be caught by the client component's catch block.
    // For a more structured error, the GenerateEventDescriptionOutput type
    // would need to include an optional error field, and this function would return it.
    // For now, rethrowing allows the client to handle it as a generic fetch failure for the action.
    throw error; 
  }
}

// Placeholder for fetching events (example, not fully implemented for client use directly yet)
// You would typically fetch this in a Server Component or use a library like SWR/React Query on client.
/*
import { getDocs, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';

export async function getEvents(count: number = 10): Promise<Event[]> {
  try {
    const eventsCol = collection(db, "events");
    const q = query(eventsCol, orderBy("date", "desc"), firestoreLimit(count));
    const eventSnapshot = await getDocs(q);
    const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    return eventList;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
*/

