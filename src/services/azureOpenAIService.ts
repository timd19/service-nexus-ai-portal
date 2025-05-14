
import { toast } from "@/components/ui/use-toast";

interface AzureOpenAISettings {
  apiKey: string;
  endpoint: string;
  deploymentName: string;
  apiVersion: string;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callAzureOpenAI(
  messages: ChatMessage[],
  settings: AzureOpenAISettings
): Promise<string> {
  try {
    if (!settings.apiKey || !settings.endpoint || !settings.deploymentName) {
      return "AI assistant is not configured. Please set up Azure OpenAI credentials in Admin Settings.";
    }

    // Format the endpoint URL
    const endpointUrl = `${settings.endpoint}/openai/deployments/${settings.deploymentName}/chat/completions?api-version=${settings.apiVersion}`;

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": settings.apiKey,
      },
      body: JSON.stringify({
        messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Azure OpenAI API error:", errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Azure OpenAI:", error);
    toast({
      title: "Error",
      description: `Failed to connect to Azure OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
    return `I encountered an error while connecting to Azure OpenAI. Please ensure your settings are correct in the Admin page.`;
  }
}
