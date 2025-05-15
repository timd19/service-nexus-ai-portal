import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { FC } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  contextSource?: string;
}

const ChatMessage: FC<ChatMessageProps> = ({ id, type, content, timestamp, contextSource }) => {
  return (
    <div
      key={id}
      className={cn(
        "flex w-max max-w-[80%] rounded-lg p-4",
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
      <div>
        {type === "ai" ? (
          <ReactMarkdown className="prose dark:prose-invert max-w-none">
            {content}
          </ReactMarkdown>
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
        <Avatar className="h-8 w-8 ml-3 flex-shrink-0">
          <AvatarImage src="" />
          <AvatarFallback className="bg-white text-nexus-600">
            <User size={16} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
