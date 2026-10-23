import React from "react";
import { EventStatus } from "@/lib/store/householdEventStore";

interface BadgeProps {
  status?: EventStatus;
  priority?: "informational" | "attention_needed" | "urgent";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, size = "md", className = "" }: BadgeProps) {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm font-semibold tracking-wide",
    lg: "px-5 py-2 text-base font-bold tracking-wider",
  }[size];

  switch (status) {
    case "NEEDS_ATTENTION":
      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-300 uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)] ${sizeClasses} ${className}`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          Needs Attention
        </span>
      );

    case "ACTION_SELECTED":
      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/15 text-sky-300 uppercase shadow-[0_0_15px_rgba(14,165,233,0.2)] ${sizeClasses} ${className}`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          Action Selected
        </span>
      );

    case "RESOLVED":
      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)] ${sizeClasses} ${className}`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          Verified Resolved
        </span>
      );

    case "DISMISSED":
      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/80 text-slate-300 uppercase ${sizeClasses} ${className}`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          Dismissed
        </span>
      );

    case "NEW":
    default:
      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 uppercase ${sizeClasses} ${className}`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          New Event
        </span>
      );
  }
}

export function PriorityBadge({ priority, size = "md" }: BadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm font-semibold",
    lg: "px-4 py-1.5 text-base font-bold",
  }[size];

  switch (priority) {
    case "urgent":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wide ${sizeClasses}`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          Urgent Priority
        </span>
      );
    case "attention_needed":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wide ${sizeClasses}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Attention Needed
        </span>
      );
    case "informational":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md bg-slate-700/60 text-slate-300 border border-slate-600 uppercase tracking-wide ${sizeClasses}`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          Informational
        </span>
      );
  }
}
