
import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

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
  
  const handleGenerateIdea = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a prompt to generate ideas",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call the Azure OpenAI API
      // For now, we're simulating a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newIdea: Idea = {
        id: ideas.length + 1,
        title: `AI-Generated Idea for: ${prompt.substring(0, 30)}...`,
        description: `This would be an AI-generated idea based on prompt: "${prompt}". In a real implementation, this would use Azure OpenAI to generate creative ideas for new services or improvements.`,
        category: "AI Generated",
        createdAt: new Date()
      };
      
      setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
      setPrompt("");
      
      toast({
        title: "Idea generated successfully!",
        description: "A new service idea has been added to your collection.",
      });
    } catch (error) {
      toast({
        title: "Error generating idea",
        description: "There was an error connecting to the AI service. Please try again later.",
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
