import type { JSX, SVGProps } from "react";

export type IconName =
  | "activity"
  | "alert"
  | "arrow-right"
  | "bell"
  | "bot"
  | "briefcase"
  | "calendar"
  | "chart"
  | "chevron-down"
  | "chevron-right"
  | "command"
  | "database"
  | "grid"
  | "layers"
  | "more"
  | "pulse"
  | "replay"
  | "scan"
  | "search"
  | "settings"
  | "sparkles"
  | "target"
  | "trending-up"
  | "user"
  | "users"
  | "wave";

interface DashboardIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function DashboardIcon({ name, size = 18, ...props }: DashboardIconProps): JSX.Element {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      {...props}
      {...commonProps}
    >
      {name === "grid" && (
        <>
          <rect height="7" rx="1" width="7" x="3" y="3" />
          <rect height="7" rx="1" width="7" x="14" y="3" />
          <rect height="7" rx="1" width="7" x="3" y="14" />
          <rect height="7" rx="1" width="7" x="14" y="14" />
        </>
      )}
      {name === "activity" && <path d="M3 12h4l2.2-6 4.1 12L16 10l1.6 2H21" />}
      {name === "calendar" && (
        <>
          <rect height="17" rx="2" width="18" x="3" y="4" />
          <path d="M8 2v4M16 2v4M3 10h18" />
        </>
      )}
      {name === "chart" && <path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16V5" />}
      {name === "bot" && (
        <>
          <rect height="13" rx="3" width="16" x="4" y="7" />
          <path d="M12 3v4M9 12h.01M15 12h.01M9 16h6" />
        </>
      )}
      {name === "target" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M19 5l2-2M18 6l3-3" />
        </>
      )}
      {name === "sparkles" && (
        <>
          <path d="m12 3 .9 3.1L16 7l-3.1.9L12 11l-.9-3.1L8 7l3.1-.9L12 3Z" />
          <path d="m18.5 13 .6 2 1.9.6-1.9.6-.6 2-.6-2-1.9-.6 1.9-.6.6-2Z" />
          <path d="m5.5 14 .7 2.3L8.5 17l-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
        </>
      )}
      {name === "layers" && (
        <>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
        </>
      )}
      {name === "replay" && <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8m0-5v5h5M12 7v5l3 2" />}
      {name === "briefcase" && (
        <>
          <rect height="13" rx="2" width="18" x="3" y="7" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
        </>
      )}
      {name === "trending-up" && <path d="m4 16 6-6 4 4 6-7M15 7h5v5" />}
      {name === "bell" && (
        <>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </>
      )}
      {name === "settings" && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.02 2.02-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.86v-.08a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.02-2.02.06-.06A1.7 1.7 0 0 0 7.34 15a1.7 1.7 0 0 0-1.56-1.04H5.7v-2.86h.08a1.7 1.7 0 0 0 1.56-1.04A1.7 1.7 0 0 0 7 8.18l-.06-.06L8.96 6.1l.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.94 5V4.92h2.86V5a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.02 2.02-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04h.08v2.86h-.08A1.7 1.7 0 0 0 19.4 15Z" />
        </>
      )}
      {name === "pulse" && <path d="M3 12h3l2.1-5 4 11 2.4-7 1.5 2H21" />}
      {name === "search" && (
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </>
      )}
      {name === "command" && <path d="M9 9a3 3 0 1 0-6 0 3 3 0 0 0 6 0Zm12 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0ZM9 15a3 3 0 1 0-6 0 3 3 0 0 0 6 0Zm12 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />}
      {name === "chevron-down" && <path d="m7 10 5 5 5-5" />}
      {name === "chevron-right" && <path d="m9 18 6-6-6-6" />}
      {name === "arrow-right" && <path d="M5 12h14m-5-5 5 5-5 5" />}
      {name === "more" && <path d="M5 12h.01M12 12h.01M19 12h.01" strokeWidth="3" />}
      {name === "user" && (
        <>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </>
      )}
      {name === "users" && (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 20a6 6 0 0 0-3-5.2" />
        </>
      )}
      {name === "scan" && (
        <>
          <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
      {name === "alert" && (
        <>
          <path d="M10.3 3.5 2.9 17a2 2 0 0 0 1.75 3h14.7A2 2 0 0 0 21.1 17L13.7 3.5a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4M12 17h.01" />
        </>
      )}
      {name === "database" && (
        <>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v7c0 1.66 3.13 3 7 3s7-1.34 7-3V5M5 12v7c0 1.66 3.13 3 7 3s7-1.34 7-3v-7" />
        </>
      )}
      {name === "wave" && <path d="M3 12c2.2-5 4.4 5 6.6 0s4.4-5 6.6 0 4.4 5 4.4 0" />}
    </svg>
  );
}
