
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Bot, SendIcon, User } from "lucide-react";
import { useState } from "react";

type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
};

// Mock messages for demonstration
const initialMessages: Message[] = [
  {
    id: "1",
    type: "ai",
    content: "Hello! I'm your AI assistant. How can I help you manage your services today?",
    timestamp: new Date(),
  },
];

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
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

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `I understand you're asking about "${input}". This is a simulated response. In a real implementation, I would connect to Azure OpenAI to provide a helpful answer.`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
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
          Powered by Azure OpenAI. Your conversations may be stored for service improvement.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
