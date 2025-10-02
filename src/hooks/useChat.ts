"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import type { Message, FileAttachment } from "@/types/chat";
import { streamChat } from "@/lib/ai/client";
import { useChatHistory } from "./useChatHistory";

export function useChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  const abortRef = useRef<AbortController | null>(null);
  const { 
    getCurrentMessages, 
    addMessage, 
    updateMessage, 
    currentChatId,
    setStreamingState,
    ensureCurrentChat,
    chats
  } = useChatHistory();
  
  // Force refresh function
  const forceRefresh = useCallback(() => {
    console.log('useChat: Force refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Update messages whenever currentChatId, chats, or refreshTrigger change
  useEffect(() => {
    console.log('useChat: Effect triggered - currentChatId:', currentChatId, 'chats count:', chats.length, 'refreshTrigger:', refreshTrigger);
    
    if (!currentChatId) {
      console.log('useChat: No current chat, clearing messages');
      setMessages([]);
      return;
    }

    // Find the current chat directly from chats array
    const currentChat = chats.find(chat => chat.id === currentChatId);
    if (currentChat) {
      console.log('useChat: Found current chat:', currentChat.id, 'with', currentChat.messages.length, 'messages');
      console.log('useChat: Setting messages to:', currentChat.messages);
      setMessages([...currentChat.messages]); // Create new array to force re-render
    } else {
      console.log('useChat: Current chat not found, clearing messages');
      setMessages([]);
    }
  }, [currentChatId, chats, refreshTrigger]); // Add refreshTrigger to dependencies

  const send = useCallback(async (text: string, attachments?: FileAttachment[]) => {
    // Ensure we have a current chat, create one if needed
    const chatId = ensureCurrentChat();
    if (!chatId) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
      attachments,
    };
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };
    
    // Add both messages to history
    console.log('useChat: Adding user message:', userMessage);
    addMessage(userMessage);
    console.log('useChat: Adding assistant message:', assistantMessage);
    addMessage(assistantMessage);

    setIsStreaming(true);
    setStreamingState(true); // Notify chat history about streaming state
    const controller = new AbortController();
    abortRef.current = controller;
    
    // Keep track of accumulated content locally to avoid stale closure issues
    let accumulatedContent = "";
    
    try {
      // Get fresh messages for the current chat
      const currentMessages = getCurrentMessages();
      const res = await streamChat({
        messages: [...currentMessages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          const chunk = decoder.decode(value);
          // Accumulate content locally
          accumulatedContent += chunk;
          // Update the assistant message with accumulated content
          updateMessage(assistantMessage.id, accumulatedContent);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      updateMessage(assistantMessage.id, "Sorry, I encountered an error. Please try again.");
    } finally {
      setIsStreaming(false);
      setStreamingState(false); // Notify chat history that streaming is done
      abortRef.current = null;
    }
  }, [addMessage, updateMessage, setStreamingState, ensureCurrentChat, getCurrentMessages]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, isStreaming, send, stop, forceRefresh };
}