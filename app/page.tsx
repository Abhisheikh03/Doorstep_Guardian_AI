"use client";

import React, { useEffect } from "react";
import { HeaderBar } from "@/components/ui/HeaderBar";
import { HomeSafetyScreen } from "@/components/HomeSafetyScreen";
import { EventContext } from "@/components/EventContext";
import { GuardianDecision } from "@/components/GuardianDecision";
import { ActionConfirmation } from "@/components/ActionConfirmation";
import { ResolutionTimeline } from "@/components/ResolutionTimeline";
import { ClosingSummary } from "@/components/ClosingSummary";
import { useGuardianSession } from "@/lib/session/sessionMachine";

export default function Home() {
  const { currentScreen, initSession, resetDemo, error } =
    useGuardianSession();

  // Initialize session on mount
  useEffect(() => {
    initSession();
  }, [initSession]);

  // Global keyboard listener for shortcut keys (e.g. 'R' for reset)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        resetDemo();
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, [resetDemo]);

  return (
    <main className="w-full h-full min-h-screen bg-ring-dark flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden select-none">
      {/* Top Header */}
      <HeaderBar />

      {/* Global Error Banner if any */}
      {error && (
        <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-center justify-between font-mono">
          <span>System Notice: {error}</span>
          <button
            onClick={() => initSession(true)}
            className="px-3 py-1 bg-rose-500/30 rounded hover:bg-rose-500/50 text-white font-bold text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Stage Screen Container - Full Viewport Dynamic Sizing */}
      <div className="flex-1 w-full relative flex flex-col overflow-y-auto lg:overflow-hidden">
        {currentScreen === "HOME" && <HomeSafetyScreen />}
        {currentScreen === "CONTEXT" && <EventContext />}
        {currentScreen === "DECISION" && <GuardianDecision />}
        {currentScreen === "ACTION" && <ActionConfirmation />}
        {currentScreen === "RESOLUTION" && <ResolutionTimeline />}
        {currentScreen === "CLOSING" && <ClosingSummary />}
      </div>
    </main>
  );
}
