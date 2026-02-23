"use client";

import { useRef, useEffect } from "react";
import { useEvents } from "../hooks/useEvents";
import { useEventFilters } from "../hooks/useEventFilters";
import { EventRow } from "./EventRow";
import { FilterControls } from "./FilterControls";

export function EventStreamViewer() {
  const { data: events, isLoading } = useEvents();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useEventFilters(events);

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current && filteredEvents.length > 0) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [filteredEvents, autoScroll]);

  return (
    <div className="space-y-3">
      {/* Filter Controls */}
      <FilterControls
        serviceFilter={serviceFilter}
        setServiceFilter={setServiceFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        autoScroll={autoScroll}
        setAutoScroll={setAutoScroll}
      />

      {/* Event Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Real-time system event stream
        </p>
        {events && (
          <span className="text-xs text-muted-foreground font-mono">
            {filteredEvents.length} of {events.length} events
          </span>
        )}
      </div>

      {/* Log Viewer */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="max-h-[calc(100vh-20rem)] overflow-y-auto scroll-smooth"
        >
          {isLoading && (
            <div className="p-8 text-center text-muted-foreground">
              Loading events...
            </div>
          )}

          {!isLoading && events && events.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No events yet
            </div>
          )}

          {!isLoading && events && events.length > 0 && filteredEvents.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No events match the current filters
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div className="divide-y divide-border/40">
              {filteredEvents.map((event) => (
                <EventRow 
                  key={event.id} 
                  event={event} 
                  isNew={newEventIds.has(event.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
