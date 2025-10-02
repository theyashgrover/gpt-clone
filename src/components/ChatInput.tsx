"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileUpload } from "./FileUpload";
import { FileAttachmentDisplay } from "./FileAttachment";
import type { FileAttachment } from "@/types/chat";

type Props = {
  onSubmit?: (text: string, attachments?: FileAttachment[]) => void;
  onHeightChange?: () => void;
  disabled?: boolean;
};

export function ChatInput({
  onSubmit,
  onHeightChange,
  disabled = false,
}: Props) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const submit = useCallback(() => {
    const text = value.trim();
    if ((!text && attachments.length === 0) || disabled) return;
    onSubmit?.(text, attachments.length > 0 ? attachments : undefined);
    setValue("");
    setAttachments([]);
  }, [onSubmit, value, attachments, disabled]);

  const handleFileUploaded = useCallback((attachment: FileAttachment) => {
    setAttachments((prev) => [...prev, attachment]);
  }, []);

  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
    onHeightChange?.();
  }, [value, onHeightChange]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* File Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative">
              <FileAttachmentDisplay
                attachment={attachment}
                className="max-w-xs sm:max-w-sm"
              />
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                aria-label="Remove attachment"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className="rounded-xl border p-2 hover-lift"
        style={{
          borderColor: "var(--color-input-border)",
          backgroundColor: "var(--color-input-bg)",
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Message ChatGPT
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent outline-none p-3 placeholder:text-opacity-60 input-focus text-sm sm:text-base"
            style={{
              color: "var(--color-text-primary)",
            }}
            rows={1}
            placeholder="Ask anything"
            aria-label="Message input"
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* <button
              className="p-2 rounded-md hover:bg-opacity-80 transition-colors"
              style={{
                backgroundColor: "transparent",
                color: "var(--color-text-muted)",
              }}
              aria-label="Voice input"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
              </svg>
            </button> */}
            <FileUpload
              onFileUploaded={handleFileUploaded}
              disabled={disabled}
            />
            <button
              onClick={submit}
              disabled={disabled || (!value.trim() && attachments.length === 0)}
              className="p-2 rounded-md text-white text-sm font-medium transition-all duration-200 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  disabled || (!value.trim() && attachments.length === 0)
                    ? "var(--color-text-muted)"
                    : "var(--color-accent)",
              }}
              aria-label="Send message"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="px-3 pb-1">
          <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Press Enter to send • Shift+Enter for newline
          </div>
        </div>
      </div>
    </div>
  );
}
