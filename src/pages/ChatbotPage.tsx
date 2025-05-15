
import AIChat from "@/components/chat/AIChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileCode, Layers } from "lucide-react";

const ChatbotPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Get help and insights about everything across your platform from our AI assistant
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-nexus-500" />
                Service Nexus Assistant
              </CardTitle>
              <CardDescription>
                Powered by Azure OpenAI - Capable of cross-platform knowledge integration
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-5rem)]">
              <AIChat />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-nexus-500"></div>
                    <span>Cross-platform knowledge integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-nexus-500"></div>
                    <span>Save and load conversation history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-nexus-500"></div>
                    <span>Service management insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-nexus-500"></div>
                    <span>Infrastructure recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-nexus-500"></div>
                    <span>Documentation generation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Example Prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 font-normal">
                  Summarize insights from all my ideas
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 font-normal">
                  Draft a project proposal based on my docs
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 font-normal">
                  Find similar items across all my content
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 font-normal">
                  Generate an implementation plan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Layers className="h-5 w-5 text-nexus-500" />
                  <h3 className="font-medium">Implementation Note</h3>
                </div>
                <p className="text-sm text-gray-600">
                  This is a comprehensive AI assistant with cross-platform awareness. In a production environment, you should:
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-5 mt-2 space-y-1">
                  <li>Configure Azure OpenAI credentials</li>
                  <li>Implement document embedding for context</li>
                  <li>Set up proper RAG pipelines for knowledge retrieval</li>
                </ul>
                <Button className="w-full mt-3 bg-nexus-500 hover:bg-nexus-600">
                  <FileCode className="mr-2 h-4 w-4" />
                  View Configuration Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
