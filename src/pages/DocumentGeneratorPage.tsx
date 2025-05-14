import { useState } from "react";
import { FileText, Send, Plus, Save, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { useAzureOpenAI } from "@/contexts/AzureOpenAIContext";
import { callAzureOpenAI } from "@/services/azureOpenAIService";

interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  suggestions?: string;
}

const DocumentGeneratorPage = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      title: "Cloud Security Best Practices",
      content: "# Cloud Security Best Practices\n\nThis document outlines the best practices for securing cloud infrastructure...\n\n## Access Control\n\n- Implement least privilege access\n- Use multi-factor authentication\n- Regular access reviews\n\n## Network Security\n\n- Implement proper network segmentation\n- Use VPC endpoints where possible\n- Monitor network traffic",
      createdAt: new Date(2025, 4, 2),
      updatedAt: new Date(2025, 4, 2)
    }
  ]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const { toast } = useToast();
  const { settings } = useAzureOpenAI();
  
  const handleNewDocument = () => {
    const newDoc: Document = {
      id: documents.length + 1,
      title: newTitle || "Untitled Document",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setDocuments(prev => [...prev, newDoc]);
    setActiveDocument(newDoc);
    setNewTitle("");
    
    toast({
      title: "Document created",
      description: "Your new document has been created successfully."
    });
  };
  
  const handleSaveDocument = () => {
    if (!activeDocument) return;
    
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === activeDocument.id 
            ? { ...activeDocument, updatedAt: new Date() } 
            : doc
        )
      );
      
      setIsSaving(false);
      
      toast({
        title: "Document saved",
        description: "Your document has been saved successfully."
      });
    }, 800);
  };
  
  const handleSendPrompt = async () => {
    if (!prompt.trim() || !activeDocument) return;
    
    if (!settings.isConfigured) {
      toast({
        title: "Azure OpenAI not configured",
        description: "Please configure Azure OpenAI settings in the Admin page",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const messages = [
        {
          role: "system",
          content: "You are a professional technical writer AI assistant. Generate well-structured content based on the user's prompt that can be added to their document."
        },
        {
          role: "user",
          content: `Document title: ${activeDocument.title}\n\nCurrent document content: ${activeDocument.content}\n\nI need you to generate additional content for this document based on this prompt: ${prompt}`
        }
      ];
      
      const aiResponse = await callAzureOpenAI(messages, settings);
      
      const updatedContent = activeDocument.content + "\n\n" + aiResponse;
      
      setActiveDocument({
        ...activeDocument,
        content: updatedContent,
        updatedAt: new Date()
      });
      
      setPrompt("");
      
      toast({
        title: "Content generated",
        description: "AI has added content to your document based on your prompt."
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error generating content",
        description: "There was an error connecting to the AI service. Please check your Azure OpenAI configuration.",
        variant: "destructive"
      });
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim() || !activeDocument) return;
    
    if (!settings.isConfigured) {
      toast({
        title: "Azure OpenAI not configured",
        description: "Please configure Azure OpenAI settings in the Admin page",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatMessage,
      sender: "user",
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage("");
    setIsChatLoading(true);

    try {
      const messages = [
        {
          role: "system",
          content: "You are a professional technical documentation assistant. Analyze the user's document and their question, then provide helpful suggestions for improving the document. Format your response in two parts: 1) A conversational response addressing their question, and 2) A markdown formatted list of specific suggestions to improve the document that can be directly added to the document."
        },
        {
          role: "user",
          content: `Document title: ${activeDocument.title}\n\nCurrent document content: ${activeDocument.content}\n\nUser message: ${chatMessage}`
        }
      ];
      
      const response = await callAzureOpenAI(messages, settings);
      
      // Try to extract suggestions part from the response
      let conversationalPart = response;
      let suggestionsPart = null;
      
      // Look for markdown section dividers or suggestion headers
      const suggestionsPattern = /(?:##\s*Suggestions|###\s*Suggestions|Suggested Improvements|Here are my suggestions:|SUGGESTIONS:)([\s\S]*)/i;
      const match = response.match(suggestionsPattern);
      
      if (match && match[1]) {
        conversationalPart = response.substring(0, match.index).trim();
        suggestionsPart = `# Suggested Improvements for ${activeDocument.title}\n\n${match[1].trim()}`;
      }
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: conversationalPart || response,
        sender: "ai",
        timestamp: new Date(),
        suggestions: suggestionsPart || `# Suggested Improvements for ${activeDocument.title}\n\n${response}`
      };

      setChatMessages(prev => [...prev, aiResponse]);
      setActiveSuggestion(aiResponse.suggestions || null);
      
    } catch (error) {
      console.error("Error in document chat:", error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting to the AI service. Please check your Azure OpenAI configuration in the Admin settings.",
        sender: "ai",
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAddSuggestions = () => {
    if (!activeDocument || !activeSuggestion) return;

    const updatedContent = activeDocument.content + "\n\n" + activeSuggestion;
    
    setActiveDocument({
      ...activeDocument,
      content: updatedContent,
      updatedAt: new Date()
    });

    setActiveSuggestion(null);
    
    toast({
      title: "Suggestions added",
      description: "AI suggestions have been added to your document."
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Document Generator</h1>
        <p className="text-muted-foreground">
          Create and modify service documents with AI assistance
        </p>
      </div>
      
      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Document Editor</TabsTrigger>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-4">
          {!activeDocument ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Document</CardTitle>
                <CardDescription>Start by creating a new document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Document Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Button 
                    onClick={handleNewDocument}
                    className="bg-nexus-500 hover:bg-nexus-600 whitespace-nowrap"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create
                  </Button>
                </div>
                
                {documents.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-2">Or select an existing document:</h3>
                      <div className="grid gap-2">
                        {documents.map((doc) => (
                          <Button 
                            key={doc.id} 
                            variant="outline" 
                            className="justify-start text-left"
                            onClick={() => setActiveDocument(doc)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {doc.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{activeDocument.title}</h2>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveDocument(null)}
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={handleSaveDocument} 
                      disabled={isSaving}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  className="min-h-[500px] font-mono text-sm"
                  value={activeDocument.content}
                  onChange={(e) => setActiveDocument({...activeDocument, content: e.target.value})}
                  placeholder="Start writing your document content here..."
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">AI Assistant</CardTitle>
                    <CardDescription>
                      Ask the AI to help you with your document
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="E.g., Write a section about network security best practices..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      <Button 
                        onClick={handleSendPrompt}
                        disabled={!prompt.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md">
                        <div className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat About Document
                        </div>
                      </CardTitle>
                      {activeSuggestion && (
                        <Button 
                          size="sm" 
                          onClick={handleAddSuggestions}
                          className="bg-nexus-500 hover:bg-nexus-600"
                        >
                          Add Suggestions
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      Discuss your document with AI to get feedback and suggestions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ScrollArea className="flex-1 h-[400px]">
                      <div className="space-y-4 pr-4">
                        {chatMessages.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No messages yet. Start a conversation about the document.</p>
                          </div>
                        ) : (
                          chatMessages.map((message) => (
                            <div
                              key={message.id}
                              className={cn(
                                "flex w-full items-start gap-2.5",
                                message.sender === "user" && "flex-row-reverse"
                              )}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback className={message.sender === "ai" ? "bg-nexus-100" : "bg-gray-100"}>
                                  {message.sender === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={cn(
                                  "rounded-lg p-3 max-w-[80%]",
                                  message.sender === "user"
                                    ? "bg-nexus-500 text-white"
                                    : "bg-gray-100"
                                )}
                              >
                                <p className="text-sm">{message.content}</p>
                                {message.suggestions && (
                                  <div className="mt-2 p-2 bg-white/80 rounded border text-xs font-mono overflow-auto max-h-[200px]">
                                    <p className="font-medium mb-1">Suggestions Preview:</p>
                                    <pre className="whitespace-pre-wrap text-xs">{message.suggestions.substring(0, 100)}...</pre>
                                  </div>
                                )}
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                        {isChatLoading && (
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-nexus-100">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-2 flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
                              <div className="h-2 w-2 rounded-full bg-nexus-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="h-2 w-2 rounded-full bg-nexus-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="h-2 w-2 rounded-full bg-nexus-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    <div className="mt-4 flex items-center gap-2 pt-4 border-t">
                      <Input
                        placeholder="Ask about this document..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChatMessage();
                          }
                        }}
                        disabled={isChatLoading}
                      />
                      <Button
                        size="icon"
                        onClick={handleSendChatMessage}
                        disabled={!chatMessage.trim() || isChatLoading}
                        className="bg-nexus-500 hover:bg-nexus-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="grid gap-4 md:grid-cols-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveDocument(doc)}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {doc.title}
                  </CardTitle>
                  <CardDescription>
                    Last updated: {doc.updatedAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doc.content.substring(0, 100)}...
                  </p>
                </CardContent>
              </Card>
            ))}
            
            <Card className="flex items-center justify-center p-6 border-dashed cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setActiveDocument(null)}>
              <div className="text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground font-medium">Create New Document</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentGeneratorPage;
