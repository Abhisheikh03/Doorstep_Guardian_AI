"use client";

import React from "react";
import { ArrowRight, Package, ShieldAlert, Sparkles, Clock } from "lucide-react";
import { useGuardianSession } from "@/lib/session/sessionMachine";
import { StatusBadge } from "./ui/Badge";
import { DoorbellPreview } from "./ui/DoorbellPreview";
import { useFocusNavigation } from "@/lib/focus/useFocusGrid";

export function HomeSafetyScreen() {
  const { record, provider, household, goToScreen } = useGuardianSession();

  const handleSelect = (index: number) => {
    if (index === 0) {
      goToScreen("CONTEXT");
    }
  };

  const { isFocused } = useFocusNavigation({
    itemCount: 1,
    initialIndex: 0,
    onSelect: handleSelect,
  });

  if (!record) {
    return (
      <div className="flex items-center justify-center h-full text-ring-subtext">
        Loading doorstep event...
      </div>
    );
  }

  const eventTime = new Date(record.event.timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto">
      {/* Top Banner: Core Differentiator Hook */}
      <div className="w-full bg-gradient-to-r from-ring-card via-ring-surface to-ring-card border border-ring-border/80 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-card-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-ring-text tracking-tight">
                Doorstep Attention Required
              </h2>
              <StatusBadge status={record.status} size="md" />
            </div>
            <p className="text-xs sm:text-sm text-ring-subtext mt-0.5">
              Traditional cameras simply notify. <span className="text-ring-accent font-semibold">Guardian AI</span> verifies follow-up outcomes under your household rules.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-xs font-mono uppercase tracking-wider text-ring-subtext">
            Household State
          </div>
          <div className="text-sm sm:text-base font-bold text-amber-400 mt-0.5">
            Residents Away (Office until 5:30 PM)
          </div>
        </div>
      </div>

      {/* Main Grid: Live Preview & Event Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 lg:my-6 flex-1 items-stretch">
        {/* Left: Ring Doorbell Porch Feed */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="text-xs font-mono uppercase text-ring-subtext tracking-wider mb-2 flex items-center gap-2">
            <span>Video Doorbell Pro Entrance Stream</span>
            <span className="text-ring-border">•</span>
            <span className="text-emerald-400 font-semibold">{provider.label}</span>
          </div>
          <DoorbellPreview
            event={record.event}
            isSimulated={provider.is_simulated}
          />
        </div>

        {/* Right: Event Card & Rule Trigger */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-ring-card/70 border border-ring-border rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-ring-border">
              <div className="flex items-center gap-2 text-ring-subtext text-xs font-mono uppercase">
                <Clock className="w-4 h-4 text-ring-accent" />
                <span>Detected at {eventTime}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-ring-surface border border-ring-border text-ring-subtext font-mono">
                {record.event.event_id}
              </span>
            </div>

            <div className="mt-4 sm:mt-5">
              <div className="flex items-center gap-2 text-ring-accent text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">
                <Package className="w-4 h-4" />
                <span>{record.event.event_type.replace("_", " ")}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-ring-text tracking-tight">
                Amazon Delivery on Porch
              </h3>
              <p className="text-sm sm:text-base text-ring-subtext mt-1.5 leading-relaxed">
                {record.event.description}
              </p>
            </div>

            {/* Configured Rule Highlight */}
            <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Triggered Household Policy #104</span>
              </div>
              <div className="text-sm text-slate-200 font-medium mt-1">
                &ldquo;Unattended Porch Delivery While Away&rdquo;
              </div>
              <p className="text-xs text-amber-200/70 mt-1 leading-normal">
                Delivery occurred while residents are away. Guardian flagged this event for proactive confirmation rather than passive dismissal.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-ring-border">
            <button
              onClick={() => goToScreen("CONTEXT")}
              className={`w-full py-4 sm:py-5 px-6 rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all cursor-pointer ${
                isFocused(0)
                  ? "bg-ring-accent text-black shadow-focus scale-[1.01]"
                  : "bg-ring-blue text-white hover:bg-ring-accent hover:text-black"
              }`}
            >
              <span>Review Event & Context</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-center text-xs text-ring-subtext mt-2 font-mono">
              Press [ENTER] to review context &bull; Use [▲▼] to navigate
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation Hints */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-ring-subtext font-mono border-t border-ring-border/60 pt-3 gap-2 shrink-0">
        <div>Amazon Ring Security Intelligence &bull; Active Doorstep Protection</div>
        <div className="flex items-center gap-3">
          <span className="bg-ring-card px-2 py-0.5 rounded border border-ring-border text-ring-text">
            ENTER: Select
          </span>
          <span className="bg-ring-card px-2 py-0.5 rounded border border-ring-border text-ring-text">
            ARROWS: Navigate
          </span>
          <span className="bg-ring-card px-2 py-0.5 rounded border border-ring-border text-ring-text">
            R: Reset
          </span>
        </div>
      </div>
    </div>
  );
}
