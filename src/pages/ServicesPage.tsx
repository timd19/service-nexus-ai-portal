
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Server, Shield, BarChart3, Database, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for services capabilities
const serviceCapabilities = [
  {
    id: "infrastructure",
    title: "Infrastructure Management",
    description: "Cloud infrastructure deployment, monitoring, and optimization services",
    features: [
      "Cloud platform integration (AWS, Azure, GCP)",
      "Infrastructure as Code (Terraform, CloudFormation)",
      "Containerization & Kubernetes orchestration",
      "High-availability architecture",
      "Automated scaling solutions",
      "Cost optimization strategies"
    ],
    icon: Server,
    color: "bg-blue-500"
  },
  {
    id: "security",
    title: "Security & Compliance",
    description: "Comprehensive security solutions and compliance management",
    features: [
      "Security posture assessment",
      "Vulnerability management",
      "Identity & access management",
      "Encryption implementation",
      "Compliance frameworks (SOC2, HIPAA, GDPR)",
      "Security monitoring & incident response"
    ],
    icon: Shield,
    color: "bg-green-500"
  },
  {
    id: "analytics",
    title: "Data Analytics",
    description: "Data processing, analytics, and visualization solutions",
    features: [
      "Data pipeline development",
      "BigData infrastructure setup",
      "Data warehousing solutions",
      "Business intelligence dashboards",
      "Predictive analytics models",
      "Real-time data processing"
    ],
    icon: BarChart3,
    color: "bg-purple-500"
  },
  {
    id: "database",
    title: "Database Management",
    description: "Database design, optimization, and maintenance services",
    features: [
      "Database architecture design",
      "Performance optimization",
      "Migration & upgrading",
      "High availability configuration",
      "Backup & disaster recovery",
      "Database security hardening"
    ],
    icon: Database,
    color: "bg-amber-500"
  }
];

// Mock data for launched services
const launchedServices = [
  {
    id: 1,
    name: "Cloud Infrastructure Management",
    client: "Acme Corp",
    description: "Complete AWS infrastructure management with auto-scaling and cost optimization",
    status: "active",
    health: "healthy",
    launchedDate: "2025-01-15",
    capabilities: ["infrastructure", "security"]
  },
  {
    id: 2,
    name: "Data Analytics Platform",
    client: "TechSolutions Inc.",
    description: "End-to-end data pipeline with real-time analytics dashboard",
    status: "active", 
    health: "warning",
    launchedDate: "2025-02-20",
    capabilities: ["analytics", "database"]
  },
  {
    id: 3,
    name: "Security Monitoring",
    client: "Global Services LLC",
    description: "24/7 security monitoring and incident response system",
    status: "maintenance",
    health: "healthy",
    launchedDate: "2025-03-10",
    capabilities: ["security"]
  },
  {
    id: 5,
    name: "Network Infrastructure",
    client: "MegaCorp Industries",
    description: "Enterprise network architecture with SD-WAN implementation",
    status: "active",
    health: "critical",
    launchedDate: "2025-04-05",
    capabilities: ["infrastructure"]
  }
];

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
};

const ServicesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage your service offerings and track launched services
          </p>
        </div>
        <Button className="bg-nexus-500 hover:bg-nexus-600">
          <Plus className="mr-2 h-4 w-4" />
          New Service
        </Button>
      </div>

      <Tabs defaultValue="capabilities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="capabilities">Service Capabilities</TabsTrigger>
          <TabsTrigger value="launched">Launched Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="capabilities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {serviceCapabilities.map((capability) => (
              <Card key={capability.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">
                    {capability.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${capability.color} text-white`}>
                    <capability.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {capability.description}
                  </p>
                  <div className="space-y-2">
                    {capability.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="launched" className="space-y-4">
          <div className="rounded-lg border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Service Name</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Client</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Capabilities</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Launch Date</th>
                  </tr>
                </thead>
                <tbody>
                  {launchedServices.map((service) => (
                    <tr key={service.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4">
                        <Link
                          to={`/services/${service.id}`}
                          className="text-nexus-600 hover:text-nexus-800 hover:underline font-medium"
                        >
                          {service.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                      </td>
                      <td className="p-4">{service.client}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {service.capabilities.map((capId) => {
                            const cap = serviceCapabilities.find(c => c.id === capId);
                            return cap ? (
                              <Badge 
                                key={capId}
                                variant="outline" 
                                className={`text-xs ${cap.id === 'infrastructure' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                           cap.id === 'security' ? 'bg-green-50 text-green-700 border-green-200' :
                                           cap.id === 'analytics' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                           'bg-amber-50 text-amber-700 border-amber-200'}`}
                              >
                                {cap.title}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`${
                            service.status === "active" && "bg-green-50 text-green-700 border-green-200",
                            service.status === "maintenance" && "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {service.status === "active" ? "Active" : "Maintenance"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span>{formatDate(service.launchedDate)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesPage;
