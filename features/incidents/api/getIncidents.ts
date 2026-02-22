import { Incident } from "../types";
import { getActiveIncidents } from "@/mocks/incidents-engine";

export async function getIncidents(): Promise<Incident[]> {
  await new Promise(res => setTimeout(res, 300));
  return getActiveIncidents();
}