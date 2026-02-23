"use client";

import { Event } from "../types";

interface FilterControlsProps {
  serviceFilter: Event["service"] | "all";
  setServiceFilter: (service: Event["service"] | "all") => void;
  levelFilter: Event["level"] | "all";
  setLevelFilter: (level: Event["level"] | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  autoScroll: boolean;
  setAutoScroll: (autoScroll: boolean) => void;
}

const services: Array<Event["service"]> = [
  "SMS Gateway",
  "WhatsApp Provider",
  "Email Sender",
  "Webhook Dispatcher",
  "Retry Queue",
];

const levels: Array<Event["level"]> = ["info", "warn", "error"];

export function FilterControls({
  serviceFilter,
  setServiceFilter,
  levelFilter,
  setLevelFilter,
  searchQuery,
  setSearchQuery,
  autoScroll,
  setAutoScroll,
}: FilterControlsProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b pb-3">
      <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border">
        {/* Service Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Service:
          </label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value as Event["service"] | "all")}
            className="px-3 py-1.5 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All services</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Level:
          </label>
          <div className="flex gap-1">
            <button
              onClick={() => setLevelFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                levelFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              All
            </button>
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors uppercase ${
                  levelFilter === level
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Text Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-muted-foreground">
            Search:
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 px-3 py-1.5 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Auto-scroll Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-ring cursor-pointer"
            />
            <span className="text-sm font-medium text-muted-foreground">
              Auto-scroll
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
