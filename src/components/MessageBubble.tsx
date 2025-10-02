"use client";

import type { Message } from "@/types/chat";
import { FileAttachmentDisplay } from "./FileAttachment";

type Props = {
  message: Message;
  isStreaming?: boolean;
};

export function MessageBubble({ message, isStreaming = false }: Props) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`w-full py-4 sm:py-6 fade-in`}
      role="listitem"
      aria-label={`${message.role} message`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className="w-8 h-8 rounded-sm overflow-hidden flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: isUser
              ? "var(--color-accent)"
              : "var(--color-muted)",
          }}
        >
          {isUser ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="var(--color-accent)"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {isUser ? "You" : "ChatGPT"}
            </span>
            <time
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
              aria-label="message timestamp"
            >
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
          {/* File Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <FileAttachmentDisplay
                  key={attachment.id}
                  attachment={attachment}
                  className="max-w-xs sm:max-w-sm"
                />
              ))}
            </div>
          )}

          {/* Message Content */}
          {message.content && (
            <div
              className="message-content prose max-w-none whitespace-pre-wrap text-sm sm:text-base"
              style={{ color: "var(--color-text-primary)" }}
              aria-live={isAssistant ? "polite" : undefined}
            >
              {message.content}
              {isStreaming && isAssistant && (
                <span className="streaming-cursor">▋</span>
              )}
            </div>
          )}
          {isAssistant && (
            <div className="mt-3 flex items-center gap-2">
              <button
                className="p-1 rounded hover:bg-opacity-80 transition-colors"
                style={{ backgroundColor: "var(--color-muted)" }}
                aria-label="Refresh"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
              </button>
              <button
                className="p-1 rounded hover:bg-opacity-80 transition-colors"
                style={{ backgroundColor: "var(--color-muted)" }}
                aria-label="More options"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
