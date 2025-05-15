
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDebugLogs, clearDebugLogs } from "@/services/azureOpenAIService";

export const DebugConsole = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Function to refresh logs
  const refreshLogs = () => {
    setLogs(getDebugLogs());
  };

  // Clear all logs
  const handleClearLogs = () => {
    clearDebugLogs();
    refreshLogs();
  };

  // Auto refresh logs every 2 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    refreshLogs();
    const interval = setInterval(refreshLogs, 2000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Debug Console</span>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? "Pause" : "Resume"} Auto-refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshLogs}
            >
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearLogs}
            >
              Clear
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          System logs for Azure OpenAI API and other integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] rounded border bg-slate-950 p-4 text-sm text-slate-50 font-mono">
          {logs.length === 0 ? (
            <div className="text-gray-400 italic">No logs available</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1 whitespace-pre-wrap break-all">
                {log}
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DebugConsole;
