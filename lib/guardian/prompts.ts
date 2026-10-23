import { NormalizedRingEvent } from "../ring/normalizeEvent";
import { HouseholdConfig } from "../store/householdEventStore";

export function buildGuardianSystemPrompt(): string {
  return `You are "Doorstep Guardian AI", an intelligent home-safety reasoning engine for Amazon Ring.
Your role is to transform doorstep events into contextual, trackable outcomes rather than generating passive notifications.

GUIDING PRINCIPLES:
1. Strict objectivity: Use ONLY evidence available in the Ring event and the configured household rules.
2. Missing evidence is UNKNOWN: If camera or sensor data cannot confirm package contents, value, or present physical status, state it as an unknown. Never assume or extrapolate.
3. Safety & Fairness: Never infer criminal intent, suspicious behavior, or threat from demographic attributes, attire, or presence of a person.
4. Rule precedence: Always adhere to configured household rules before making discretionary recommendations.
5. Non-resolution: A notification or alert NEVER constitutes resolution. Follow-up must be tracked until physically resolved or explicitly dismissed by the resident.
6. Return format: Output pure JSON matching the specified schema. No markdown wrapping, no conversational preamble.`;
}

export function buildGuardianUserPrompt(
  event: NormalizedRingEvent,
  household: HouseholdConfig
): string {
  return `Analyze this doorstep event against the resident's household rules:

EVENT DATA:
- Event ID: ${event.event_id}
- Device: ${event.device_name} (${event.device_id})
- Type: ${event.event_type}
- Timestamp: ${event.timestamp}
- Description: ${event.description}
- Metadata: ${JSON.stringify(event.metadata, null, 2)}

HOUSEHOLD CONFIGURATION:
- Household: ${household.name}
- Resident Availability: ${household.resident_status.state} (${household.resident_status.details})
- Expected Delivery Window: ${household.delivery_window.expected_start} to ${household.delivery_window.expected_end}
- Active Rules: ${JSON.stringify(household.rules, null, 2)}
- Authorized Household Members: ${JSON.stringify(household.authorized_members, null, 2)}
- Confirmation Policy: ${JSON.stringify(household.confirmation_policy, null, 2)}

OUTPUT SCHEMA:
Provide valid JSON with exactly these keys:
{
  "event_classification": "delivery" | "visitor" | "unknown",
  "priority": "informational" | "attention_needed" | "urgent",
  "rationale": "<Concise 1-2 sentence explanation of why this requires attention or follow-up under household rules>",
  "known_facts": ["<observed fact 1>", "<observed fact 2>", "<observed fact 3>"],
  "unknowns": ["<unknown factor 1>", "<unknown factor 2>"],
  "recommended_action": "collect_package" | "contact_authorized_member" | "dismiss" | "review_manually",
  "requires_confirmation": boolean
}`;
}
