import { SystemHealth } from "../utils/getSystemStatus";

export default function SystemStatusBanner({ health }: { health: SystemHealth }) {

  const styles = {
    healthy: "bg-green-500/10 border-green-500/30 text-green-700",
    degraded: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700",
    outage: "bg-red-500/10 border-red-500/30 text-red-700",
  };

  const title = {
    healthy: "All systems operational",
    degraded: "Partial system degradation",
    outage: "Major system outage",
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[health.status]}`}>

      <div className="flex flex-col gap-1">
        <p className="font-semibold">{title[health.status]}</p>

        {health.affected.length > 0 && (
          <p className="text-sm">
            Affected services:{" "}
            <span className="font-medium">
              {health.affected.map(s => s.name).join(", ")}
            </span>
          </p>
        )}

      </div>

    </div>
  );
}