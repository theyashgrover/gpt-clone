"use client";

import { useCallback, useState } from "react";
import type { FileAttachment } from "@/types/chat";

type Props = {
  onFileUploaded: (attachment: FileAttachment) => void;
  disabled?: boolean;
};

export function FileUpload({ onFileUploaded, disabled = false }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const { attachment } = await response.json();
        onFileUploaded(attachment);
      } catch (error) {
        console.error("Upload error:", error);
        alert(error instanceof Error ? error.message : "Failed to upload file");
      } finally {
        setIsUploading(false);
      }
    },
    [onFileUploaded]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadFile(file);
      }
      // Reset input
      event.target.value = "";
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const file = event.dataTransfer.files[0];
      if (file) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
      />
      <label
        htmlFor="file-upload"
        className={`
          p-2 rounded-md transition-colors cursor-pointer
          ${
            disabled || isUploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-opacity-80"
          }
          ${isDragOver ? "bg-opacity-60" : ""}
        `}
        style={{
          backgroundColor: "transparent",
          color: "var(--color-text-muted)",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        aria-label="Upload file"
      >
        {isUploading ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="animate-spin"
          >
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
          </svg>
        )}
      </label>
    </>
  );
}
