"use client";

import React, { useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Bot,
  CheckCircle,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { useGuardianSession } from "@/lib/session/sessionMachine";
import { PriorityBadge, StatusBadge } from "./ui/Badge";
import { useFocusNavigation } from "@/lib/focus/useFocusGrid";

export function GuardianDecision() {
  const { record, household, goToScreen, goBack, requestDecision, isLoading } =
    useGuardianSession();

  // If decision hasn't been generated yet, generate it on mount
  useEffect(() => {
    if (record && !record.decision) {
      requestDecision();
    }
  }, [record, requestDecision]);

  const handleSelect = (index: number) => {
    if (index === 0) {
      goToScreen("ACTION");
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

  if (isLoading || !record?.decision) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-ring-subtext">
        <div className="w-16 h-16 rounded-2xl bg-ring-card border border-ring-accent/40 flex items-center justify-center text-ring-accent animate-pulse shadow-[0_0_30px_rgba(0,163,255,0.4)]">
          <Bot className="w-8 h-8 animate-spin" />
        </div>
        <p className="text-xl font-bold text-ring-text">
          Doorstep Guardian AI Reasoning...
        </p>
        <p className="text-sm font-mono text-ring-subtext">
          Evaluating Amazon Ring doorstep metadata against household policy #104
        </p>
      </div>
    );
  }

  const decision = record.decision;
  const recommendedActionLabel =
    decision.recommended_action === "contact_authorized_member"
      ? "Contact Sarah Chen (Authorized Neighbor) to retrieve package"
      : decision.recommended_action === "collect_package"
      ? "Collect package personally upon return"
      : "Dismiss alert";

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ring-border gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-ring-accent uppercase tracking-widest flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-ring-accent" />
              Stage 3: Guardian AI Structured Decision
            </span>
            <PriorityBadge priority={decision.priority} size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ring-text tracking-tight mt-1">
            Contextual Triage &amp; Recommended Follow-up
          </h1>
          <p className="text-xs sm:text-sm text-ring-subtext">
            Deterministic rule-aligned assessment: follow-up required until confirmed resolution.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-ring-card border border-ring-border text-xs font-mono">
            <span className="text-ring-subtext">Classification: </span>
            <span className="text-ring-accent font-bold uppercase">{decision.event_classification}</span>
          </div>
          <StatusBadge status={record.status} size="sm" />
        </div>
      </div>

      {/* Main Decision Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-4 lg:my-6 flex-1 items-stretch">
        {/* Left Column: AI Rationale & Recommended Action */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-br from-ring-card to-ring-surface border-2 border-ring-accent/40 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-ring-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-ring-accent uppercase font-bold tracking-wider mb-2">
              <span>Structured AI Assessment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-ring-text tracking-tight">
              Actionable Follow-up Required
            </h2>
            <div className="mt-3 sm:mt-4 p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-ring-border text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
              &ldquo;{decision.rationale}&rdquo;
            </div>

            {/* Recommended Action Box */}
            <div className="mt-4 sm:mt-5 p-4 sm:p-5 rounded-xl bg-ring-accent/10 border-2 border-ring-accent/60 shadow-[0_0_20px_rgba(0,163,255,0.15)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono uppercase text-ring-accent font-bold tracking-wider mb-1.5 gap-1">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>AI Recommended Household Action</span>
                </div>
                <span className="bg-ring-accent/20 px-2 py-0.5 rounded text-[11px] text-white shrink-0 self-start sm:self-auto">
                  Requires Resident Confirmation
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-white mt-1">
                {recommendedActionLabel}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Neighbor Sarah Chen is listed under your household authorization list for package safekeeping.
              </p>
            </div>
          </div>

          <div className="text-xs text-ring-subtext font-mono flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-ring-border/80 gap-1 mt-4">
            <span>Safety Rule: No autonomous actions taken without explicit authorization.</span>
            <span>Confirmation Required: YES</span>
          </div>
        </div>

        {/* Right Column: Known Facts & Guardrails */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {/* Verified Facts */}
          <div className="bg-ring-card/80 border border-ring-border rounded-2xl p-4 sm:p-5 flex-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2.5">
              <CheckCircle className="w-4 h-4" />
              <span>Evidence Basis (Observed Facts)</span>
            </div>
            <ul className="space-y-2 text-xs">
              {decision.known_facts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold font-mono">✓</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bound Unknowns */}
          <div className="bg-ring-card/80 border border-ring-border rounded-2xl p-4 sm:p-5 flex-1">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2.5">
              <HelpCircle className="w-4 h-4" />
              <span>Safety Boundaries (Acknowledged Unknowns)</span>
            </div>
            <ul className="space-y-2 text-xs">
              {decision.unknowns.map((unknown, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-400">
                  <span className="text-sky-400 font-bold font-mono">?</span>
                  <span>{unknown}</span>
                </li>
              ))}
            </ul>
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
          <span>Back to Context</span>
        </button>

        <button
          onClick={() => handleSelect(0)}
          className={`py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg flex items-center gap-2.5 transition-all cursor-pointer ${
            isFocused(0)
              ? "bg-ring-accent text-black shadow-focus scale-[1.01]"
              : "bg-ring-blue text-white hover:bg-ring-accent hover:text-black"
          }`}
        >
          <span>Take Action on Recommendation</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
