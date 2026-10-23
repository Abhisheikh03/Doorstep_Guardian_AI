"use client";

import React from "react";
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Package,
  Sliders,
  Bot,
  UserCheck,
  FileCheck,
} from "lucide-react";
import { useGuardianSession } from "@/lib/session/sessionMachine";
import { StatusBadge } from "./ui/Badge";
import { useFocusNavigation } from "@/lib/focus/useFocusGrid";

export function ClosingSummary() {
  const { record, resetDemo, goToScreen } = useGuardianSession();

  const handleSelect = async (index: number) => {
    if (index === 0) {
      await resetDemo();
    } else if (index === 1) {
      goToScreen("RESOLUTION");
    }
  };

  const { isFocused } = useFocusNavigation({
    itemCount: 2,
    initialIndex: 0,
    orientation: "horizontal",
    onSelect: handleSelect,
    onBack: () => goToScreen("RESOLUTION"),
  });

  if (!record) return null;

  const isResolved = record.status === "RESOLVED";

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto">
      {/* Top Banner: Closing Milestone */}
      <div className="w-full bg-gradient-to-r from-emerald-950/40 via-ring-surface to-emerald-950/40 border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Doorstep Loop Completed
              </h1>
              <StatusBadge status={record.status} size="md" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              From raw Ring motion sensor event &rarr; household rule contextualization &rarr; AI recommendation &rarr; verified physical resolution.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-xs font-mono uppercase text-emerald-300 font-bold">
            Core Differentiator Proven
          </div>
          <div className="text-xs sm:text-sm text-white font-medium mt-0.5">
            Never claimed resolved until physical confirmation.
          </div>
        </div>
      </div>

      {/* 6-Element Summary Grid: Exact Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 my-4 sm:my-5 flex-1 items-stretch">
        {/* 1. What Ring Reported */}
        <div className="lg:col-span-4 bg-ring-card/85 border border-ring-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-ring-accent tracking-wider mb-2">
              <Package className="w-4 h-4" />
              <span>1. What Ring Reported</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              Amazon Logistics Delivery
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Video Doorbell Pro detected motion and recorded a medium parcel deposit on front porch mat at{" "}
              {new Date(record.event.timestamp).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}.
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-ring-border mt-3">
            Sensor: {record.event.device_name}
          </div>
        </div>

        {/* 2. Why Event Needed Attention */}
        <div className="lg:col-span-4 bg-ring-card/85 border border-ring-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-amber-400 tracking-wider mb-2">
              <Sliders className="w-4 h-4" />
              <span>2. Why Attention Needed</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              Rule #104: Away Policy
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Household rule triggers when packages are left unattended while residents are away at the office. High risk of porch exposure during 3-hour vacancy.
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-ring-border mt-3">
            Condition: Resident away (ETA 5:30 PM)
          </div>
        </div>

        {/* 3. What Guardian AI Recommended */}
        <div className="lg:col-span-4 bg-ring-card/85 border border-ring-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-sky-400 tracking-wider mb-2">
              <Bot className="w-4 h-4" />
              <span>3. Guardian AI Recommendation</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              Contact Authorized Neighbor
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recommended contacting pre-authorized neighbor Sarah Chen to bring package inside, acknowledging package contents and weather sensitivity as unknowns.
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-ring-border mt-3">
            Confidence: Validated Zod Decision
          </div>
        </div>

        {/* 4. What Action Resident Chose */}
        <div className="lg:col-span-4 bg-ring-card/85 border border-ring-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-purple-400 tracking-wider mb-2">
              <UserCheck className="w-4 h-4" />
              <span>4. Action Resident Chose</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              {record.selected_action?.label || "Neighbor Follow-up Requested"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Resident authorized simulated neighbor dispatch. Event was moved to ACTION_SELECTED without prematurely closing the incident.
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-ring-border mt-3">
            Selected At:{" "}
            {record.selected_action?.selected_at
              ? new Date(record.selected_action.selected_at).toLocaleTimeString()
              : "Recorded Action"}
          </div>
        </div>

        {/* 5. Final Status */}
        <div className="lg:col-span-4 bg-ring-card/85 border border-ring-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-emerald-400 tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>5. Outcome Status</span>
            </div>
            <div className="mt-1 mb-2">
              <StatusBadge status={record.status} size="lg" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isResolved
                ? "Physical retrieval verified. Situation closed in accordance with household confirmation policy."
                : "Event follow-up selected and actively pending physical confirmation."}
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-ring-border mt-3">
            State: {record.status}
          </div>
        </div>

        {/* 6. Supporting Evidence */}
        <div className="lg:col-span-4 bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-emerald-300 tracking-wider mb-2">
              <FileCheck className="w-4 h-4" />
              <span>6. Supporting Evidence</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              {record.resolution?.evidence_source || "Authorized Confirmation"}
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {record.resolution?.notes ||
                "Resident or authorized household member provided direct physical confirmation that the package is safely stored inside."}
            </p>
          </div>
          <div className="text-[11px] font-mono text-emerald-300 pt-3 border-t border-emerald-500/30 mt-3">
            Confirmed By: {record.resolution?.confirmed_by || "Pending"}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-ring-border shrink-0">
        <button
          onClick={() => goToScreen("RESOLUTION")}
          className={`py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
            isFocused(1)
              ? "bg-ring-highlight border-2 border-ring-accent text-white shadow-focus"
              : "bg-ring-card border border-ring-border text-ring-subtext hover:text-white"
          }`}
        >
          <span>Review Audit History</span>
        </button>

        <button
          onClick={() => handleSelect(0)}
          className={`py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg flex items-center gap-2.5 transition-all cursor-pointer ${
            isFocused(0)
              ? "bg-ring-accent text-black shadow-focus scale-[1.01]"
              : "bg-ring-blue text-white hover:bg-ring-accent hover:text-black"
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset &amp; Replay Scenario [R]</span>
        </button>
      </div>
    </div>
  );
}
