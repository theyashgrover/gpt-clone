"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

type Props = {
  scrollRef: React.RefObject<HTMLDivElement>;
  messages?: Message[];
  isStreaming?: boolean;
  currentChatId?: string | null;
  isLoadingNewChat?: boolean; // Add loading state for new chat
};

export function ChatWindow({
  scrollRef,
  messages = [],
  isStreaming = false,
  currentChatId,
  isLoadingNewChat = false,
}: Props) {
  const lastTokenRef = useRef<HTMLDivElement | null>(null);

  // Log when ChatWindow mounts/unmounts (should happen when key changes)
  useEffect(() => {
    console.log("ChatWindow: Component mounted for chatId:", currentChatId);
    return () => {
      console.log(
        "ChatWindow: Component unmounting for chatId:",
        currentChatId
      );
    };
  }, [currentChatId]); // Empty dependency array = only on mount/unmount

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, scrollRef]);

  console.log(
    "ChatWindow: Rendering for chatId:",
    currentChatId,
    "with",
    messages.length,
    "messages",
    "isLoadingNewChat:",
    isLoadingNewChat
  );

  // Show loading state when creating new chat
  if (isLoadingNewChat) {
    console.log("ChatWindow: Showing loading state for new chat");
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6 animate-pulse"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="white"
            className="animate-spin"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 0 1 8 8h-2a6 6 0 0 0-6-6V4z" />
          </svg>
        </div>
        <h1
          className="text-2xl font-semibold mb-3 fade-in"
          style={{ color: "var(--color-text-primary)" }}
        >
          Creating new chat...
        </h1>
        <p
          className="text-sm fade-in"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Please wait a moment
        </p>
      </div>
    );
  }

  if (messages.length === 0) {
    console.log(
      "ChatWindow: Showing welcome screen for chatId:",
      currentChatId
    );
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6 hover-lift"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1
          className="text-2xl font-semibold mb-3 fade-in"
          style={{ color: "var(--color-text-primary)" }}
        >
          How can I help you today?
        </h1>
        <p
          className="text-sm fade-in"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Start a conversation with ChatGPT
        </p>
      </div>
    );
  }

  console.log("ChatWindow: Showing messages list");
  return (
    <div role="list" aria-label="chat messages">
      {messages.map((m, index) => (
        <MessageBubble
          key={m.id}
          message={m}
          isStreaming={
            isStreaming &&
            m.role === "assistant" &&
            index === messages.length - 1
          }
        />
      ))}
      {/* Marker for streaming auto-scroll */}
      <div ref={lastTokenRef} />
    </div>
  );
}
