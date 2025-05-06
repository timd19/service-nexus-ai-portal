
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
          Get help and insights about your services from our AI assistant
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
                Powered by Azure OpenAI
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
                    <span>Service management insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-nexus-500"></div>
                    <span>Infrastructure recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-nexus-500"></div>
                    <span>Troubleshooting assistance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-nexus-500"></div>
                    <span>Client communication drafts</span>
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
                  Summarize the health of all services
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 font-normal">
                  Draft an update email for client X
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 font-normal">
                  Generate documentation for service Y
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 font-normal">
                  Explain the latest service outage
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
                  This is a mock UI. In a real implementation, you'll need to:
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-5 mt-2 space-y-1">
                  <li>Configure a .env file with Azure OpenAI credentials</li>
                  <li>Connect the FastAPI backend to Azure OpenAI service</li>
                  <li>Implement secure API endpoints</li>
                </ul>
                <Button className="w-full mt-3 bg-nexus-500 hover:bg-nexus-600">
                  <FileCode className="mr-2 h-4 w-4" />
                  View Implementation Docs
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
