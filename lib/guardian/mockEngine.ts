import { GuardianEngine } from "./engine";
import { GuardianDecision, GuardianDecisionSchema } from "./schema";
import { NormalizedRingEvent } from "../ring/normalizeEvent";
import { HouseholdConfig } from "../store/householdEventStore";

export class MockGuardianEngine implements GuardianEngine {
  async decide(
    event: NormalizedRingEvent,
    household: HouseholdConfig
  ): Promise<GuardianDecision> {
    const isResidentAway = household.resident_status.state.toLowerCase() === "away";
    const rule = household.rules[0];

    const decisionData: GuardianDecision = {
      event_classification: "delivery",
      priority: isResidentAway ? "attention_needed" : "informational",
      rationale: isResidentAway
        ? `Package left unattended on front doorstep mat while residents are away (${household.resident_status.details}). Per household rule "${rule?.name || "Unattended Porch Delivery"}", unattended packages require follow-up to prevent weather exposure or loss.`
        : "Package delivered while residents are home. Standard informational notification.",
      known_facts: [
        `Verified delivery by ${event.metadata.carrier || "Amazon Logistics"} at ${new Date(event.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
        `Ring sensor detected package at "${event.metadata.location_zone || "Front Doorstep"}"`,
        `Household status: Residents currently ${household.resident_status.state} (${household.resident_status.details})`,
        `Applicable Household Rule: ${rule?.name || "Unattended Delivery Follow-up"}`,
      ],
      unknowns: [
        "Package contents and monetary value cannot be verified by camera",
        "Ring sensor cannot continuously verify if package remains in place without subsequent motion events",
        "Physical retrieval status remains unconfirmed until verified by household member",
      ],
      recommended_action: isResidentAway ? "contact_authorized_member" : "collect_package",
      requires_confirmation: rule ? rule.requires_resident_confirmation : true,
    };

    // Ensure strict validation
    return GuardianDecisionSchema.parse(decisionData);
  }

  getEngineName(): string {
    return "Guardian Mock Rule Engine (Deterministic)";
  }
}
