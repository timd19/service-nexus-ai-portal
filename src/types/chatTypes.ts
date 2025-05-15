
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp?: Date;
  contextSource?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export interface IntegrationStatus {
  name: string;
  status: 'healthy' | 'error' | 'warning' | 'unknown';
  lastChecked: Date;
  message: string;
}
