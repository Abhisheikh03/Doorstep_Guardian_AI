import { NormalizedRingEvent } from "../ring/normalizeEvent";
import { HouseholdConfig } from "../store/householdEventStore";
import { GuardianDecision } from "./schema";

export interface GuardianEngine {
  /**
   * Evaluates the event within the context of household rules and returns
   * a structured, validated safety decision.
   */
  decide(event: NormalizedRingEvent, household: HouseholdConfig): Promise<GuardianDecision>;

  /**
   * Provider identifier for display / debugging
   */
  getEngineName(): string;
}
