import { ChatMessage } from "@/types/chatTypes";
import { AzureOpenAISettings } from "@/contexts/AzureOpenAIContext";

// Debug logs for Azure OpenAI service
let debugLogs: string[] = [];

// Function to add debug logs with timestamps
export const addDebugLog = (message: string, data?: any): void => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}${data ? ': ' + (typeof data === 'string' ? data : JSON.stringify(data, null, 2)) : ''}`;
  debugLogs.push(logEntry);
  console.log(logEntry);
  
  // Keep only the last 100 logs
  if (debugLogs.length > 100) {
    debugLogs = debugLogs.slice(-100);
  }
};

// Function to get all debug logs
export const getDebugLogs = (): string[] => {
  return [...debugLogs];
};

// Function to clear debug logs
export const clearDebugLogs = (): void => {
  debugLogs = [];
};

// New streaming function for Azure OpenAI
export const streamAzureOpenAI = async (
  messages: ChatMessage[], 
  settings: AzureOpenAISettings,
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    addDebugLog("Streaming from Azure OpenAI with settings", {
      endpoint: settings.endpoint,
      deploymentName: settings.deploymentName,
      apiVersion: settings.apiVersion,
      isConfigured: settings.isConfigured
    });
    
    // Check if Azure OpenAI is properly configured
    if (!settings.isConfigured || !settings.apiKey || !settings.endpoint || !settings.deploymentName) {
      addDebugLog("Azure OpenAI is not configured properly");
      throw new Error("Azure OpenAI is not configured properly");
    }
    
    // Format messages for the API
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Fix double slash issue in endpoint URL
    const baseEndpoint = settings.endpoint.endsWith('/') 
      ? settings.endpoint.slice(0, -1) 
      : settings.endpoint;
      
    const apiUrl = `${baseEndpoint}/openai/deployments/${settings.deploymentName}/chat/completions?api-version=${settings.apiVersion}`;
    
    addDebugLog("Making streaming API request to", apiUrl);
    
    // Make the API call with stream: true
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': settings.apiKey
      },
      body: JSON.stringify({
        messages: apiMessages,
        max_tokens: 4000, // Increase max tokens to handle longer responses
        temperature: 1,
        stream: true
      })
    });
    
    // Log response status
    addDebugLog("API response status", `${response.status} ${response.statusText}`);
    
    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.text();
      addDebugLog("Azure OpenAI API error", errorData);
      throw new Error(`Azure OpenAI API error: ${response.status} ${errorData}`);
    }
    
    // Process the stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }
    
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines in the buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.trim() === 'data: [DONE]') continue;
        
        try {
          // Remove 'data: ' prefix if present
          const jsonStr = line.startsWith('data: ') ? line.slice(6) : line;
          
          // Log the raw JSON string for debugging
          addDebugLog("Stream chunk JSON", jsonStr);
          
          // Parse the JSON
          const json = JSON.parse(jsonStr);
          
          // Extract content from the chunk - handle both delta.content and content formats
          let content = '';
          
          // New format: json.choices[0]?.delta?.content
          if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content !== undefined) {
            content = json.choices[0].delta.content;
          } 
          // Alternative format: json.choices[0]?.content
          else if (json.choices && json.choices[0] && json.choices[0].content !== undefined) {
            content = json.choices[0].content;
          }
          // Handle empty delta objects (they might be part of the stream but don't contain content)
          else if (json.choices && json.choices.length > 0 && Object.keys(json.choices[0].delta || {}).length === 0) {
            // This is likely a metadata chunk, not actual content
            addDebugLog("Received metadata chunk (no content)");
            continue;
          }
          
          if (content) {
            addDebugLog("Extracted content", content);
            onChunk(content);
          }
        } catch (e) {
          addDebugLog("Error parsing stream chunk", e);
          addDebugLog("Problematic line", line);
          // Continue processing other chunks even if one fails
        }
      }
    }
    
    // Process any remaining content in the buffer
    if (buffer.trim() !== '' && buffer.trim() !== 'data: [DONE]') {
      try {
        const jsonStr = buffer.startsWith('data: ') ? buffer.slice(6) : buffer;
        const json = JSON.parse(jsonStr);
        
        let content = '';
        if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content !== undefined) {
          content = json.choices[0].delta.content;
        } else if (json.choices && json.choices[0] && json.choices[0].content !== undefined) {
          content = json.choices[0].content;
        }
        
        if (content) {
          addDebugLog("Extracted final content from buffer", content);
          onChunk(content);
        }
      } catch (e) {
        addDebugLog("Error parsing final buffer chunk", e);
      }
    }
    
    // Ensure we finish the decoder
    const finalChunk = decoder.decode();
    if (finalChunk) {
      addDebugLog("Final decoder chunk", finalChunk);
    }
    
    addDebugLog("Stream completed");
    
  } catch (error) {
    // Log and rethrow the error
    addDebugLog("Error in streamAzureOpenAI", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Keep the original non-streaming function for compatibility
export const callAzureOpenAI = async (messages: ChatMessage[], settings: AzureOpenAISettings): Promise<string> => {
  try {
    // Log the call to Azure OpenAI
    addDebugLog("Calling Azure OpenAI with settings", {
      endpoint: settings.endpoint,
      deploymentName: settings.deploymentName,
      apiVersion: settings.apiVersion,
      isConfigured: settings.isConfigured
    });
    
    addDebugLog("Messages", messages);
    
    // Check if Azure OpenAI is properly configured
    if (!settings.isConfigured || !settings.apiKey || !settings.endpoint || !settings.deploymentName) {
      addDebugLog("Azure OpenAI is not configured properly");
      throw new Error("Azure OpenAI is not configured properly");
    }
    
    // Format messages for the API
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Fix double slash issue in endpoint URL
    const baseEndpoint = settings.endpoint.endsWith('/') 
      ? settings.endpoint.slice(0, -1) 
      : settings.endpoint;
      
    const apiUrl = `${baseEndpoint}/openai/deployments/${settings.deploymentName}/chat/completions?api-version=${settings.apiVersion}`;
    
    addDebugLog("Making API request to", apiUrl);
    
    // Make the actual API call to Azure OpenAI
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': settings.apiKey
      },
      body: JSON.stringify({
        messages: apiMessages,
        max_tokens: 4000, // Increase max tokens to handle longer responses
        temperature: 1
      })
    });
    
    // Log response status
    addDebugLog("API response status", `${response.status} ${response.statusText}`);
    
    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.text();
      addDebugLog("Azure OpenAI API error", errorData);
      throw new Error(`Azure OpenAI API error: ${response.status} ${errorData}`);
    }
    
    // Parse the response
    const data = await response.json();
    addDebugLog("Azure OpenAI response received", { responseStatus: response.status });
    
    // Extract the content from the response
    const content = data.choices[0].message.content;
    return content;
    
  } catch (error) {
    // Log and rethrow the error
    addDebugLog("Error in callAzureOpenAI", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Simple health check function to verify API connection
export const checkAzureOpenAIHealth = async (settings: AzureOpenAISettings): Promise<{ 
  status: 'healthy' | 'error',
  message: string 
}> => {
  try {
    addDebugLog("Checking Azure OpenAI health");
    
    if (!settings.isConfigured || !settings.apiKey || !settings.endpoint || !settings.deploymentName) {
      addDebugLog("Azure OpenAI is not configured");
      return { 
        status: 'error', 
        message: 'Azure OpenAI is not configured' 
      };
    }

    // Fix double slash issue in endpoint URL
    const baseEndpoint = settings.endpoint.endsWith('/') 
      ? settings.endpoint.slice(0, -1) 
      : settings.endpoint;
    
    const apiUrl = `${baseEndpoint}/openai/deployments?api-version=${settings.apiVersion}`;
    
    addDebugLog("Health check API request to", apiUrl);
    
    // Make a simple API call to check the connection
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'api-key': settings.apiKey
      }
    });
    
    addDebugLog("Health check response status", `${response.status} ${response.statusText}`);
    
    const responseBody = await response.text();
    addDebugLog("Health check response body", responseBody);
    
    if (!response.ok) {
      return { 
        status: 'error', 
        message: `Failed to connect: ${response.status} ${response.statusText}` 
      };
    }
    
    return { 
      status: 'healthy', 
      message: 'Connected to Azure OpenAI successfully' 
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    addDebugLog("Error in health check", errorMessage);
    return { 
      status: 'error', 
      message: `Error connecting to Azure OpenAI: ${errorMessage}` 
    };
  }
};

