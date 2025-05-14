
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, GitBranch, LayoutDashboard } from "lucide-react";
import { AzureOpenAISettings } from "@/components/admin/AzureOpenAISettings";
import { ServiceNowSettings } from "@/components/admin/ServiceNowSettings";
import { GitHubSettings } from "@/components/admin/GitHubSettings";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("azure-openai");

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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
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
      </Tabs>
    </div>
  );
};

export default AdminPage;
