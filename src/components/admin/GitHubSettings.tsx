
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const githubSchema = z.object({
  accessToken: z.string().min(1, { message: "Access Token is required" }),
  owner: z.string().min(1, { message: "Owner is required" }),
  repository: z.string().min(1, { message: "Repository is required" })
});

export const GitHubSettings = () => {
  const { toast } = useToast();
  
  const githubForm = useForm<z.infer<typeof githubSchema>>({
    resolver: zodResolver(githubSchema),
    defaultValues: {
      accessToken: "",
      owner: "",
      repository: ""
    }
  });

  const handleSubmitGithub = (values: z.infer<typeof githubSchema>) => {
    console.log("GitHub Settings:", values);
    
    toast({
      title: "Settings saved",
      description: "GitHub settings have been saved successfully.",
      duration: 3000
    });
  };
  
  return (
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
  );
};
