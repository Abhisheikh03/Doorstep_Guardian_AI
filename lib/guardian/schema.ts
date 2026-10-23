import { z } from "zod";

export const GuardianDecisionSchema = z.object({
  event_classification: z.enum(["delivery", "visitor", "unknown"]),
  priority: z.enum(["informational", "attention_needed", "urgent"]),
  rationale: z.string().min(10, "Rationale must explain reasoning"),
  known_facts: z.array(z.string()).min(1, "At least one verified fact required"),
  unknowns: z.array(z.string()).min(1, "At least one unknown factor should be noted"),
  recommended_action: z.enum([
    "collect_package",
    "contact_authorized_member",
    "dismiss",
    "review_manually",
  ]),
  requires_confirmation: z.boolean(),
});

export type GuardianDecision = z.infer<typeof GuardianDecisionSchema>;
