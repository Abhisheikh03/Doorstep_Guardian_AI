"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sliders,
} from "lucide-react";
import { useGuardianSession } from "@/lib/session/sessionMachine";
import { StatusBadge } from "./ui/Badge";
import { useFocusNavigation } from "@/lib/focus/useFocusGrid";

export function EventContext() {
  const { record, household, goToScreen, goBack, requestDecision } =
    useGuardianSession();

  const handleSelect = async (index: number) => {
    if (index === 0) {
      // Proceed to decision screen and trigger AI evaluation
      await requestDecision();
      goToScreen("DECISION");
    } else if (index === 1) {
      goBack();
    }
  };

  const { isFocused } = useFocusNavigation({
    itemCount: 2,
    initialIndex: 0,
    orientation: "horizontal",
    onSelect: handleSelect,
    onBack: goBack,
  });

  if (!record || !household) {
    return null;
  }

  const rule = household.rules[0];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ring-border gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-ring-accent uppercase tracking-widest">
              Stage 2: Contextual Reasoning
            </span>
            <StatusBadge status={record.status} size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ring-text tracking-tight mt-1">
            Why Does This Event Matter?
          </h1>
          <p className="text-xs sm:text-sm text-ring-subtext">
            Separating observed camera facts, household configured rules, and unknown variables.
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs text-ring-subtext font-mono uppercase">Event Ref</span>
          <p className="text-sm sm:text-base font-bold text-ring-text font-mono">
            {record.event.event_id}
          </p>
        </div>
      </div>

      {/* 3-Column Context Breakdown (Facts, Rules, Unknowns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 my-4 lg:my-6 flex-1 items-stretch">
        {/* Column 1: Observed Facts */}
        <div className="lg:col-span-4 bg-ring-card/80 border border-ring-border rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 pb-2 border-b border-ring-border">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>1. Observed Camera Facts</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Delivery drop detected:</strong> Package deposited on doorstep mat at{" "}
                  {new Date(record.event.timestamp).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Carrier metadata:</strong> Verified carrier &ldquo;
                  {record.event.metadata.carrier || "Amazon Logistics"}&rdquo; with medium box package.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Zone detection:</strong> Confirmed placement in front porch threshold zone.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
            Source: Ring Video Doorbell Pro Sensor Stream
          </div>
        </div>

        {/* Column 2: Household Rule Policy */}
        <div className="lg:col-span-4 bg-amber-950/15 border border-amber-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 pb-2 border-b border-amber-500/30">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>2. Configured Household Rule</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-3 sm:mb-4">
              <div className="text-xs uppercase font-bold text-amber-300">
                Rule #104: {rule?.name}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-snug font-medium">
                &ldquo;{rule?.policy}&rdquo;
              </p>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Resident Status:</strong> Away at office (ETA 5:30 PM). 3 hours unattended exposure.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Rule Severity:</strong> Attention Needed &bull; Proactive follow-up required.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
            Policy: Notification &ne; Resolution. Physical confirmation required.
          </div>
        </div>

        {/* Column 3: Known Unknowns (Anti-Hallucination) */}
        <div className="lg:col-span-4 bg-ring-card/80 border border-ring-border rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-sky-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 pb-2 border-b border-ring-border">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>3. Crucial Unknowns</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Package Contents:</strong> Monetary value and weather sensitivity are unknown.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Continued Presence:</strong> Doorbell only triggers on motion; cannot guarantee package remains safe without follow-up.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Retrieval Status:</strong> No household member has confirmed physical intake.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-sky-300 font-mono">
            Safety Guardrail: Missing evidence treated as unknown, not threat.
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-ring-border shrink-0">
        <button
          onClick={() => goBack()}
          className={`py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
            isFocused(1)
              ? "bg-ring-highlight border-2 border-ring-accent text-white shadow-focus"
              : "bg-ring-card border border-ring-border text-ring-subtext hover:text-white"
          }`}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Entrance</span>
        </button>

        <button
          onClick={() => handleSelect(0)}
          className={`py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg flex items-center gap-2.5 transition-all cursor-pointer ${
            isFocused(0)
              ? "bg-ring-accent text-black shadow-focus scale-[1.01]"
              : "bg-ring-blue text-white hover:bg-ring-accent hover:text-black"
          }`}
        >
          <span>Run Guardian AI Triage</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
