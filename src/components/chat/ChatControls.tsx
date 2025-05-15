
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock, Plus, Save } from "lucide-react";
import { FC } from "react";

interface ChatControlsProps {
  createNewChat: () => void;
  newChatTitle: string;
  setNewChatTitle: (value: string) => void;
  saveCurrentChat: () => void;
  toggleHistory: () => void;
  showHistory: boolean;
}

const ChatControls: FC<ChatControlsProps> = ({
  createNewChat,
  newChatTitle,
  setNewChatTitle,
  saveCurrentChat,
  toggleHistory,
  showHistory,
}) => {
  return (
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
              <Button
                onClick={saveCurrentChat}
                disabled={!newChatTitle.trim()}
                className="w-full"
              >
                Save
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="ghost" size="sm" onClick={toggleHistory}>
        <Clock className="h-4 w-4 mr-1" /> Chat History
      </Button>
    </div>
  );
};

export default ChatControls;
