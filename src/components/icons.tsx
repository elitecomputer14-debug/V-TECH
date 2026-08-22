import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size?: number) => ({
  width: size ?? 22,
  height: size ?? 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/* شعار V-TECH: شريحة معالج بداخلها حرف V */
export function LogoMark({ size = 34, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...p}>
      <rect x="8" y="8" width="32" height="32" rx="7" fill="#0c1530" stroke="#2ce1ff" strokeWidth="2.6" />
      {[16, 24, 32].map((v) => (
        <g key={v} stroke="#2ce1ff" strokeWidth="2.4">
          <path d={`M${v} 8V2`} />
          <path d={`M${v} 46v-6`} />
          <path d={`M8 ${v}H2`} />
          <path d={`M46 ${v}h-6`} />
        </g>
      ))}
      <path d="M16 17l8 15 8-15" stroke="#ff8c1a" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WrenchIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M14.2 6.3a4.6 4.6 0 0 0-6 6L3 17.5a2 2 0 1 0 2.8 2.8l5.2-5.2a4.6 4.6 0 0 0 6-6L14 12l-2.3-2.3 2.5-3.4Z" />
      <path d="M15 15l5 5" />
    </svg>
  );
}

export function MouseIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="7" y="3" width="10" height="18" rx="5" />
      <path d="M12 6.5v3.5" />
      <path d="M7 10h10" />
    </svg>
  );
}

export function DomeCamIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 8h18" />
      <path d="M5 8a7 7 0 0 0 14 0" />
      <circle cx="12" cy="8" r="2.6" />
      <path d="M12 10.6V14" />
      <circle cx="12" cy="16" r="1.6" fill="currentColor" stroke="none" />
      <path d="M4 20h16" strokeDasharray="2.5 3" />
    </svg>
  );
}

export function RouterIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="13" width="18" height="6.5" rx="2.5" />
      <path d="M7 16.2h.01M10.5 16.2h.01" strokeWidth="2.6" />
      <path d="M16.5 13V6.5" />
      <path d="M7.5 6a6.5 6.5 0 0 1 6-2.4M8.8 9a3.6 3.6 0 0 1 3.4-1.4" />
    </svg>
  );
}

export function SsdIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 17v2.5M12 17v2.5M17 17v2.5" />
      <path d="M6.5 10.5h4M6.5 13.5h7" strokeWidth="1.6" />
      <path d="M17.5 10.5l-1.8 3h2l-1.8 3" strokeWidth="1.6" />
    </svg>
  );
}

export function TerminalIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M7 9.5l3 2.7-3 2.7" />
      <path d="M12.5 15h4.5" />
    </svg>
  );
}

export function PhoneIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5.5 3.5h3l1.7 4.2-2.1 1.6a12.5 12.5 0 0 0 6.6 6.6l1.6-2.1 4.2 1.7v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function WhatsAppIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
      <path d="M9 8.8c0 3 3.2 6.2 6.2 6.2l.9-1.5-1.9-1-.8.7c-.9-.4-1.8-1.3-2.2-2.2l.7-.8-1-1.9L9 8.8Z" strokeWidth="1.5" />
    </svg>
  );
}

export function SoundOnIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
      <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.8a7.6 7.6 0 0 1 0 10.4" />
    </svg>
  );
}

export function SoundOffIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </svg>
  );
}

export function CopyIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
      <path d="M15.5 5.5v-1a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" transform="translate(1,1)" />
    </svg>
  );
}

export function CheckIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4.5 12.5l5 5L19.5 6.5" strokeWidth="2.6" />
    </svg>
  );
}

export function LockIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 14.5v2" strokeWidth="2.4" />
    </svg>
  );
}

export function PlayIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M8 5.5v13l10-6.5L8 5.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PauseIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M8.5 6v12M15.5 6v12" strokeWidth="3" />
    </svg>
  );
}

export function ChipLifeIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" stroke="none" opacity="0.25" />
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
      <path d="M10 3.5V6M14 3.5V6M10 18v2.5M14 18v2.5M3.5 10H6M3.5 14H6M18 10h2.5M18 14h2.5" strokeWidth="1.6" />
      <path d="M9.5 9.8l2.5 4.7 2.5-4.7" strokeWidth="2" />
    </svg>
  );
}

export function TrophyIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M8 4h8v6a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5.5H4.5a3.5 3.5 0 0 0 3.6 3.5M16 5.5h3.5a3.5 3.5 0 0 1-3.6 3.5" />
      <path d="M12 14v3M8.5 20.5h7M10 17h4v3.5h-4V17Z" />
    </svg>
  );
}

export function KeyboardIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="2.5" y="7" width="19" height="10.5" rx="2" />
      <path d="M6 10.5h.01M9.5 10.5h.01M13 10.5h.01M16.5 10.5h.01M6 14h.01M9 14h6M17.5 14h.01" strokeWidth="2.2" />
    </svg>
  );
}

export function TouchIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M9.5 11.5V5.8a1.8 1.8 0 0 1 3.6 0v5.4" />
      <path d="M13.1 11.8V9.6a1.7 1.7 0 0 1 3.4.3v3.6a6.5 6.5 0 0 1-6.5 6.3c-3 0-4.3-1.6-5.6-4.1l-1.2-2.4a1.6 1.6 0 0 1 2.6-1.8l1.7 1.8" />
      <path d="M11.3 3.2a4.6 4.6 0 0 1 4.2 1.5" opacity="0.6" />
    </svg>
  );
}

export function SparkIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8L12 3.5Z" fill="currentColor" stroke="none" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" fill="currentColor" stroke="none" opacity="0.7" />
    </svg>
  );
}

export function ArrowDownIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 4.5v15M6 13.5l6 6 6-6" />
    </svg>
  );
}

export function RefreshIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4.5 12a7.5 7.5 0 0 1 13-5.2L20 9.2" />
      <path d="M20 4.5v4.7h-4.7" />
      <path d="M19.5 12a7.5 7.5 0 0 1-13 5.2L4 14.8" />
      <path d="M4 19.5v-4.7h4.7" />
    </svg>
  );
}

export function MegaphoneIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

export function DownloadIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

export function LinkIcon({ size, ...p }: P) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
}
