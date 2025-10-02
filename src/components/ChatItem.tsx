"use client";

import { useState, useRef, useEffect } from "react";
import type { Chat } from "@/types/chat";

type Props = {
  chat: Chat;
  isActive: boolean;
  onSelect: (chatId: string) => void;
  onRename: (chatId: string, newTitle: string) => void;
  onDelete: (chatId: string) => void;
};

export function ChatItem({
  chat,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== chat.title) {
      onRename(chat.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setEditTitle(chat.title);
      setIsEditing(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      onDelete(chat.id);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-opacity-80 cursor-pointer group ${
        isActive ? "bg-opacity-80" : ""
      }`}
      style={{
        color: isActive
          ? "var(--color-text-primary)"
          : "var(--color-text-secondary)",
        backgroundColor: isActive ? "var(--color-active-bg)" : "transparent",
      }}
      onClick={() => onSelect(chat.id)}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="flex-shrink-0"
      >
        <path d="M8 2v3M16 2v3M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      </svg>

      {isEditing ? (
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "var(--color-text-primary)" }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="truncate flex-1"
          onDoubleClick={() => setIsEditing(true)}
        >
          {chat.title}
        </span>
      )}

      {/* Action buttons - only show on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="p-1 rounded hover:bg-opacity-80 transition-colors"
          style={{ backgroundColor: "var(--color-muted)" }}
          aria-label="Rename chat"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="p-1 rounded hover:bg-opacity-80 transition-colors"
          style={{ backgroundColor: "var(--color-muted)" }}
          aria-label="Delete chat"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
