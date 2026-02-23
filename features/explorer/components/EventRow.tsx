import { Event } from "../types";
import { Badge } from "@/components/ui/badge";

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const levelStyles = {
  info: "bg-gray-500/10 text-gray-700 border-gray-500/30",
  warn: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
  error: "bg-red-500/10 text-red-700 border-red-500/30",
};

const serviceColors = {
  "SMS Gateway": "bg-blue-500/10 text-blue-700 border-blue-500/30",
  "WhatsApp Provider": "bg-green-500/10 text-green-700 border-green-500/30",
  "Email Sender": "bg-purple-500/10 text-purple-700 border-purple-500/30",
  "Webhook Dispatcher": "bg-orange-500/10 text-orange-700 border-orange-500/30",
  "Retry Queue": "bg-pink-500/10 text-pink-700 border-pink-500/30",
};

export function EventRow({ event, isNew }: { event: Event; isNew?: boolean }) {
  return (
    <div 
      className={`flex items-start gap-3 py-2 px-3 hover:bg-muted/50 border-b border-border/40 font-mono text-sm transition-all duration-300 ${
        isNew ? "animate-highlight bg-primary/10" : ""
      }`}
    >
      {/* Timestamp */}
      <span className="text-muted-foreground whitespace-nowrap text-xs">
        {formatTime(event.timestamp)}
      </span>

      {/* Service Badge */}
      <Badge
        variant="outline"
        className={`${serviceColors[event.service]} whitespace-nowrap text-xs font-medium`}
      >
        {event.service}
      </Badge>

      {/* Level Badge */}
      <Badge
        variant="outline"
        className={`${levelStyles[event.level]} whitespace-nowrap text-xs font-semibold uppercase`}
      >
        {event.level}
      </Badge>

      {/* Message */}
      <span className="flex-1 text-foreground">
        {event.message}
      </span>

      {/* Metadata (optional) */}
      {event.metadata && Object.keys(event.metadata).length > 0 && (
        <span className="text-muted-foreground text-xs">
          {JSON.stringify(event.metadata)}
        </span>
      )}
    </div>
  );
}
