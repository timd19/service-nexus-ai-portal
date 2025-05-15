
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Bot, GitBranch, LayoutDashboard, Monitor } from "lucide-react";
import { AzureOpenAISettings } from "@/components/admin/AzureOpenAISettings";
import { ServiceNowSettings } from "@/components/admin/ServiceNowSettings";
import { GitHubSettings } from "@/components/admin/GitHubSettings";
import DebugConsole from "@/components/admin/DebugConsole";
import SystemStatus from "@/components/admin/SystemStatus";
import { addDebugLog } from "@/services/azureOpenAIService";
import { useAzureOpenAI } from "@/contexts/AzureOpenAIContext";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("azure-openai");
  const { settings } = useAzureOpenAI();

  // Log settings on page load for debugging
  useEffect(() => {
    addDebugLog("Admin page opened");
    addDebugLog("Azure OpenAI Settings", settings);
  }, [settings]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure integration settings for the application
          </p>
        </div>
      </div>

      <SystemStatus />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="azure-openai">
            <Bot className="mr-2 h-4 w-4" />
            Azure OpenAI
          </TabsTrigger>
          <TabsTrigger value="servicenow">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            ServiceNow
          </TabsTrigger>
          <TabsTrigger value="github">
            <GitBranch className="mr-2 h-4 w-4" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="debug">
            <Monitor className="mr-2 h-4 w-4" />
            Debug Console
          </TabsTrigger>
        </TabsList>

        <TabsContent value="azure-openai" className="space-y-4 mt-4">
          <AzureOpenAISettings />
        </TabsContent>

        <TabsContent value="servicenow" className="space-y-4 mt-4">
          <ServiceNowSettings />
        </TabsContent>

        <TabsContent value="github" className="space-y-4 mt-4">
          <GitHubSettings />
        </TabsContent>
        
        <TabsContent value="debug" className="space-y-4 mt-4">
          <DebugConsole />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
