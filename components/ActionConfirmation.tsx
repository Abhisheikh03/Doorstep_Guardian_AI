"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  UserCheck,
  Package,
  XCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useGuardianSession } from "@/lib/session/sessionMachine";
import { StatusBadge } from "./ui/Badge";
import { useFocusNavigation } from "@/lib/focus/useFocusGrid";

export function ActionConfirmation() {
  const {
    record,
    household,
    selectAction,
    confirmResolution,
    goToScreen,
    goBack,
  } = useGuardianSession();

  // Selected action step: 'choose_action' or 'await_confirmation'
  const isActionSelected = record?.status === "ACTION_SELECTED" || Boolean(record?.selected_action);
  const [activeStep, setActiveStep] = useState<"choose_action" | "await_confirmation">(
    isActionSelected ? "await_confirmation" : "choose_action"
  );

  const options = [
    {
      type: "contact_authorized_member" as const,
      label: "Ask Sarah Chen (Authorized Neighbor) to retrieve package",
      description: "Dispatches simulated neighbor notification. Event will remain pending until Sarah confirms physical retrieval.",
      recommended: true,
      member: "Sarah Chen",
    },
    {
      type: "collect_package" as const,
      label: "I'll collect the package personally upon return (5:30 PM)",
      description: "Schedules doorstep reminder. Event remains pending until resident confirms retrieval at home.",
      recommended: false,
    },
    {
      type: "dismiss" as const,
      label: "Dismiss — no action needed",
      description: "Resident explicitly acknowledges delivery and closes follow-up without action.",
      recommended: false,
    },
  ];

  // Focus navigation for choosing action
  const handleSelectActionIndex = async (index: number) => {
    if (activeStep === "choose_action") {
      if (index >= 0 && index < options.length) {
        const opt = options[index];
        await selectAction(
          opt.type,
          opt.label,
          opt.description,
          opt.member
        );
        setActiveStep("await_confirmation");
      }
    } else {
      // Step: await_confirmation
      if (index === 0) {
        // Confirm resolution
        const actionType = record?.selected_action?.action_type;
        if (actionType === "dismiss") {
          await confirmResolution(
            "dismissed",
            "Resident (App User)",
            "Resident Manual Dismissal",
            "Resident determined no physical retrieval was required."
          );
        } else if (actionType === "contact_authorized_member") {
          await confirmResolution(
            "stored_safely",
            "Sarah Chen (Neighbor)",
            "Authorized Household Confirmation",
            "Sarah Chen retrieved package from porch and confirmed it is safely inside foyer."
          );
        } else {
          await confirmResolution(
            "collected",
            "Resident (App User)",
            "Resident Physical Retrieval",
            "Resident returned home and physically brought package indoors."
          );
        }
        goToScreen("RESOLUTION");
      } else if (index === 1) {
        // View timeline with status still pending (demonstrates ACTION_SELECTED state)
        goToScreen("RESOLUTION");
      }
    }
  };

  const itemCount = activeStep === "choose_action" ? 3 : 2;
  const { isFocused } = useFocusNavigation({
    itemCount,
    initialIndex: 0,
    orientation: "vertical",
    onSelect: handleSelectActionIndex,
    onBack: () => {
      if (activeStep === "await_confirmation" && !record?.resolution) {
        setActiveStep("choose_action");
      } else {
        goBack();
      }
    },
  });

  if (!record) return null;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ring-border gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-ring-accent uppercase tracking-widest">
              Stage 4: Action Selection &amp; Verification
            </span>
            <StatusBadge status={record.status} size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ring-text tracking-tight mt-1">
            {activeStep === "choose_action"
              ? "Select Household Follow-up Action"
              : "Action Dispatched — Awaiting Physical Outcome"}
          </h1>
          <p className="text-xs sm:text-sm text-ring-subtext">
            {activeStep === "choose_action"
              ? "Predefined safe options conforming to household authorization rules."
              : "Core Security Principle: Action selection does NOT equal resolution. Physical confirmation required."}
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs text-ring-subtext font-mono uppercase">Current Status</span>
          <div className="mt-0.5">
            <StatusBadge status={record.status} size="md" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-4 lg:my-6 flex-1 flex flex-col justify-center">
        {activeStep === "choose_action" ? (
          /* Step 1: Predefined safe actions */
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto w-full">
            {options.map((opt, idx) => {
              const focused = isFocused(idx);
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectActionIndex(idx)}
                  className={`p-4 sm:p-5 lg:p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    focused
                      ? "bg-ring-highlight border-ring-accent shadow-focus scale-[1.01]"
                      : "bg-ring-card/80 border-ring-border hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        opt.recommended
                          ? "bg-ring-accent/20 text-ring-accent border border-ring-accent/40"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {opt.type === "contact_authorized_member" ? (
                        <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : opt.type === "collect_package" ? (
                        <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base sm:text-lg lg:text-xl font-bold text-white">
                          {opt.label}
                        </span>
                        {opt.recommended && (
                          <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold uppercase bg-ring-accent/20 text-ring-accent border border-ring-accent/30 font-mono">
                            AI Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-ring-subtext mt-1 leading-snug">
                        {opt.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 hidden sm:block">
                    <span
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs font-mono flex items-center gap-1.5 ${
                        focused
                          ? "bg-ring-accent text-black"
                          : "bg-ring-surface text-ring-subtext border border-ring-border"
                      }`}
                    >
                      <span>[ENTER]</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Step 2: Action Selected - Pending Physical Outcome */
          <div className="max-w-4xl mx-auto w-full bg-ring-card/90 border-2 border-sky-500/40 rounded-2xl p-5 sm:p-7 lg:p-8 shadow-2xl animate-fade-in">
            {/* Status Callout Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-sky-950/30 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 animate-pulse shrink-0" />
                <div>
                  <div className="text-xs uppercase font-mono font-bold text-sky-300">
                    Follow-up In Progress
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {record.selected_action?.label}
                  </div>
                </div>
              </div>
              <StatusBadge status="ACTION_SELECTED" size="sm" />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-ring-border text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
              <div className="font-bold text-white mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Household Notification Dispatched:</span>
              </div>
              Alert delivered to authorized contact:{" "}
              <strong className="text-ring-accent">
                {record.selected_action?.target_member || "Household Contact"}
              </strong>
              . In accordance with home safety policy, the incident remains in{" "}
              <span className="text-sky-300 font-mono font-bold">ACTION_SELECTED</span> status until
              physical retrieval is explicitly confirmed.
            </div>

            {/* Resolution Confirmation Options */}
            <div className="space-y-3 sm:space-y-4">
              <div className="text-xs font-mono uppercase text-ring-subtext font-bold tracking-wider">
                Confirm Real-World Outcome to Resolve:
              </div>

              {/* Button 0: Confirm Outcome */}
              <button
                onClick={() => handleSelectActionIndex(0)}
                className={`w-full p-4 sm:p-5 rounded-xl font-bold text-base sm:text-lg flex flex-col sm:flex-row sm:items-center justify-between transition-all cursor-pointer gap-2 ${
                  isFocused(0)
                    ? "bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-[1.01]"
                    : "bg-emerald-600/90 text-white hover:bg-emerald-500 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>
                    Confirm Outcome: Package Safely Retrieved &amp; Brought Inside
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-black/20 shrink-0 self-end sm:self-auto">
                  [ENTER] Confirm &amp; Resolve
                </span>
              </button>

              {/* Button 1: Leave Pending and Review Audit */}
              <button
                onClick={() => handleSelectActionIndex(1)}
                className={`w-full p-3.5 sm:p-4 rounded-xl font-semibold text-sm sm:text-base flex flex-col sm:flex-row sm:items-center justify-between transition-all cursor-pointer gap-2 ${
                  isFocused(1)
                    ? "bg-ring-highlight border-2 border-ring-accent text-white shadow-focus"
                    : "bg-ring-surface border border-ring-border text-ring-subtext hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
                  <span>Leave Pending: Inspect Audit Trail Without Resolving</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-ring-card text-ring-subtext shrink-0 self-end sm:self-auto">
                  Status remains ACTION_SELECTED
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-ring-border shrink-0">
        <button
          onClick={() => {
            if (activeStep === "await_confirmation") {
              setActiveStep("choose_action");
            } else {
              goBack();
            }
          }}
          className="py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 bg-ring-card border border-ring-border text-ring-subtext hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {activeStep === "await_confirmation"
              ? "Re-select Action"
              : "Back to Decision"}
          </span>
        </button>

        <div className="text-[11px] sm:text-xs text-ring-subtext font-mono">
          Doorstep Guardian AI: Zero false resolutions &bull; Real confirmation required
        </div>
      </div>
    </div>
  );
}
