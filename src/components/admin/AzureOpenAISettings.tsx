
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAzureOpenAI } from "@/contexts/AzureOpenAIContext";
import { useToast } from "@/components/ui/use-toast";
import { CircleCheck, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const azureOpenAISchema = z.object({
  apiKey: z.string().min(1, { message: "API Key is required" }),
  endpoint: z.string().url({ message: "Must be a valid URL" }),
  deploymentName: z.string().min(1, { message: "Deployment Name is required" }),
  apiVersion: z.string().min(1, { message: "API Version is required" })
});

export const AzureOpenAISettings = () => {
  const { toast } = useToast();
  const { settings: azureSettings, updateSettings: updateAzureSettings } = useAzureOpenAI();

  const azureOpenAIForm = useForm<z.infer<typeof azureOpenAISchema>>({
    resolver: zodResolver(azureOpenAISchema),
    defaultValues: {
      apiKey: azureSettings.apiKey || "",
      endpoint: azureSettings.endpoint || "https://tday-m9y8tx1o-eastus2.openai.azure.com/",
      deploymentName: azureSettings.deploymentName || "o4-mini",
      apiVersion: azureSettings.apiVersion || "2025-01-01-preview"
    }
  });

  const handleSubmitAzureOpenAI = (values: z.infer<typeof azureOpenAISchema>) => {
    console.log("Azure OpenAI Settings:", values);
    
    // Update Azure OpenAI settings in context with required fields
    updateAzureSettings({
      apiKey: values.apiKey,
      endpoint: values.endpoint,
      deploymentName: values.deploymentName,
      apiVersion: values.apiVersion
    });
    
    toast({
      title: "Settings saved",
      description: "Azure OpenAI settings have been saved successfully.",
      duration: 3000
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Azure OpenAI Configuration</CardTitle>
        <CardDescription>
          Configure your Azure OpenAI settings for AI-powered features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...azureOpenAIForm}>
          <form onSubmit={azureOpenAIForm.handleSubmit(handleSubmitAzureOpenAI)} className="space-y-4">
            <FormField
              control={azureOpenAIForm.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your Azure OpenAI API key" {...field} />
                  </FormControl>
                  <FormDescription>Your Azure OpenAI API key from the Azure portal</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={azureOpenAIForm.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-resource.openai.azure.com" {...field} />
                  </FormControl>
                  <FormDescription>The endpoint URL for your Azure OpenAI resource</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={azureOpenAIForm.control}
              name="deploymentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deployment Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your deployment name" {...field} />
                  </FormControl>
                  <FormDescription>The name of your model deployment</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={azureOpenAIForm.control}
              name="apiVersion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Version</FormLabel>
                  <FormControl>
                    <Input placeholder="2025-01-01-preview" {...field} />
                  </FormControl>
                  <FormDescription>The Azure OpenAI API version to use</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-nexus-500 hover:bg-nexus-600">
              <Save className="mr-2 h-4 w-4" /> 
              Save Azure OpenAI Settings
            </Button>

            {azureSettings.isConfigured && (
              <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md mt-2">
                <CircleCheck className="h-5 w-5" />
                <span>Azure OpenAI is configured and ready to use</span>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
