import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Event } from "../types";

export function useEventFilters(events: Event[] | undefined) {
  const searchParams = useSearchParams();
  
  // Filter states
  const [serviceFilter, setServiceFilter] = useState<Event["service"] | "all">("all");
  const [levelFilter, setLevelFilter] = useState<Event["level"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Auto-scroll state (default ON)
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Track new events for highlighting
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set());
  const previousEventCountRef = useRef(0);
  
  // Track if we should highlight the filter (for 3 seconds)
  const [highlightFilter, setHighlightFilter] = useState(false);

  // Read URL parameters on mount
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const highlightParam = searchParams.get("highlight");
    
    if (serviceParam) {
      setServiceFilter(serviceParam as Event["service"]);
      
      if (highlightParam === "true") {
        setHighlightFilter(true);
        
        // Remove highlight after 3 seconds
        const timer = setTimeout(() => {
          setHighlightFilter(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams]);

  // Track new events and highlight them
  useEffect(() => {
    if (!events) return;
    
    const currentCount = events.length;
    const previousCount = previousEventCountRef.current;
    
    // New events arrived (events are newest first)
    if (currentCount > previousCount) {
      const newEvents = events.slice(0, currentCount - previousCount);
      const newIds = new Set(newEvents.map(e => e.id));
      setNewEventIds(newIds);
      
      // Remove highlight after 1.5 seconds
      const timer = setTimeout(() => {
        setNewEventIds(new Set());
      }, 1500);
      
      previousEventCountRef.current = currentCount;
      return () => clearTimeout(timer);
    }
    
    previousEventCountRef.current = currentCount;
  }, [events]);

  // Client-side filtering (no refetch)
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((event) => {
      // Filter by service
      if (serviceFilter !== "all" && event.service !== serviceFilter) {
        return false;
      }

      // Filter by level
      if (levelFilter !== "all" && event.level !== levelFilter) {
        return false;
      }

      // Filter by text search on message
      if (searchQuery && !event.message.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [events, serviceFilter, levelFilter, searchQuery]);

  return {
    serviceFilter,
    setServiceFilter,
    levelFilter,
    setLevelFilter,
    searchQuery,
    setSearchQuery,
    autoScroll,
    setAutoScroll,
    filteredEvents,
    newEventIds,
    highlightFilter,
  };
}
