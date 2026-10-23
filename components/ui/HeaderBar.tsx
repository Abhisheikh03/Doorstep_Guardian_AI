import React from "react";
import { Shield, RotateCcw, Home } from "lucide-react";
import { useGuardianSession, ScreenType } from "@/lib/session/sessionMachine";

export function HeaderBar() {
  const { currentScreen, provider, household, resetDemo, goToScreen } =
    useGuardianSession();

  const steps: { key: ScreenType; label: string; number: string }[] = [
    { key: "HOME", label: "Entrance Preview", number: "1" },
    { key: "CONTEXT", label: "Event Context", number: "2" },
    { key: "DECISION", label: "Guardian Decision", number: "3" },
    { key: "ACTION", label: "Action Select", number: "4" },
    { key: "RESOLUTION", label: "Resolution Audit", number: "5" },
    { key: "CLOSING", label: "Resolution Summary", number: "6" },
  ];

  return (
    <header className="w-full bg-ring-surface/95 border-b border-ring-border backdrop-blur px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between z-20 shrink-0">
      {/* Brand & Mode */}
      <div className="flex items-center gap-3 md:gap-4">
        <div
          onClick={() => goToScreen("HOME")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ring-accent to-ring-blue flex items-center justify-center text-white shadow-lg shadow-ring-blue/30 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base md:text-lg text-ring-text tracking-tight">
                Doorstep Guardian <span className="text-ring-accent">AI</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-ring-card border border-ring-border text-ring-subtext uppercase font-semibold">
                Amazon Ring
              </span>
            </div>
            <p className="text-[11px] text-ring-subtext font-mono">
              Ring Security Intelligence System
            </p>
          </div>
        </div>

        {/* Source Mode Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-ring-card border border-ring-border">
          <span
            className={`w-2 h-2 rounded-full ${
              provider.is_simulated
                ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            }`}
          />
          <span className="text-[11px] font-semibold tracking-wider text-ring-text uppercase font-mono">
            {provider.label}
          </span>
        </div>
      </div>

      {/* Breadcrumb Steps */}
      <nav className="hidden md:flex items-center gap-1">
        {steps.map((s, idx) => {
          const isActive = currentScreen === s.key;
          const isPast =
            steps.findIndex((x) => x.key === currentScreen) > idx;

          return (
            <button
              key={s.key}
              onClick={() => goToScreen(s.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-ring-accent/20 border border-ring-accent text-ring-accent font-semibold shadow-[0_0_12px_rgba(0,163,255,0.3)]"
                  : isPast
                  ? "bg-ring-card/70 border border-ring-border/60 text-emerald-400"
                  : "bg-ring-surface text-ring-subtext/60 border border-transparent hover:text-ring-subtext"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isActive
                    ? "bg-ring-accent text-black font-bold"
                    : isPast
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-ring-border text-ring-subtext"
                }`}
              >
                {isPast ? "✓" : s.number}
              </span>
              <span className="hidden lg:inline">{s.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Household Status & Reset */}
      <div className="flex items-center gap-2.5">
        {household && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ring-card/80 border border-ring-border text-xs text-ring-subtext">
            <Home className="w-3.5 h-3.5 text-ring-accent" />
            <span className="text-ring-text font-medium">{household.name}</span>
            <span className="text-ring-border">|</span>
            <span className="text-amber-400 font-medium capitalize">
              {household.resident_status.state}: {household.resident_status.details}
            </span>
          </div>
        )}

        <button
          onClick={() => resetDemo()}
          title="Reset to initial doorstep scenario"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ring-card hover:bg-ring-highlight border border-ring-border text-xs font-semibold text-ring-subtext hover:text-ring-text transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ring-accent" />
          <span>Reset Scenario</span>
        </button>
      </div>
    </header>
  );
}
