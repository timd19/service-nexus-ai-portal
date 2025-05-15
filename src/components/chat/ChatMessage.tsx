import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bot, Edit, RefreshCw, Send, User } from "lucide-react";
import { FC, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  contextSource?: string;
  onResend?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
}

const ChatMessage: FC<ChatMessageProps> = ({ 
  id, 
  type, 
  content, 
  timestamp, 
  contextSource,
  onResend,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSaveEdit = () => {
    if (onEdit && editedContent.trim()) {
      onEdit(id, editedContent);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedContent(content);
    }
  };

  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] rounded-lg p-4 group relative",
        type === "user"
          ? "ml-auto bg-nexus-500 text-white"
          : "bg-gray-100 dark:bg-gray-800"
      )}
    >
      {type === "ai" && (
        <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
          <AvatarImage src="" />
          <AvatarFallback className="bg-nexus-100 text-nexus-600">
            <Bot size={16} />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="w-full">
        {type === "user" && isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-nexus-600 text-white border-nexus-400 focus-visible:ring-nexus-300"
            />
            <Button 
              size="icon" 
              className="h-8 w-8 bg-white text-nexus-600 hover:bg-gray-100"
              onClick={handleSaveEdit}
            >
              <Send size={14} />
            </Button>
          </div>
        ) : type === "ai" ? (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <p>{content}</p>
        )}
        {contextSource && (
          <div className="mt-2 text-xs opacity-70 bg-gray-200 p-1 rounded">
            Source: {contextSource}
          </div>
        )}
        <p className="text-xs opacity-70 mt-1">
          {timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      {type === "user" && (
        <>
          <Avatar className="h-8 w-8 ml-3 flex-shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-white text-nexus-600">
              <User size={16} />
            </AvatarFallback>
          </Avatar>
          
          {/* Message actions - only visible on hover */}
          {!isEditing && onResend && onEdit && (
            <div className="absolute -top-3 right-14 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 bg-white"
                onClick={() => setIsEditing(true)}
                title="Edit message"
              >
                <Edit size={12} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 bg-white"
                onClick={() => onResend && onResend(id)}
                title="Regenerate response"
              >
                <RefreshCw size={12} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatMessage;

