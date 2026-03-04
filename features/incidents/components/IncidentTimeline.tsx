import { format } from "date-fns";

export default function IncidentTimeline({ events }: { events: any[] }) {
  // Reverse the array to show newest first
  const sortedEvents = [...events].reverse();

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-6">Investigation Timeline</h2>

      <div className="space-y-0">
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="flex gap-4 relative">
            
            {/* Vertical connecting line - hide for last item */}
            {index !== sortedEvents.length - 1 && (
              <div className="absolute left-[7px] top-8 bottom-0 w-[2px] bg-border" />
            )}

            {/* Status dot */}
            <div className="relative z-10 mt-[6px] h-4 w-4 rounded-full bg-primary border-4 border-background ring-1 ring-border shrink-0" />

            {/* Event card */}
            <div className="flex-1 pb-6">
              <div className="rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-medium text-sm flex-1">
                    {event.message}
                  </p>
                  <time className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(event.time, "h:mm a")}
                  </time>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}