"use client";

import Link from "next/link";
import { useState } from "react";
import { useChatHistory } from "@/hooks/useChatHistory";
import { ChatItem } from "./ChatItem";

type Props = {
  className?: string;
  onClose?: () => void;
  onNewChat?: () => void; // Add onNewChat prop
};

export function Sidebar({ className = "", onClose, onNewChat }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    chats,
    currentChatId,
    createNewChat,
    renameChat,
    deleteChat,
    switchToChat,
  } = useChatHistory();

  console.log(
    "Sidebar: Rendering with",
    chats.length,
    "chats, currentChatId:",
    currentChatId
  );

  const handleNewChat = () => {
    console.log("Sidebar: Handling new chat click...");
    if (onNewChat) {
      // Use custom handler from parent if provided
      onNewChat();
    } else {
      // Fallback to direct creation
      console.log("Sidebar: Creating new chat directly...");
      const newChatId = createNewChat();
      console.log("Sidebar: Created new chat with ID:", newChatId);
    }
    onClose?.(); // Close sidebar on mobile after creating new chat
  };

  const handleChatSelect = (chatId: string) => {
    console.log("Sidebar: Switching to chat:", chatId);
    switchToChat(chatId);
    onClose?.(); // Close sidebar on mobile after selecting chat
  };

  return (
    <aside
      className={`w-64 h-full border-r flex flex-col ${className}`}
      style={{
        borderColor: "var(--color-sidebar-border)",
        backgroundColor: "var(--color-sidebar-bg)",
      }}
    >
      <div className="flex flex-col h-full">
        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full h-9 rounded-md text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all duration-200 hover-lift"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            New chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 px-3 pl-8 rounded-md text-sm input-focus"
              style={{
                backgroundColor: "var(--color-muted)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 mb-4">
          <nav className="space-y-1">
            {/* <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-opacity-80 transition-colors"
              style={{
                color: "var(--color-text-primary)",
                backgroundColor: "transparent",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
              Library
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-opacity-80 transition-colors"
              style={{
                color: "var(--color-text-primary)",
                backgroundColor: "transparent",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Projects
            </Link> */}
          </nav>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="mb-2">
            <h3
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-text-muted)" }}
            >
              Chats
            </h3>
          </div>
          <ul className="space-y-1">
            {chats
              .filter((chat) =>
                searchQuery
                  ? chat.title.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )
              .map((chat) => {
                console.log(
                  "Sidebar: Rendering chat item:",
                  chat.id,
                  chat.title,
                  "isActive:",
                  chat.id === currentChatId
                );
                return (
                  <li key={chat.id}>
                    <ChatItem
                      chat={chat}
                      isActive={chat.id === currentChatId}
                      onSelect={handleChatSelect}
                      onRename={renameChat}
                      onDelete={deleteChat}
                    />
                  </li>
                );
              })}
            {chats.length === 0 && (
              <li className="text-center py-4">
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  No chats yet. Start a new conversation!
                </p>
              </li>
            )}
          </ul>
        </div>

        {/* User Section */}
        <div
          className="p-3 border-t"
          style={{ borderColor: "var(--color-sidebar-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <span className="text-white text-sm font-medium">Y</span>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Yash Grover
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Free
              </div>
            </div>
            <button
              className="text-xs px-2 py-1 rounded-md hover:bg-opacity-80 transition-colors"
              style={{
                backgroundColor: "var(--color-muted)",
                color: "var(--color-text-primary)",
              }}
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
