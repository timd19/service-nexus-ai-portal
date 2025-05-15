
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import { FC, KeyboardEvent } from "react";
import { AzureOpenAISettings } from "@/contexts/AzureOpenAIContext";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  settings: AzureOpenAISettings;
}

const ChatInput: FC<ChatInputProps> = ({ 
  input, 
  setInput, 
  handleSendMessage, 
  isLoading,
  settings 
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
  );
};

export default ChatInput;
