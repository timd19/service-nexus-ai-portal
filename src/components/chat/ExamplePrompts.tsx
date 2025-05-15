import { Button } from "@/components/ui/button";
import { FC } from "react";

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const examplePrompts = [
  "What services do you offer for cloud infrastructure?",
  "How can I optimize my AWS costs?",
  "Tell me about your managed security services",
  "What's included in your DevOps automation package?",
  "How do you handle incident response?"
];

const ExamplePrompts: FC<ExamplePromptsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="mb-4 px-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Try asking about:</h3>
      <div className="flex flex-wrap gap-2">
        {examplePrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;

