export type ServiceStatus = "healthy" | "degraded" | "outage";

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime24h: number;
  avgLatencyMs: number;
  errorRate: number;
}