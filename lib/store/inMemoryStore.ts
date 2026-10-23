import {
  HouseholdEventStore,
  HouseholdConfig,
  StoredEventRecord,
  EventStatus,
  AuditRecord,
  ResidentAction,
  ResolutionConfirmation,
} from "./householdEventStore";
import { NormalizedRingEvent } from "../ring/normalizeEvent";
import { GuardianDecision } from "../guardian/schema";
import householdData from "../../data/household.json";
import demoEventData from "../../data/demo-event.json";

export class InMemoryHouseholdEventStore implements HouseholdEventStore {
  private householdConfig: HouseholdConfig;
  private records: Map<string, StoredEventRecord> = new Map();

  constructor() {
    this.householdConfig = householdData as HouseholdConfig;
    this.initializeDemoState();
  }

  private initializeDemoState() {
    const rawDemo = demoEventData as any;
    const nowIso = new Date().toISOString();

    const initialAudit: AuditRecord = {
      timestamp: rawDemo.timestamp || nowIso,
      from_status: "NEW",
      to_status: "NEEDS_ATTENTION",
      actor: "ring_sensor",
      trigger_rule: rawDemo.household_context?.rule_title || "Unattended Porch Delivery While Away",
      action_summary: "Package delivery detected while residents away",
      notes: "Follow-up required per Rule #104",
    };

    const initialRecord: StoredEventRecord = {
      event: {
        event_id: rawDemo.event_id,
        device_id: rawDemo.device_id,
        device_name: rawDemo.device_name,
        event_type: rawDemo.event_type,
        source: rawDemo.source || "mock",
        timestamp: rawDemo.timestamp,
        description: rawDemo.description,
        snapshot_url: rawDemo.snapshot_url,
        metadata: rawDemo.metadata,
        household_context: rawDemo.household_context,
      },
      status: "NEEDS_ATTENTION",
      matched_rule_id: rawDemo.household_context?.matched_rule_id,
      history: [initialAudit],
    };

    this.records.set(rawDemo.event_id, initialRecord);
  }

  async getHouseholdConfig(): Promise<HouseholdConfig> {
    return JSON.parse(JSON.stringify(this.householdConfig));
  }

  async setHouseholdConfig(config: HouseholdConfig): Promise<void> {
    this.householdConfig = JSON.parse(JSON.stringify(config));
  }

  async ingestEvent(event: NormalizedRingEvent): Promise<StoredEventRecord> {
    // Duplicate prevention
    const existing = this.records.get(event.event_id);
    if (existing) {
      return existing;
    }

    const isAway = this.householdConfig.resident_status.state === "away";
    const matchedRule = this.householdConfig.rules.find(
      (r) => r.trigger === event.event_type
    );

    const initialStatus: EventStatus = isAway && matchedRule ? "NEEDS_ATTENTION" : "NEW";

    const auditEntry: AuditRecord = {
      timestamp: new Date().toISOString(),
      from_status: "NEW",
      to_status: initialStatus,
      actor: "ring_sensor",
      trigger_rule: matchedRule?.name,
      action_summary: `Ring ${event.event_type} event ingested`,
      notes: isAway && matchedRule ? "Triggered household rule follow-up requirement" : "Routine event",
    };

    const record: StoredEventRecord = {
      event,
      status: initialStatus,
      matched_rule_id: matchedRule?.id,
      history: [auditEntry],
    };

    this.records.set(event.event_id, record);
    return record;
  }

  async getEvent(eventId: string): Promise<StoredEventRecord | null> {
    return this.records.get(eventId) || null;
  }

  async getAllEvents(): Promise<StoredEventRecord[]> {
    return Array.from(this.records.values());
  }

  async updateDecision(
    eventId: string,
    decision: GuardianDecision
  ): Promise<StoredEventRecord> {
    const record = this.records.get(eventId);
    if (!record) {
      throw new Error(`Event not found: ${eventId}`);
    }

    record.decision = decision;
    record.history.push({
      timestamp: new Date().toISOString(),
      from_status: record.status,
      to_status: record.status,
      actor: "guardian_ai",
      action_summary: `Guardian AI analyzed context (priority: ${decision.priority})`,
      notes: `Recommended action: ${decision.recommended_action}. Rationale: ${decision.rationale}`,
    });

    return record;
  }

  async recordAction(
    eventId: string,
    action: ResidentAction
  ): Promise<StoredEventRecord> {
    const record = this.records.get(eventId);
    if (!record) {
      throw new Error(`Event not found: ${eventId}`);
    }

    const previousStatus = record.status;
    record.selected_action = action;
    record.status = "ACTION_SELECTED";

    record.history.push({
      timestamp: new Date().toISOString(),
      from_status: previousStatus,
      to_status: "ACTION_SELECTED",
      actor: "resident_user",
      action_summary: `Resident selected action: ${action.label}`,
      notes: action.notes || "Resident initiated follow-up, pending physical outcome confirmation",
    });

    return record;
  }

  async confirmResolution(
    eventId: string,
    resolution: ResolutionConfirmation
  ): Promise<StoredEventRecord> {
    const record = this.records.get(eventId);
    if (!record) {
      throw new Error(`Event not found: ${eventId}`);
    }

    const previousStatus = record.status;
    const newStatus: EventStatus =
      resolution.resolution_type === "dismissed" ? "DISMISSED" : "RESOLVED";

    record.resolution = resolution;
    record.status = newStatus;

    record.history.push({
      timestamp: new Date().toISOString(),
      from_status: previousStatus,
      to_status: newStatus,
      actor: "resident_user",
      action_summary: `Resolution confirmed (${resolution.resolution_type})`,
      notes: `Confirmed by ${resolution.confirmed_by} via ${resolution.evidence_source}. Details: ${resolution.notes || "None"}`,
    });

    return record;
  }

  async getTimeline(eventId: string): Promise<AuditRecord[]> {
    const record = this.records.get(eventId);
    return record ? record.history : [];
  }

  async resetDemo(): Promise<StoredEventRecord> {
    this.records.clear();
    this.householdConfig = JSON.parse(JSON.stringify(householdData));
    this.initializeDemoState();
    return this.records.get("ring-evt-20261024-001")!;
  }
}

// Global singleton instance for server runtime in Next.js
declare global {
  // eslint-disable-next-line no-var
  var __doorstepGuardianStore: HouseholdEventStore | undefined;
}

export function getHouseholdStore(): HouseholdEventStore {
  if (!global.__doorstepGuardianStore) {
    global.__doorstepGuardianStore = new InMemoryHouseholdEventStore();
  }
  return global.__doorstepGuardianStore;
}
