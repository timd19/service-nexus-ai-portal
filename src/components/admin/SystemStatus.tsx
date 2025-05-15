
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Monitor, RotateCcw } from "lucide-react";
import { useAzureOpenAI } from "@/contexts/AzureOpenAIContext";
import { IntegrationStatus } from "@/types/chatTypes";
import { checkAzureOpenAIHealth } from "@/services/azureOpenAIService";

export const SystemStatus = () => {
  const { settings } = useAzureOpenAI();
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus[]>([
    {
      name: "Azure OpenAI",
      status: "unknown",
      lastChecked: new Date(),
      message: "Status not checked yet"
    }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check the status of all integrations
  const checkIntegrationStatus = async () => {
    setIsRefreshing(true);
    
    try {
      // Check Azure OpenAI status
      const azureStatus = await checkAzureOpenAIHealth(settings);
      
      setIntegrationStatus([
        {
          name: "Azure OpenAI",
          status: azureStatus.status,
          lastChecked: new Date(),
          message: azureStatus.message
        }
      ]);
    } catch (error) {
      console.error("Error checking integration status:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Check integration status on component mount and when settings change
  useEffect(() => {
    checkIntegrationStatus();
  }, [settings]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>System Status</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkIntegrationStatus} 
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RotateCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Checking..." : "Refresh Status"}
          </Button>
        </CardTitle>
        <CardDescription>
          Connection status of system integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrationStatus.map((integration) => (
            <div 
              key={integration.name} 
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full
                  ${integration.status === 'healthy' ? 'bg-green-100 text-green-600' : 
                   integration.status === 'error' ? 'bg-red-100 text-red-600' : 
                   integration.status === 'warning' ? 'bg-amber-100 text-amber-600' : 
                   'bg-gray-100 text-gray-600'}`}
                >
                  {integration.status === 'healthy' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : integration.status === 'error' ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <Monitor className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-gray-500">
                    {integration.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    Last checked: {integration.lastChecked.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium
                ${integration.status === 'healthy' ? 'bg-green-100 text-green-600' : 
                 integration.status === 'error' ? 'bg-red-100 text-red-600' : 
                 integration.status === 'warning' ? 'bg-amber-100 text-amber-600' : 
                 'bg-gray-100 text-gray-600'}`}
              >
                {integration.status === 'healthy' ? 'Healthy' : 
                 integration.status === 'error' ? 'Error' : 
                 integration.status === 'warning' ? 'Warning' : 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
