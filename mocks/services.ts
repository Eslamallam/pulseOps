import { Service } from "@/features/services/types";

export const services: Service[] = [
  {
    id: "sms",
    name: "SMS Gateway",
    status: "healthy",
    uptime24h: 99.98,
    avgLatencyMs: 240,
    errorRate: 0.2,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Provider",
    status: "degraded",
    uptime24h: 98.7,
    avgLatencyMs: 820,
    errorRate: 3.8,
  },
  {
    id: "email",
    name: "Email Sender",
    status: "healthy",
    uptime24h: 99.99,
    avgLatencyMs: 110,
    errorRate: 0.05,
  },
  {
    id: "webhook",
    name: "Webhook Dispatcher",
    status: "outage",
    uptime24h: 92.4,
    avgLatencyMs: 1400,
    errorRate: 12.6,
  },
];