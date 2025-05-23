
"use client";

import type { Event } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookingsState {
  bookedEvents: Event[];
  addBooking: (event: Event) => void;
  removeBooking: (eventId: string) => void;
  isBooked: (eventId: string) => boolean;
}

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookedEvents: [],
      addBooking: (event) =>
        set((state) => {
          if (!state.bookedEvents.find((e) => e.id === event.id)) {
            return { bookedEvents: [...state.bookedEvents, event] };
          }
          return state;
        }),
      removeBooking: (eventId) =>
        set((state) => ({
          bookedEvents: state.bookedEvents.filter((event) => event.id !== eventId),
        })),
      isBooked: (eventId: string) => {
        return !!get().bookedEvents.find((event) => event.id === eventId);
      }
    }),
    {
      name: 'eventide-bookings-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
