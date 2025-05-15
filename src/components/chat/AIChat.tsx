
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bot, Clock, MessageSquare, Plus, Save, SendIcon, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAzureOpenAI } from "@/contexts/AzureOpenAIContext";
import { callAzureOpenAI } from "@/services/azureOpenAIService";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage, ChatSession } from "@/types/chatTypes";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  contextSource?: string;
};

// Initial welcome message
const initialMessages: Message[] = [
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

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(loadChatSessions);
  const [activeChatId, setActiveChatId] = useState<string>(chatSessions[0]?.id || "default");
  const [showHistory, setShowHistory] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const { settings } = useAzureOpenAI();
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
        type: m.role === "user" ? "user" : "ai",
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

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Format messages for OpenAI API
      const apiMessages: ChatMessage[] = [
        {
          role: "system",
          content: "You are a service management AI assistant for Service Nexus, helping with managed service offerings lifecycle and operations. You have access to all documents, ideas, projects, and services in the platform."
        },
        ...messages.map(msg => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
          timestamp: msg.timestamp,
          contextSource: msg.contextSource
        })),
        {
          role: "user",
          content: input,
          timestamp: new Date()
        }
      ];

      const response = await callAzureOpenAI(apiMessages, settings);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response,
        timestamp: new Date(),
      };
      
      // Update messages state
      const updatedMessages = [...messages, userMessage, aiMessage];
      setMessages(updatedMessages);

      // Update chat sessions
      setChatSessions(prev => prev.map(session => {
        if (session.id === activeChatId) {
          // Convert local messages to ChatMessage format for storage
          const sessionMessages: ChatMessage[] = updatedMessages.map(m => ({
            role: m.type === "user" ? "user" : "assistant",
            content: m.content,
            timestamp: m.timestamp,
            contextSource: m.contextSource
          }));

          return {
            ...session,
            lastMessage: input.slice(0, 50) + (input.length > 50 ? "..." : ""),
            timestamp: new Date(),
            messages: sessionMessages
          };
        }
        return session;
      }));

    } catch (error) {
      console.error("Error in AI chat:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from AI assistant. Check your Azure OpenAI configuration.",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I'm having trouble connecting to the AI service. Please check your Azure OpenAI configuration in the Admin settings.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get current chat title
  const currentChatTitle = chatSessions.find(s => s.id === activeChatId)?.title || "New Conversation";

  return (
    <div className="flex flex-col h-full">
      {/* Chat Controls */}
      <div className="border-b p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={createNewChat}>
            <Plus className="h-4 w-4 mr-1" /> New Chat
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-1" /> Save Chat
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Save current conversation</h4>
                <Input 
                  placeholder="Enter chat title" 
                  value={newChatTitle} 
                  onChange={(e) => setNewChatTitle(e.target.value)} 
                />
                <Button onClick={saveCurrentChat} disabled={!newChatTitle.trim()} className="w-full">
                  Save
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
          <Clock className="h-4 w-4 mr-1" /> Chat History
        </Button>
      </div>
      
      {/* Chat History Sidebar */}
      {showHistory && (
        <div className="border-r w-64 absolute right-0 top-32 bottom-0 bg-white shadow-lg z-10">
          <div className="p-3 border-b font-medium flex justify-between items-center">
            <span>Chat History</span>
            <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-3rem)]">
            <div className="p-2 space-y-2">
              {chatSessions.map(session => (
                <div 
                  key={session.id}
                  className={`p-2 rounded cursor-pointer flex justify-between ${session.id === activeChatId ? 'bg-nexus-100' : 'hover:bg-gray-100'}`}
                  onClick={() => switchChat(session.id)}
                >
                  <div className="overflow-hidden">
                    <div className="font-medium truncate">{session.title || "New Conversation"}</div>
                    <div className="text-xs text-gray-500 truncate">{session.lastMessage || "No messages yet"}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-50 hover:opacity-100"
                    onClick={(e) => deleteChat(session.id, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Current Chat Title */}
      <div className="px-4 py-2 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700">{currentChatTitle}</h3>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[80%] rounded-lg p-4",
                message.type === "user"
                  ? "ml-auto bg-nexus-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              )}
            >
              {message.type === "ai" && (
                <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-nexus-100 text-nexus-600">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <p>{message.content}</p>
                {message.contextSource && (
                  <div className="mt-2 text-xs opacity-70 bg-gray-200 p-1 rounded">
                    Source: {message.contextSource}
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {message.type === "user" && (
                <Avatar className="h-8 w-8 ml-3 flex-shrink-0">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-white text-nexus-600">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 w-max rounded-lg p-4">
              <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
                <AvatarFallback className="bg-nexus-100 text-nexus-600">
                  <Bot size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-nexus-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 rounded-full bg-nexus-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 rounded-full bg-nexus-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Ask something about your services..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
            className="bg-nexus-500 hover:bg-nexus-600"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {settings.isConfigured 
            ? "Powered by Azure OpenAI. Your conversations may be stored for service improvement." 
            : "Azure OpenAI not configured. Please set up in Admin settings."}
        </p>
      </div>
    </div>
  );
};

export default AIChat;
