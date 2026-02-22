import { Service } from "../types";
import { getSystemState } from "@/mocks/system-state";

export async function getServices(): Promise<Service[]> {
  // simulate network latency only
  await new Promise((res) => setTimeout(res, 600));

  // IMPORTANT: just read the current system snapshot
  return getSystemState();
}