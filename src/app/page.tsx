"use client";

import { useRef, useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { useChat } from "@/hooks/useChat";
import { useChatHistory } from "@/hooks/useChatHistory";

export default function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { messages, send, isStreaming, forceRefresh } = useChat();
  const { currentChatId, isLoading, createNewChat } = useChatHistory();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingNewChat, setIsLoadingNewChat] = useState(false);

  // Handle new chat creation with loading state
  const handleNewChatWithLoading = () => {
    console.log("Home: Starting new chat creation with loading...");
    console.log(
      "Home: Current state - currentChatId:",
      currentChatId,
      "messages:",
      messages.length
    );

    setIsLoadingNewChat(true);

    // Create new chat immediately
    console.log("Home: Creating new chat...");
    const newChatId = createNewChat();
    console.log("Home: Created new chat:", newChatId);

    // Force refresh to ensure messages are updated
    console.log("Home: Forcing messages refresh...");
    forceRefresh();

    // Hide loading after a short delay to show the loading state
    setTimeout(() => {
      console.log("Home: Finishing new chat loading");
      setIsLoadingNewChat(false);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-[#212121]">
        <TopNav />
        <div className="flex flex-1 overflow-hidden items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#212121]">
      <TopNav onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          className={`
            fixed lg:relative z-50 lg:z-auto
            transform transition-transform duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          onClose={() => setIsSidebarOpen(false)}
          onNewChat={handleNewChatWithLoading} // Pass our custom handler
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
            style={{ backgroundColor: "var(--color-chat-bg)" }}
          >
            <div className="max-w-3xl mx-auto h-full px-4 lg:px-0">
              <ChatWindow
                key={currentChatId || "no-chat"} // Force re-render when chat changes
                scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
                messages={messages}
                isStreaming={isStreaming}
                currentChatId={currentChatId} // Pass currentChatId as prop for debugging
                isLoadingNewChat={isLoadingNewChat} // Pass loading state
              />
            </div>
          </div>
          <div
            className="border-t px-4 py-4"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-background)",
            }}
          >
            <div className="max-w-3xl mx-auto">
              <ChatInput
                onSubmit={send}
                disabled={isStreaming}
                onHeightChange={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTop =
                      scrollRef.current.scrollHeight;
                  }
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
