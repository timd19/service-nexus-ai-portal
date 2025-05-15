
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSession } from "@/types/chatTypes";
import { X } from "lucide-react";
import { FC } from "react";

interface ChatHistoryProps {
  chatSessions: ChatSession[];
  activeChatId: string;
  switchChat: (sessionId: string) => void;
  deleteChat: (sessionId: string, e: React.MouseEvent) => void;
  onClose: () => void;
}

const ChatHistory: FC<ChatHistoryProps> = ({
  chatSessions,
  activeChatId,
  switchChat,
  deleteChat,
  onClose,
}) => {
  return (
    <div className="border-r w-64 absolute right-0 top-32 bottom-0 bg-white shadow-lg z-10">
      <div className="p-3 border-b font-medium flex justify-between items-center">
        <span>Chat History</span>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100%-3rem)]">
        <div className="p-2 space-y-2">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`p-2 rounded cursor-pointer flex justify-between ${
                session.id === activeChatId ? "bg-nexus-100" : "hover:bg-gray-100"
              }`}
              onClick={() => switchChat(session.id)}
            >
              <div className="overflow-hidden">
                <div className="font-medium truncate">
                  {session.title || "New Conversation"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {session.lastMessage || "No messages yet"}
                </div>
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
  );
};

export default ChatHistory;
