/**
 * Event — Low-level operational system event
 * 
 * Represents something that actually happened inside the messaging system.
 * Events are not metrics and not alerts — they are timestamped records
 * of system behavior.
 */
export interface Event {
  /** Unique event identifier */
  id: string;

  /** ISO 8601 timestamp when the event occurred */
  timestamp: string;

  /** Service that emitted this event */
  service:
    | "SMS Gateway"
    | "WhatsApp Provider"
    | "Email Sender"
    | "Webhook Dispatcher"
    | "Retry Queue";

  /** Event severity level */
  level: "info" | "warn" | "error";

  /** Human-readable event message */
  message: string;

  /** Optional structured metadata (e.g., request IDs, error codes, latencies) */
  metadata?: Record<string, any>;
}
