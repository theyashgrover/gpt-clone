"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Chat, Message, ChatHistory } from "@/types/chat";

const STORAGE_KEY = "chatgpt-clone-history";
const MAX_CHATS = 20;

export function useChatHistory() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setIsStreaming] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('Loading from localStorage:', !!stored);
      
      if (stored) {
        const history: ChatHistory = JSON.parse(stored);
        const loadedChats = history.chats || [];
        console.log('Loaded chats:', loadedChats.map(c => ({ id: c.id, title: c.title, messageCount: c.messages.length })));
        setChats(loadedChats);
        
        // If there are chats but no current chat ID, or the current chat doesn't exist, 
        // set the first chat as current
        if (loadedChats.length > 0) {
          const validCurrentChat = loadedChats.find(chat => chat.id === history.currentChatId);
          const selectedChatId = validCurrentChat ? history.currentChatId : loadedChats[0].id;
          console.log('Setting current chat to:', selectedChatId);
          setCurrentChatId(selectedChatId);
        } else {
          // No chats exist, create an initial one
          console.log('No chats found, setting currentChatId to null');
          setCurrentChatId(null);
        }
      } else {
        // No stored history, start fresh
        console.log('No stored history, starting fresh');
        setChats([]);
        setCurrentChatId(null);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setChats([]);
      setCurrentChatId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Immediate save to localStorage with current state
  const saveToStorageImmediate = useCallback((currentChats: Chat[], currentChatIdParam: string | null) => {
    if (isLoading) return;
    
    try {
      const history: ChatHistory = {
        chats: currentChats,
        currentChatId: currentChatIdParam,
        maxChats: MAX_CHATS,
      };
      console.log('saveToStorageImmediate: Saving to localStorage:', {
        chatsCount: currentChats.length,
        chatsWithMessages: currentChats.map(c => ({ id: c.id, title: c.title, messageCount: c.messages.length })),
        currentChatId: currentChatIdParam
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      console.log('saveToStorageImmediate: Successfully saved');
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, [isLoading]);

  // Debounced save to localStorage (fallback)
  const saveToStorage = useCallback(() => {
    saveToStorageImmediate(chats, currentChatId);
  }, [chats, currentChatId, saveToStorageImmediate]);

  // Save to localStorage whenever chats or currentChatId changes
  useEffect(() => {
    if (isLoading) return;
    
    // Clear existing timeout
    const currentTimeout = saveTimeoutRef.current;
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    
    // Save immediately
    console.log('Save effect triggered, chats:', chats.length, 'currentChatId:', currentChatId);
    saveToStorage();
    
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, [chats, currentChatId, isLoading, saveToStorage]);

  // Background sync every 20 seconds
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      console.log('Background sync: Saving to localStorage');
      saveToStorage();
    }, 20000); // 20 seconds
    
    return () => clearInterval(interval);
  }, [isLoading, saveToStorage]);

  // Create new chat
  const createNewChat = useCallback(() => {
    console.log('useChatHistory: Creating new chat...');
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    console.log('useChatHistory: New chat created with ID:', newChat.id);

    // Update chats state
    setChats((prev) => {
      const updated = [newChat, ...prev];
      const finalUpdated = updated.slice(0, MAX_CHATS);
      console.log('useChatHistory: Updated chats array, new count:', finalUpdated.length);
      
      // Save immediately with the updated state
      setTimeout(() => {
        console.log('useChatHistory: Saving new chat to localStorage');
        saveToStorageImmediate(finalUpdated, newChat.id);
      }, 0);
      
      return finalUpdated;
    });
    
    // Set current chat ID
    console.log('useChatHistory: Setting current chat ID to:', newChat.id);
    setCurrentChatId(newChat.id);
    
    return newChat.id;
  }, [saveToStorageImmediate]);

  // Switch to existing chat
  const switchToChat = useCallback((chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      console.log('switchToChat: Switching to chat', chatId, 'with', chat.messages.length, 'messages');
      console.log('switchToChat: Chat details:', { id: chat.id, title: chat.title, messageCount: chat.messages.length });
      setCurrentChatId(chatId);
    } else {
      console.log('switchToChat: Chat not found:', chatId);
    }
  }, [chats]);

  // Add message to current chat
  const addMessage = useCallback((message: Message) => {
    if (!currentChatId) {
      console.log('addMessage: No currentChatId');
      return;
    }

    console.log('addMessage: Adding message to chat', currentChatId, message);
    setChats((prev) => {
      const updated = prev.map((chat) => {
        if (chat.id === currentChatId) {
          const updatedMessages = [...chat.messages, message];
          // Auto-generate title from first user message if still "New Chat"
          let title = chat.title;
          if (title === "New Chat" && message.role === "user") {
            title = message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "");
          }
          
          console.log('addMessage: Updated chat', chat.id, 'new message count:', updatedMessages.length);
          return {
            ...chat,
            messages: updatedMessages,
            title,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
      console.log('addMessage: Updated chats state, total chats:', updated.length);
      
      // Immediately save to localStorage with the updated state
      setTimeout(() => {
        saveToStorageImmediate(updated, currentChatId);
      }, 0);
      
      return updated;
    });
  }, [currentChatId, saveToStorageImmediate]);

  // Update message in current chat (for streaming)
  const updateMessage = useCallback((messageId: string, content: string) => {
    if (!currentChatId) return;

    setChats((prev) => {
      const updated = prev.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === messageId ? { ...msg, content } : msg
            ),
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
      
      // Save immediately after streaming updates (but throttled)
      setTimeout(() => {
        saveToStorageImmediate(updated, currentChatId);
      }, 700);
      
      return updated;
    });
  }, [currentChatId, saveToStorageImmediate]);

  // Rename chat
  const renameChat = useCallback((chatId: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, title: newTitle.trim() || "Untitled Chat", updatedAt: Date.now() }
          : chat
      )
    );
  }, []);

  // Delete chat
  const deleteChat = useCallback((chatId: string) => {
    setChats((prev) => {
      const updated = prev.filter((chat) => chat.id !== chatId);
      // If we deleted the current chat, switch to the first available chat or create new
      if (chatId === currentChatId) {
        if (updated.length > 0) {
          setCurrentChatId(updated[0].id);
        } else {
          setCurrentChatId(null);
        }
      }
      return updated;
    });
  }, [currentChatId]);

  // Get current chat
  const getCurrentChat = useCallback(() => {
    return chats.find((chat) => chat.id === currentChatId);
  }, [chats, currentChatId]);

  // Get current chat messages
  const getCurrentMessages = useCallback(() => {
    const currentChat = getCurrentChat();
    const messages = currentChat?.messages || [];
    console.log('getCurrentMessages: Chat', currentChatId, 'found:', !!currentChat, 'messages:', messages.length);
    if (currentChat) {
      console.log('getCurrentMessages: Chat details:', { id: currentChat.id, title: currentChat.title, messageCount: messages.length });
    }
    return messages;
  }, [getCurrentChat, currentChatId]);

  // Control streaming state for localStorage optimization
  const setStreamingState = useCallback((streaming: boolean) => {
    setIsStreaming(streaming);
  }, []);

  // Ensure there's always a current chat when needed
  const ensureCurrentChat = useCallback(() => {
    if (!currentChatId && !isLoading) {
      return createNewChat();
    }
    return currentChatId;
  }, [currentChatId, isLoading, createNewChat]);

  return {
    chats,
    currentChatId,
    isLoading,
    createNewChat,
    switchToChat,
    addMessage,
    updateMessage,
    renameChat,
    deleteChat,
    getCurrentChat,
    getCurrentMessages,
    setStreamingState,
    ensureCurrentChat,
  };
}
