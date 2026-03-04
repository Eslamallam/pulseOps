import { IncidentSeverity, IncidentStatus } from "../types";

/**
 * Get the border color class for an incident based on its severity
 */
export function getSeverityBorderColor(severity: IncidentSeverity): string {
  switch (severity) {
    case "critical":
      return "border-l-red-600";
    case "major":
      return "border-l-amber-500";
    case "minor":
      return "border-l-yellow-400";
    default:
      return "border-l-gray-400";
  }
}

/**
 * Get the badge variant for an incident severity
 */
export function getSeverityBadgeVariant(severity: IncidentSeverity): string {
  switch (severity) {
    case "critical":
      return "destructive";
    case "major":
      return "default";
    case "minor":
      return "secondary";
    default:
      return "outline";
  }
}

/**
 * Get human-readable time difference from a timestamp
 */
export function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
