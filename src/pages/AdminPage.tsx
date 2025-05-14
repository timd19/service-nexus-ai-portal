
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Settings, CircleCheck, Save, Bot, GitBranch, LayoutDashboard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAzureOpenAI } from "@/contexts/AzureOpenAIContext";
import { useToast } from "@/components/ui/use-toast";

const azureOpenAISchema = z.object({
  apiKey: z.string().min(1, { message: "API Key is required" }),
  endpoint: z.string().url({ message: "Must be a valid URL" }),
  deploymentName: z.string().min(1, { message: "Deployment Name is required" }),
  apiVersion: z.string().min(1, { message: "API Version is required" })
});

const serviceNowSchema = z.object({
  instanceUrl: z.string().url({ message: "Must be a valid URL" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" })
});

const githubSchema = z.object({
  accessToken: z.string().min(1, { message: "Access Token is required" }),
  owner: z.string().min(1, { message: "Owner is required" }),
  repository: z.string().min(1, { message: "Repository is required" })
});

const AdminPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("azure-openai");
  const { settings: azureSettings, updateSettings: updateAzureSettings } = useAzureOpenAI();

  const azureOpenAIForm = useForm<z.infer<typeof azureOpenAISchema>>({
    resolver: zodResolver(azureOpenAISchema),
    defaultValues: {
      apiKey: azureSettings.apiKey || "",
      endpoint: azureSettings.endpoint || "https://",
      deploymentName: azureSettings.deploymentName || "",
      apiVersion: azureSettings.apiVersion || "2023-05-15"
    }
  });

  const serviceNowForm = useForm<z.infer<typeof serviceNowSchema>>({
    resolver: zodResolver(serviceNowSchema),
    defaultValues: {
      instanceUrl: "https://",
      username: "",
      password: ""
    }
  });

  const githubForm = useForm<z.infer<typeof githubSchema>>({
    resolver: zodResolver(githubSchema),
    defaultValues: {
      accessToken: "",
      owner: "",
      repository: ""
    }
  });

  const handleSubmitAzureOpenAI = (values: z.infer<typeof azureOpenAISchema>) => {
    console.log("Azure OpenAI Settings:", values);
    
    // Update Azure OpenAI settings in context with required fields
    updateAzureSettings({
      ...values  // This already contains the required fields
    });
    
    toast({
      title: "Settings saved",
      description: "Azure OpenAI settings have been saved successfully.",
      duration: 3000
    });
  };

  const handleSubmitServiceNow = (values: z.infer<typeof serviceNowSchema>) => {
    console.log("ServiceNow Settings:", values);
    
    toast({
      title: "Settings saved",
      description: "ServiceNow settings have been saved successfully.",
      duration: 3000
    });
  };

  const handleSubmitGithub = (values: z.infer<typeof githubSchema>) => {
    console.log("GitHub Settings:", values);
    
    toast({
      title: "Settings saved",
      description: "GitHub settings have been saved successfully.",
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure integration settings for the application
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="azure-openai">
            <Bot className="mr-2 h-4 w-4" />
            Azure OpenAI
          </TabsTrigger>
          <TabsTrigger value="servicenow">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            ServiceNow
          </TabsTrigger>
          <TabsTrigger value="github">
            <GitBranch className="mr-2 h-4 w-4" />
            GitHub
          </TabsTrigger>
        </TabsList>

        <TabsContent value="azure-openai" className="space-y-4 mt-4">
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
                          <Input placeholder="2023-05-15" {...field} />
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
        </TabsContent>

        <TabsContent value="servicenow" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ServiceNow Integration</CardTitle>
              <CardDescription>
                Configure ServiceNow integration for service management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...serviceNowForm}>
                <form onSubmit={serviceNowForm.handleSubmit(handleSubmitServiceNow)} className="space-y-4">
                  <FormField
                    control={serviceNowForm.control}
                    name="instanceUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instance URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-instance.service-now.com" {...field} />
                        </FormControl>
                        <FormDescription>Your ServiceNow instance URL</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={serviceNowForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your ServiceNow username" {...field} />
                        </FormControl>
                        <FormDescription>ServiceNow username with appropriate permissions</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={serviceNowForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your ServiceNow password" {...field} />
                        </FormControl>
                        <FormDescription>Password for ServiceNow authentication</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="bg-nexus-500 hover:bg-nexus-600">
                    <Save className="mr-2 h-4 w-4" /> 
                    Save ServiceNow Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="github" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>GitHub Integration</CardTitle>
              <CardDescription>
                Configure GitHub integration for source control and deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...githubForm}>
                <form onSubmit={githubForm.handleSubmit(handleSubmitGithub)} className="space-y-4">
                  <FormField
                    control={githubForm.control}
                    name="accessToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Token</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your GitHub access token" {...field} />
                        </FormControl>
                        <FormDescription>Personal access token with appropriate permissions</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={githubForm.control}
                    name="owner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter GitHub username or organization" {...field} />
                        </FormControl>
                        <FormDescription>Username or organization name</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={githubForm.control}
                    name="repository"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repository</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter repository name" {...field} />
                        </FormControl>
                        <FormDescription>The name of the GitHub repository</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="bg-nexus-500 hover:bg-nexus-600">
                    <Save className="mr-2 h-4 w-4" /> 
                    Save GitHub Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
