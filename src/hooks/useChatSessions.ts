import { useEffect, useState } from "react";
import { ChatMessage, ChatSession } from "@/types/chatTypes";
import { useToast } from "@/hooks/use-toast";

// Define Message type using the role values from ChatMessage
export type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  contextSource?: string;
};

// Initial welcome message
export const initialMessages: Message[] = [
  {
    id: "1",
    type: "ai",
    content: "Hello! I'm your AI assistant. How can I help you manage your services today?",
    timestamp: new Date(),
  },
];

// Load chat sessions from localStorage or use default
const loadChatSessions = (): ChatSession[] => {
  const saved = localStorage.getItem("chatSessions");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved chat sessions", e);
    }
  }
  // Default chat session
  return [{
    id: "default",
    title: "New Conversation",
    lastMessage: "Hello! I'm your AI assistant.",
    timestamp: new Date(),
    messages: []
  }];
};

export const useChatSessions = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(loadChatSessions);
  const [activeChatId, setActiveChatId] = useState<string>(chatSessions[0]?.id || "default");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Load messages for active chat session
  useEffect(() => {
    const activeSession = chatSessions.find(s => s.id === activeChatId);
    if (activeSession && activeSession.messages.length > 0) {
      // Convert session messages to the local Message format
      const loadedMessages = activeSession.messages.map(m => ({
        id: m.timestamp ? new Date(m.timestamp).getTime().toString() : Date.now().toString(),
        type: m.role === "user" ? "user" as const : "ai" as const,
        content: m.content,
        timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        contextSource: m.contextSource
      }));
      
      setMessages(loadedMessages.length > 0 ? loadedMessages : initialMessages);
    } else {
      setMessages(initialMessages);
    }
  }, [activeChatId, chatSessions]);
  
  // Create a new chat session
  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: "New Conversation",
      lastMessage: "",
      timestamp: new Date(),
      messages: []
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setActiveChatId(newId);
    setMessages(initialMessages);
  };

  // Save the current chat session
  const saveCurrentChat = () => {
    if (newChatTitle.trim()) {
      setChatSessions(prev => prev.map(session => 
        session.id === activeChatId 
          ? { ...session, title: newChatTitle } 
          : session
      ));
      setNewChatTitle("");
      toast({
        title: "Chat saved",
        description: `Chat "${newChatTitle}" has been saved.`
      });
    }
  };

  // Switch to a different chat session
  const switchChat = (sessionId: string) => {
    setActiveChatId(sessionId);
    setShowHistory(false);
  };

  // Delete a chat session
  const deleteChat = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (sessionId === activeChatId && chatSessions.length > 1) {
      // Switch to another chat if we're deleting the active one
      const newActiveId = chatSessions.find(s => s.id !== sessionId)?.id || "";
      setActiveChatId(newActiveId);
    }
  };
  
  // Update chat sessions with new messages
  const updateChatSessionWithMessages = (userMessage: Message, aiMessage: Message) => {
    setChatSessions(prev => prev.map(session => {
      if (session.id === activeChatId) {
        // Convert local messages to ChatMessage format for storage
        const updatedMessages = [...messages, userMessage, aiMessage];
        const sessionMessages: ChatMessage[] = updatedMessages.map(m => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.content,
          timestamp: m.timestamp,
          contextSource: m.contextSource
        }));

        return {
          ...session,
          lastMessage: userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? "..." : ""),
          timestamp: new Date(),
          messages: sessionMessages
        };
      }
      return session;
    }));
  };

  // Update chat sessions with current messages (for edits and resends)
  const updateChatSessionMessages = () => {
    setChatSessions(prev => prev.map(session => {
      if (session.id === activeChatId) {
        // Convert local messages to ChatMessage format for storage
        const sessionMessages: ChatMessage[] = messages.map(m => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.content,
          timestamp: m.timestamp,
          contextSource: m.contextSource
        }));

        // Get the last user message for the preview if available
        const lastUserMessage = [...messages].reverse().find(m => m.type === "user");
        const lastMessagePreview = lastUserMessage 
          ? lastUserMessage.content.slice(0, 50) + (lastUserMessage.content.length > 50 ? "..." : "")
          : "New conversation";

        return {
          ...session,
          lastMessage: lastMessagePreview,
          timestamp: new Date(),
          messages: sessionMessages
        };
      }
      return session;
    }));
  };

  // Update chat sessions whenever messages change
  useEffect(() => {
    if (messages.length > 1) { // Only update if we have more than just the initial message
      updateChatSessionMessages();
    }
  }, [messages]);

  return {
    chatSessions,
    activeChatId,
    messages,
    setMessages,
    newChatTitle,
    setNewChatTitle,
    showHistory,
    setShowHistory,
    createNewChat,
    saveCurrentChat,
    switchChat,
    deleteChat,
    updateChatSessionWithMessages,
    currentChatTitle: chatSessions.find(s => s.id === activeChatId)?.title || "New Conversation"
  };
};

