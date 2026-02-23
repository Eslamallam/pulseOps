import { Event } from "@/features/explorer/types";

/**
 * In-memory ring buffer for system events
 * 
 * Stores the last 300 events with newest first.
 * Represents the backend logging system.
 */

const MAX_EVENTS = 300;
let events: Event[] = [];

/**
 * Add a new event to the store
 * Inserts at the beginning and trims old events if limit exceeded
 */
export function addEvent(event: Event): void {
  // Insert at beginning (newest first)
  events.unshift(event);

  // Trim to maximum size (remove oldest events)
  if (events.length > MAX_EVENTS) {
    events = events.slice(0, MAX_EVENTS);
  }
}

/**
 * Get all stored events
 * Returns events in chronological order (newest first)
 */
export function getEvents(): Event[] {
  return [...events]; // Return a copy to prevent external mutation
}
