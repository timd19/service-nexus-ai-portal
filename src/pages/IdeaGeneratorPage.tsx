import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAzureOpenAI } from "@/contexts/AzureOpenAIContext";
import { callAzureOpenAI } from "@/services/azureOpenAIService";

interface Idea {
  id: number;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
}

const IdeaGeneratorPage = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: 1,
      title: "Cloud Cost Optimization Service",
      description: "A managed service that continuously analyzes client cloud infrastructure to identify cost-saving opportunities without compromising performance.",
      category: "Managed Service",
      createdAt: new Date(2025, 4, 1)
    },
    {
      id: 2,
      title: "Zero Trust Security Implementation",
      description: "A comprehensive service package for implementing zero trust architecture for organizations transitioning from traditional perimeter-based security models.",
      category: "Security",
      createdAt: new Date(2025, 4, 3)
    }
  ]);
  const { toast } = useToast();
  const { settings } = useAzureOpenAI();
  
  const handleGenerateIdea = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a prompt to generate ideas",
        variant: "destructive"
      });
      return;
    }
    
    if (!settings.isConfigured) {
      toast({
        title: "Azure OpenAI not configured",
        description: "Please configure Azure OpenAI settings in the Admin page",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const messages = [
        {
          role: "system",
          content: "You are a creative AI assistant for Service Nexus, focused on generating managed service business ideas. Format your response in JSON format with title (string), description (string), and category (string) fields only, without any other text."
        },
        {
          role: "user",
          content: `Generate a new managed service business idea based on this prompt: ${prompt}`
        }
      ];
      
      const response = await callAzureOpenAI(messages, settings);
      
      // Parse the JSON response
      let ideaData;
      try {
        // Extract JSON if the response includes other text
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : response;
        ideaData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        // Create a fallback idea if parsing fails
        ideaData = {
          title: `AI-Generated Idea from: ${prompt.substring(0, 30)}...`,
          description: response,
          category: "AI Generated"
        };
      }
      
      const newIdea: Idea = {
        id: Date.now(),
        title: ideaData.title || `New idea from: ${prompt.substring(0, 30)}...`,
        description: ideaData.description || response,
        category: ideaData.category || "AI Generated",
        createdAt: new Date()
      };
      
      setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
      setPrompt("");
      
      toast({
        title: "Idea generated successfully!",
        description: "A new service idea has been added to your collection.",
      });
    } catch (error) {
      console.error("Error generating idea:", error);
      toast({
        title: "Error generating idea",
        description: "There was an error connecting to the AI service. Please check your Azure OpenAI configuration.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Idea Generator</h1>
        <p className="text-muted-foreground">
          Generate new service ideas using AI to expand your business offerings
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-nexus-500" />
            Generate New Service Ideas
          </CardTitle>
          <CardDescription>
            Describe the type of service you're looking to develop or problems you want to solve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="E.g., We need a service to help small businesses with cybersecurity that's affordable and scalable..."
            className="min-h-[120px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerateIdea} 
            disabled={isGenerating || !prompt.trim()}
            className="bg-nexus-500 hover:bg-nexus-600"
          >
            {isGenerating ? "Generating..." : "Generate Ideas"}
          </Button>
          {!settings.isConfigured && (
            <p className="ml-3 text-amber-600 text-sm">
              Azure OpenAI not configured. Please set up in Admin settings.
            </p>
          )}
        </CardFooter>
      </Card>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Ideas Collection</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ideas.map((idea) => (
            <Card key={idea.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{idea.title}</CardTitle>
                  <Badge variant="outline">{idea.category}</Badge>
                </div>
                <CardDescription>
                  {new Date(idea.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{idea.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Archive</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeaGeneratorPage;
