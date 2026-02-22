import { format } from "date-fns";

export default function IncidentTimeline({ events }: { events: any[] }) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">Timeline</h2>

      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="flex gap-4">

            {/* timeline dot */}
            <div className="mt-1 h-2 w-2 rounded-full bg-primary" />

            <div className="flex-1">
              <p className="font-medium">{event.message}</p>
              <p className="text-sm text-muted-foreground">
                {format(event.time, "PPP p")}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}