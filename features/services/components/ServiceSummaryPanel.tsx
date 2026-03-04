import { Service } from "../types";
import { Card } from "@/components/ui/card";

interface ServiceSummaryPanelProps {
  services: Service[];
}

export default function ServiceSummaryPanel({ services }: ServiceSummaryPanelProps) {
  const totalServices = services.length;
  const operational = services.filter((s) => s.status === "healthy").length;
  const degraded = services.filter((s) => s.status === "degraded").length;
  const outages = services.filter((s) => s.status === "outage").length;

  const stats = [
    {
      label: "Services Monitored",
      value: totalServices,
      className: "text-foreground",
      bgClassName: "bg-muted/50",
    },
    {
      label: "Operational",
      value: operational,
      className: "text-green-600",
      bgClassName: "bg-green-500/10",
    },
    {
      label: "Degraded",
      value: degraded,
      className: "text-amber-600",
      bgClassName: "bg-amber-500/10",
    },
    {
      label: "Outages",
      value: outages,
      className: outages > 0 ? "text-red-600" : "text-muted-foreground",
      bgClassName: outages > 0 ? "bg-red-500/10" : "bg-muted/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`p-4 ${stat.bgClassName} border-border`}
        >
          <div className="flex flex-col gap-1">
            <div className={`text-3xl font-bold ${stat.className}`}>
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
