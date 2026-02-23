import { Event } from "../types";
import { getEvents as getEventsFromStore } from "@/mocks/event-store";

/**
 * Fetch events from the event store
 * 
 * This API does NOT generate events — it only returns
 * a snapshot from the backend event store.
 */
export async function getEvents(): Promise<Event[]> {
  // Simulate network latency (200-400ms)
  const latency = Math.random() * 200 + 200;
  await new Promise((res) => setTimeout(res, latency));

  // Return snapshot from event store
  return getEventsFromStore();
}
