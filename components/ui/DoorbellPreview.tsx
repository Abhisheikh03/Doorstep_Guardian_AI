import React from "react";
import { Camera, Box, ShieldCheck, Clock } from "lucide-react";
import { NormalizedRingEvent } from "@/lib/ring/normalizeEvent";

interface DoorbellPreviewProps {
  event: NormalizedRingEvent;
  isSimulated?: boolean;
}

export function DoorbellPreview({ event, isSimulated = true }: DoorbellPreviewProps) {
  const formattedTime = new Date(event.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-ring-border bg-slate-950 shadow-2xl group">
      {/* Visual Porch Representation using clean SVG vectors */}
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 800 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="800" y2="450" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f172a" />
            <stop offset="0.6" stopColor="#1e293b" />
            <stop offset="1" stopColor="#090d16" />
          </linearGradient>
          <linearGradient id="doorGrad" x1="400" y1="40" x2="400" y2="390" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e1b4b" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="floorGrad" x1="0" y1="360" x2="800" y2="450" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="boxGrad" x1="380" y1="280" x2="490" y2="360" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b45309" />
            <stop offset="1" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* Porch wall background */}
        <rect width="800" height="450" fill="url(#wallGrad)" />

        {/* Front Door */}
        <rect x="260" y="40" width="280" height="340" rx="6" fill="url(#doorGrad)" stroke="#334155" strokeWidth="3" />
        <rect x="290" y="65" width="220" height="130" rx="4" fill="#1e293b" fillOpacity="0.6" stroke="#475569" strokeWidth="2" />
        <rect x="290" y="215" width="220" height="140" rx="4" fill="#1e293b" fillOpacity="0.6" stroke="#475569" strokeWidth="2" />
        {/* Door handle */}
        <circle cx="285" cy="225" r="7" fill="#facc15" />

        {/* Floor / Porch decking */}
        <path d="M0 370 L800 370 L800 450 L0 450 Z" fill="url(#floorGrad)" />
        <line x1="0" y1="370" x2="800" y2="370" stroke="#475569" strokeWidth="2" />

        {/* Welcome Doormat */}
        <rect x="290" y="372" width="220" height="58" rx="5" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
        <text x="400" y="407" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="600" letterSpacing="4">
          WELCOME
        </text>

        {/* Delivered Package Box on Mat */}
        <g id="delivered-package">
          {/* Shadow */}
          <ellipse cx="440" cy="388" rx="55" ry="16" fill="#000000" fillOpacity="0.6" />
          {/* Box 3D perspective */}
          <polygon points="390,320 470,305 520,335 440,350" fill="#d97706" />
          <polygon points="390,320 440,350 440,388 390,358" fill="url(#boxGrad)" />
          <polygon points="440,350 520,335 520,373 440,388" fill="#92400e" />
          {/* Amazon tape line */}
          <line x1="430" y1="312" x2="480" y2="342" stroke="#1e293b" strokeWidth="5" />
          {/* Shipping Label */}
          <rect x="448" y="356" width="30" height="18" fill="#f8fafc" rx="2" transform="rotate(-10 448 356)" />
        </g>
      </svg>

      {/* Ring Camera Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur border border-white/10 text-white">
          <Camera className="w-4 h-4 text-ring-accent" />
          <span className="text-xs font-mono font-medium tracking-wide">
            {event.device_name}
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isSimulated && (
            <div className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-wider">
              SIMULATED EVENT
            </div>
          )}
          <div className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur border border-white/10 text-white font-mono text-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* AI Computer Vision Bounding Box Overlay */}
      <div className="absolute bottom-6 right-20 pointer-events-none animate-fade-in">
        <div className="relative border-2 border-emerald-400/90 rounded-md p-2 bg-emerald-950/40 backdrop-blur shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-mono">
            <Box className="w-3.5 h-3.5" />
            <span>DETECTED: Medium Parcel</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono mt-0.5">
            Carrier: {event.metadata.carrier || "Amazon Logistics"} (Conf: 96%)
          </div>
          {/* Corner brackets */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400" />
        </div>
      </div>
    </div>
  );
}
