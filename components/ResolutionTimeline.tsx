"use client";

import React from "react";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { useGuardianSession } from "@/lib/session/sessionMachine";
import { StatusBadge } from "./ui/Badge";
import { useFocusNavigation } from "@/lib/focus/useFocusGrid";

export function ResolutionTimeline() {
  const { record, goToScreen, goBack } = useGuardianSession();

  const handleSelect = (index: number) => {
    if (index === 0) {
      goToScreen("CLOSING");
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

  if (!record) return null;

  const states = ["NEW", "NEEDS_ATTENTION", "ACTION_SELECTED", "RESOLVED"];
  const currentIdx =
    record.status === "DISMISSED"
      ? 3
      : states.indexOf(record.status);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ring-border gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-ring-accent uppercase tracking-widest">
              Stage 5: State Machine &amp; Audit Trail
            </span>
            <StatusBadge status={record.status} size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ring-text tracking-tight mt-1">
            Event Resolution Lifecycle
          </h1>
          <p className="text-xs sm:text-sm text-ring-subtext">
            Transparent, tamper-evident audit history from initial sensor detection to confirmed physical outcome.
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs text-ring-subtext font-mono uppercase">Audit Records</span>
          <p className="text-lg sm:text-xl font-bold text-white font-mono">
            {record.history.length} Entries Logged
          </p>
        </div>
      </div>

      {/* State Machine Visualizer */}
      <div className="bg-ring-card/90 border border-ring-border rounded-2xl p-4 sm:p-6 my-3 sm:my-4 shrink-0">
        <div className="text-xs font-mono uppercase text-ring-subtext tracking-wider mb-3 sm:mb-4 font-bold flex items-center justify-between">
          <span>Lifecycle State Pipeline</span>
          <span className="text-ring-accent font-mono">Current Status: {record.status}</span>
        </div>

        <div className="flex items-center justify-between relative px-2 sm:px-6">
          {/* Connecting line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-ring-border z-0" />

          {states.map((st, idx) => {
            const isCompleted = currentIdx > idx || record.status === "RESOLVED";
            const isCurrent = record.status === st;

            return (
              <div key={st} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    isCurrent
                      ? "bg-ring-accent text-black ring-4 ring-ring-accent/40 shadow-[0_0_20px_rgba(0,163,255,0.6)] scale-110"
                      : isCompleted
                      ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      : "bg-ring-surface border-2 border-ring-border text-ring-subtext"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <span
                  className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-mono font-bold tracking-wider text-center ${
                    isCurrent
                      ? "text-ring-accent"
                      : isCompleted
                      ? "text-emerald-400"
                      : "text-ring-subtext"
                  }`}
                >
                  {st.replace("_", " ")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit History Log */}
      <div className="bg-ring-card/60 border border-ring-border rounded-2xl p-4 sm:p-5 flex-1 overflow-y-auto min-h-[160px] max-h-[300px]">
        <div className="text-xs font-mono uppercase text-ring-subtext tracking-wider mb-2.5 font-bold flex items-center gap-2">
          <FileText className="w-4 h-4 text-ring-accent" />
          <span>Chronological Audit Trail</span>
        </div>

        <div className="space-y-2.5 font-sans">
          {record.history.map((item, idx) => {
            const time = new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-ring-surface/90 border border-ring-border flex flex-col sm:flex-row sm:items-start justify-between text-xs gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-black/40 text-ring-accent font-mono font-bold shrink-0">
                    {time}
                  </span>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span>{item.action_summary}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-ring-card text-ring-subtext border border-ring-border">
                        Actor: {item.actor}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-slate-300 mt-0.5 leading-snug">{item.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <span className="text-slate-500 font-mono">{item.from_status}</span>
                  <span className="text-slate-400">&rarr;</span>
                  <span className="font-bold font-mono text-ring-accent">{item.to_status}</span>
                </div>
              </div>
            );
          })}
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
          <span>Back to Action Screen</span>
        </button>

        <button
          onClick={() => handleSelect(0)}
          className={`py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg flex items-center gap-2.5 transition-all cursor-pointer ${
            isFocused(0)
              ? "bg-ring-accent text-black shadow-focus scale-[1.01]"
              : "bg-ring-blue text-white hover:bg-ring-accent hover:text-black"
          }`}
        >
          <span>View Incident Resolution Summary</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
