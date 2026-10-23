import { create } from "zustand";
import {
  HouseholdConfig,
  StoredEventRecord,
  ResidentAction,
} from "../store/householdEventStore";

export type ScreenType =
  | "HOME"
  | "CONTEXT"
  | "DECISION"
  | "ACTION"
  | "RESOLUTION"
  | "CLOSING";

interface GuardianSessionState {
  currentScreen: ScreenType;
  screenHistory: ScreenType[];
  household: HouseholdConfig | null;
  record: StoredEventRecord | null;
  provider: {
    is_simulated: boolean;
    label: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  initSession: (reset?: boolean) => Promise<void>;
  goToScreen: (screen: ScreenType) => void;
  goBack: () => void;
  requestDecision: () => Promise<void>;
  selectAction: (
    actionType: "collect_package" | "contact_authorized_member" | "dismiss",
    label: string,
    notes?: string,
    targetMember?: string
  ) => Promise<void>;
  confirmResolution: (
    resolutionType: "collected" | "stored_safely" | "dismissed",
    confirmedBy: string,
    evidenceSource: string,
    notes?: string
  ) => Promise<void>;
  resetDemo: () => Promise<void>;
}

export const useGuardianSession = create<GuardianSessionState>((set, get) => ({
  currentScreen: "HOME",
  screenHistory: [],
  household: null,
  record: null,
  provider: {
    is_simulated: true,
    label: "SIMULATED (MOCK_RING)",
  },
  isLoading: false,
  error: null,

  initSession: async (reset = false) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to start session");
      }
      set({
        household: data.household,
        record: data.record,
        provider: data.provider,
        isLoading: false,
        currentScreen: reset ? "HOME" : get().currentScreen,
        screenHistory: reset ? [] : get().screenHistory,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Error initializing session",
      });
    }
  },

  goToScreen: (screen: ScreenType) => {
    const current = get().currentScreen;
    if (current === screen) return;
    set((state) => ({
      currentScreen: screen,
      screenHistory: [...state.screenHistory, current],
    }));
  },

  goBack: () => {
    const history = [...get().screenHistory];
    if (history.length > 0) {
      const previous = history.pop()!;
      set({
        currentScreen: previous,
        screenHistory: history,
      });
    } else {
      // Default fallback screen navigation
      const current = get().currentScreen;
      const order: ScreenType[] = [
        "HOME",
        "CONTEXT",
        "DECISION",
        "ACTION",
        "RESOLUTION",
        "CLOSING",
      ];
      const idx = order.indexOf(current);
      if (idx > 0) {
        set({ currentScreen: order[idx - 1] });
      }
    }
  },

  requestDecision: async () => {
    const record = get().record;
    if (!record) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/guardian/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: record.event.event_id,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to generate decision");
      }
      set({
        record: data.record,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Decision request failed",
      });
    }
  },

  selectAction: async (actionType, label, notes, targetMember) => {
    const record = get().record;
    if (!record) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/events/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: record.event.event_id,
          action_type: actionType,
          label,
          notes,
          target_member: targetMember,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to record action");
      }
      set({
        record: data.record,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Action submission failed",
      });
    }
  },

  confirmResolution: async (
    resolutionType,
    confirmedBy,
    evidenceSource,
    notes
  ) => {
    const record = get().record;
    if (!record) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/events/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: record.event.event_id,
          resolution_type: resolutionType,
          confirmed_by: confirmedBy,
          evidence_source: evidenceSource,
          notes,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to resolve event");
      }
      set({
        record: data.record,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Resolution confirmation failed",
      });
    }
  },

  resetDemo: async () => {
    await get().initSession(true);
    set({ currentScreen: "HOME", screenHistory: [] });
  },
}));
