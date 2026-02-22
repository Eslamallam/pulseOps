"use client";

import Link from "next/link";
import { Incident } from "../types";
import { formatDistanceToNow } from "date-fns";

function severityColor(severity: Incident["severity"]) {
  switch (severity) {
    case "critical":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "major":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    case "minor":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  }
}

export default function IncidentRow({ incident }: { incident: Incident }) {
  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="block rounded-lg border p-4 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center justify-between">

        <div className="space-y-1">
          <p className="font-medium">{incident.title}</p>

          <p className="text-sm text-muted-foreground">
            Started {formatDistanceToNow(new Date(incident.startedAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-md border ${severityColor(
            incident.severity
          )}`}
        >
          {incident.severity.toUpperCase()}
        </span>

      </div>
    </Link>
  );
}