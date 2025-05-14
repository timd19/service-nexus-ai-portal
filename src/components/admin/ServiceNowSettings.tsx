
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const serviceNowSchema = z.object({
  instanceUrl: z.string().url({ message: "Must be a valid URL" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" })
});

export const ServiceNowSettings = () => {
  const { toast } = useToast();
  
  const serviceNowForm = useForm<z.infer<typeof serviceNowSchema>>({
    resolver: zodResolver(serviceNowSchema),
    defaultValues: {
      instanceUrl: "https://",
      username: "",
      password: ""
    }
  });

  const handleSubmitServiceNow = (values: z.infer<typeof serviceNowSchema>) => {
    console.log("ServiceNow Settings:", values);
    
    toast({
      title: "Settings saved",
      description: "ServiceNow settings have been saved successfully.",
      duration: 3000
    });
  };
  
  return (
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
  );
};
