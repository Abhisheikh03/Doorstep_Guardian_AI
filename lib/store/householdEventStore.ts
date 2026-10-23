import { NormalizedRingEvent } from "../ring/normalizeEvent";
import { GuardianDecision } from "../guardian/schema";

export type EventStatus =
  | "NEW"
  | "NEEDS_ATTENTION"
  | "ACTION_SELECTED"
  | "RESOLVED"
  | "DISMISSED";

export interface AuditRecord {
  timestamp: string;
  from_status: EventStatus;
  to_status: EventStatus;
  actor: "ring_sensor" | "guardian_ai" | "resident_user" | "household_policy";
  trigger_rule?: string;
  action_summary?: string;
  notes?: string;
}

export interface ResidentAction {
  action_type: "collect_package" | "contact_authorized_member" | "dismiss";
  label: string;
  notes?: string;
  selected_at: string;
  target_member?: string;
}

export interface ResolutionConfirmation {
  event_id: string;
  resolution_type: "collected" | "stored_safely" | "dismissed";
  confirmed_by: string;
  evidence_source: string;
  confirmed_at: string;
  notes?: string;
}

export interface HouseholdConfig {
  household_id: string;
  name: string;
  address: string;
  resident_status: {
    state: string;
    details: string;
    return_eta?: string;
  };
  delivery_window: {
    expected_start: string;
    expected_end: string;
    notes: string;
  };
  rules: Array<{
    id: string;
    name: string;
    trigger: string;
    condition: string;
    policy: string;
    severity: string;
    requires_resident_confirmation: boolean;
  }>;
  authorized_members: Array<{
    id: string;
    name: string;
    relationship: string;
    permissions: string[];
  }>;
  confirmation_policy: {
    require_explicit_confirmation: boolean;
    principle: string;
  };
}

export interface StoredEventRecord {
  event: NormalizedRingEvent;
  status: EventStatus;
  matched_rule_id?: string;
  decision?: GuardianDecision;
  selected_action?: ResidentAction;
  resolution?: ResolutionConfirmation;
  history: AuditRecord[];
}

export interface HouseholdEventStore {
  getHouseholdConfig(): Promise<HouseholdConfig>;
  setHouseholdConfig(config: HouseholdConfig): Promise<void>;

  ingestEvent(event: NormalizedRingEvent): Promise<StoredEventRecord>;
  getEvent(eventId: string): Promise<StoredEventRecord | null>;
  getAllEvents(): Promise<StoredEventRecord[]>;

  updateDecision(eventId: string, decision: GuardianDecision): Promise<StoredEventRecord>;
  recordAction(eventId: string, action: ResidentAction): Promise<StoredEventRecord>;
  confirmResolution(eventId: string, resolution: ResolutionConfirmation): Promise<StoredEventRecord>;

  getTimeline(eventId: string): Promise<AuditRecord[]>;
  resetDemo(): Promise<StoredEventRecord>;
}
