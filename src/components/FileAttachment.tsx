"use client";

import Image from "next/image";
import type { FileAttachment } from "@/types/chat";

type Props = {
  attachment: FileAttachment;
  className?: string;
};

export function FileAttachmentDisplay({ attachment, className = "" }: Props) {
  const isImage = attachment.resourceType === "image";
  const fileSize = formatFileSize(attachment.size);

  const handleDownload = () => {
    window.open(attachment.url, "_blank");
  };

  if (isImage) {
    return (
      <div className={`relative max-w-xs sm:max-w-sm ${className}`}>
        <Image
          src={attachment.url}
          alt={attachment.name}
          width={300}
          height={200}
          className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity w-full h-auto"
          onClick={handleDownload}
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {attachment.name}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border cursor-pointer
        hover:bg-opacity-80 transition-colors max-w-xs sm:max-w-sm ${className}
      `}
      style={{
        backgroundColor: "var(--color-muted)",
        borderColor: "var(--color-border)",
      }}
      onClick={handleDownload}
    >
      <div className="flex-shrink-0">
        <FileIcon type={attachment.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-xs sm:text-sm font-medium truncate"
          style={{ color: "var(--color-text-primary)" }}
        >
          {attachment.name}
        </div>
        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {fileSize}
        </div>
      </div>
      <div className="flex-shrink-0">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: "var(--color-text-muted)" }}
        >
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
        </svg>
      </div>
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  const iconColor = "var(--color-accent)";

  if (type.includes("pdf")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={iconColor}>
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-5.5-6c.83 0 1.5-.67 1.5-1.5S13.33 11 12.5 11s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
      </svg>
    );
  }

  if (type.includes("word") || type.includes("document")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={iconColor}>
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-9.5-8H10l1 4 1-4h1.5l-1.75 6h-1.5L8.5 12z" />
      </svg>
    );
  }

  if (type.includes("excel") || type.includes("sheet")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={iconColor}>
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-7-6h2v2h-2v-2zm0 3h2v2h-2v-2zm3-3h2v2h-2v-2zm0 3h2v2h-2v-2z" />
      </svg>
    );
  }

  // Default file icon
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={iconColor}>
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
    </svg>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
