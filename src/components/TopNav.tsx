"use client";

import type { ComponentProps } from "react";

type Props = {
  className?: string;
  onMenuClick?: () => void;
} & ComponentProps<"header">;

export function TopNav({ className = "", onMenuClick, ...rest }: Props) {
  return (
    <header
      {...rest}
      className={`flex items-center justify-between h-14 border-b px-4 ${className}`}
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-background)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden h-8 w-8 rounded-md flex items-center justify-center hover:bg-opacity-80 transition-colors"
          style={{
            backgroundColor: "var(--color-muted)",
            color: "var(--color-text-primary)",
          }}
          aria-label="Toggle menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div
          className="font-semibold text-lg"
          style={{ color: "var(--color-text-primary)" }}
        >
          ChatGPT
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* <button
          className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-opacity-80 transition-colors"
          style={{
            backgroundColor: "var(--color-muted)",
            color: "var(--color-text-primary)",
          }}
          aria-label="Share"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
          </svg>
        </button>
        <button
          className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-opacity-80 transition-colors"
          style={{
            backgroundColor: "var(--color-muted)",
            color: "var(--color-text-primary)",
          }}
          aria-label="More options"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button> */}
      </div>
    </header>
  );
}
