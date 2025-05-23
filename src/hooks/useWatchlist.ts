"use client";

import type { Event } from '@/types';
import { create } from 'zustand';

interface WatchlistState {
  watchlist: Event[];
  addToWatchlist: (event: Event) => void;
  removeFromWatchlist: (eventId: string) => void;
  isWatched: (eventId: string) => boolean;
}

export const useWatchlist = create<WatchlistState>((set, get) => ({
  watchlist: [],
  addToWatchlist: (event) =>
    set((state) => {
      if (!state.watchlist.find((e) => e.id === event.id)) {
        return { watchlist: [...state.watchlist, event] };
      }
      return state;
    }),
  removeFromWatchlist: (eventId) =>
    set((state) => ({
      watchlist: state.watchlist.filter((event) => event.id !== eventId),
    })),
  isWatched: (eventId: string) => {
    return !!get().watchlist.find((event) => event.id === eventId);
  }
}));
