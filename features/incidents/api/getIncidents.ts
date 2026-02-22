import { Incident } from "../types";
import { evaluateIncidents } from "@/mocks/incidents-engine";
import { services } from "@/mocks/services";

export async function getIncidents(): Promise<Incident[]> {
  await new Promise(res => setTimeout(res, 400));

  // use latest system state
  return evaluateIncidents(services);
}