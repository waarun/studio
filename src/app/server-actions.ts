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
    revalidatePath('/admin'); // Revalidate admin page
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding event to Firestore:", error);
    return { error: (error as Error).message || "Failed to create event." };
  }
}


// Action to generate event description using AI
export async function generateDescriptionAction(
  input: GenerateEventDescriptionInput
): Promise<GenerateEventDescriptionOutput> {
  // Input validation can be added here if needed
  // For example, using Zod to parse and validate `input`
  // if (!input.title || input.title.trim() === "") {
  //   return { error: "Event title is required for AI generation." };
  // }

  try {
    const output = await generateEventDescription(input);
    return output;
  } catch (error) {
    console.error("AI description generation failed:", error);
    // Return a structured error if your flow/AI model might throw specific errors
    // For now, rethrow or return a generic error message structure
    // For this specific setup, the AI flow should return an object,
    // but if the call itself fails (e.g. network issue to AI service), it might throw.
    // The flow is typed to return GenerateEventDescriptionOutput, so we assume it does,
    // or throws an error that the calling client component's catch block will handle.
    // It's safer to ensure this action always returns the expected Output type or a compatible error structure.
    // However, the AI flow is already designed to return GenerateEventDescriptionOutput.
    // If generateEventDescription itself throws, it will be caught by the client.
    // For robustness, this server action could also catch and format.
    // For now, assume generateEventDescription handles its errors or returns valid output.
    // This is a simplification. In production, ensure error types are consistent.
    // For this example, if generateEventDescription throws, the client's catch block will handle it.
    // But if we want server-side formatted errors:
    // return { description: "", error: (error as Error).message || "AI generation failed" };
    // This would require changing GenerateEventDescriptionOutput to include an optional error field.
    // The current AI flow does not define an error field in its output schema.
    // So we let errors propagate to be caught by the client component.
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
