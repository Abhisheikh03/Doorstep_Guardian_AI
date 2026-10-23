import { z } from "zod";

export const NormalizedRingEventSchema = z.object({
  event_id: z.string(),
  device_id: z.string(),
  device_name: z.string(),
  event_type: z.enum(["package_delivered", "motion_detected", "doorbell_press", "person_detected"]),
  source: z.enum(["mock", "live"]),
  timestamp: z.string(),
  description: z.string(),
  snapshot_url: z.string().optional(),
  metadata: z.record(z.any()).default({}),
  household_context: z.record(z.any()).optional(),
});

export type NormalizedRingEvent = z.infer<typeof NormalizedRingEventSchema>;

/**
 * Normalizes raw payload from mock or live Ring provider into standard Doorstep Guardian event.
 */
export function normalizeRingPayload(raw: any, source: "mock" | "live" = "mock"): NormalizedRingEvent {
  // If already normalized
  const parsed = NormalizedRingEventSchema.safeParse(raw);
  if (parsed.success) {
    return parsed.data;
  }

  // Fallback / mapping for alternative raw schemas
  return {
    event_id: raw.event_id || raw.id || `ring-evt-${Date.now()}`,
    device_id: raw.device_id || raw.doorbot_id || "ring-device-default",
    device_name: raw.device_name || raw.description || "Front Door Video Doorbell",
    event_type: raw.event_type || (raw.kind === "motion" ? "motion_detected" : "package_delivered"),
    source,
    timestamp: raw.timestamp || raw.created_at || new Date().toISOString(),
    description: raw.description || "Doorstep event detected",
    snapshot_url: raw.snapshot_url || raw.image_url || "/mock-ring-porch.svg",
    metadata: raw.metadata || {
      carrier: raw.carrier || "Amazon Logistics",
      raw_kind: raw.kind,
    },
    household_context: raw.household_context,
  };
}
