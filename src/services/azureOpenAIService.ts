
import { ChatMessage } from "@/types/chatTypes";
import { AzureOpenAISettings } from "@/contexts/AzureOpenAIContext";

export const callAzureOpenAI = async (messages: ChatMessage[], settings: AzureOpenAISettings): Promise<string> => {
  // This is a mock implementation for the UI demo
  // In a real implementation, you would call the Azure OpenAI API
  
  console.log("Calling Azure OpenAI with settings:", settings);
  console.log("Messages:", messages);
  
  // Wait for 1-2 seconds to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // For demo purposes, return a mock response
  const lastMessage = messages[messages.length - 1];
  
  if (!settings.isConfigured || !settings.apiKey || !settings.endpoint || !settings.deploymentName) {
    throw new Error("Azure OpenAI is not configured properly");
  }
  
  // Return different responses based on the type of message
  if (lastMessage.content.toLowerCase().includes("hello") || lastMessage.content.toLowerCase().includes("hi")) {
    return "Hello! I'm your AI assistant powered by Azure OpenAI. How can I help you today?";
  } else if (lastMessage.content.toLowerCase().includes("service") || lastMessage.content.toLowerCase().includes("management")) {
    return "I can help you with service management questions. Would you like information about monitoring, deployment, or maintenance?";
  } else if (lastMessage.content.toLowerCase().includes("generate")) {
    if (messages[0].role === "system" && messages[0].content.includes("JSON")) {
      return `{
        "title": "Automated Cloud Security Audit Service",
        "description": "A continuous security monitoring service that automatically audits client cloud environments, identifies vulnerabilities, and provides remediation recommendations.",
        "category": "Security"
      }`;
    } else {
      return "Here's some generated content for your document: \n\n## Security Best Practices\n\n1. Implement multi-factor authentication\n2. Use principle of least privilege\n3. Regular security audits\n4. Encrypt sensitive data\n5. Maintain security patches";
    }
  } else {
    return "I understand your message. Is there something specific about service management I can help you with? I can provide information on best practices, troubleshooting, or implementation strategies.";
  }
};
