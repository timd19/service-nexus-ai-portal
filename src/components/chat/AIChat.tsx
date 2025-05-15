import { useState } from "react";
import { useAzureOpenAI } from "@/contexts/AzureOpenAIContext";
import { callAzureOpenAI, addDebugLog } from "@/services/azureOpenAIService";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage as ChatMessageType } from "@/types/chatTypes";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatHistory from "./ChatHistory";
import ChatControls from "./ChatControls";
import { useChatSessions, Message } from "@/hooks/useChatSessions";

const AIChat = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useAzureOpenAI();
  const { toast } = useToast();
  
  const {
    messages,
    setMessages,
    chatSessions,
    activeChatId,
    newChatTitle,
    setNewChatTitle,
    showHistory,
    setShowHistory,
    createNewChat,
    saveCurrentChat,
    switchChat,
    deleteChat,
    updateChatSessionWithMessages,
    currentChatTitle
  } = useChatSessions();

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
      addDebugLog("AIChat: Sending message", input);
      
      // Format messages for OpenAI API
      const apiMessages: ChatMessageType[] = [
        {
          role: "system",
          content: "You are a service management AI assistant for Service Nexus, helping with managed service offerings lifecycle and operations. You have access to all documents, ideas, projects, and services in the platform."
        },
        ...messages.map(msg => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
          timestamp: msg.timestamp,
          contextSource: msg.contextSource
        } as ChatMessageType)),
        {
          role: "user",
          content: input,
          timestamp: new Date()
        }
      ];

      const response = await callAzureOpenAI(apiMessages, settings);
      addDebugLog("AIChat: Received response", response);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response,
        timestamp: new Date(),
      };
      
      // Update messages state with properly typed messages
      setMessages((prev) => [...prev, aiMessage]);

      // Update chat sessions
      updateChatSessionWithMessages(userMessage, aiMessage);

    } catch (error) {
      addDebugLog("AIChat: Error in chat", error instanceof Error ? error.message : String(error));
      
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

  const toggleHistory = () => setShowHistory(!showHistory);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Controls */}
      <ChatControls 
        createNewChat={createNewChat}
        newChatTitle={newChatTitle}
        setNewChatTitle={setNewChatTitle}
        saveCurrentChat={saveCurrentChat}
        toggleHistory={toggleHistory}
        showHistory={showHistory}
      />
      
      {/* Chat History Sidebar */}
      {showHistory && (
        <ChatHistory
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          switchChat={switchChat}
          deleteChat={deleteChat}
          onClose={() => setShowHistory(false)}
        />
      )}
      
      {/* Current Chat Title */}
      <div className="px-4 py-2 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700">{currentChatTitle}</h3>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              id={message.id}
              type={message.type}
              content={message.content}
              timestamp={message.timestamp}
              contextSource={message.contextSource}
            />
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 w-max rounded-lg p-4">
              <div className="h-8 w-8 mr-3 flex-shrink-0 bg-nexus-100 text-nexus-600 rounded-full flex items-center justify-center">
                <span className="text-xs">AI</span>
              </div>
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
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        settings={settings}
      />
    </div>
  );
};

export default AIChat;

