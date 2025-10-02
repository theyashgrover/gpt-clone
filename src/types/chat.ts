export type ChatRole = "user" | "assistant" | "system";

export type FileAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  publicId: string; // Cloudinary public ID
  resourceType: "image" | "video" | "raw" | "auto";
};

export type Message = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  attachments?: FileAttachment[];
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

export type ChatHistory = {
  chats: Chat[];
  currentChatId: string | null;
  maxChats: number;
};
