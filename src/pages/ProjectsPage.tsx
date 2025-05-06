
import { useState } from "react";
import { 
  ClipboardList, 
  ChevronDown, 
  Plus, 
  Search, 
  Filter,
  CheckSquare,
  Users,
  Calendar,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Project {
  id: number;
  name: string;
  description: string;
  status: "planning" | "active" | "completed" | "on-hold";
  progress: number;
  startDate: Date;
  endDate?: Date;
  lead: string;
  team: string[];
  client: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Cloud Cost Optimization Rollout",
    description: "Implementation of the Cloud Cost Optimization managed service for Enterprise clients",
    status: "active",
    progress: 65,
    startDate: new Date(2025, 3, 15),
    endDate: new Date(2025, 6, 30),
    lead: "Jane Smith",
    team: ["Alex Johnson", "Maria Garcia", "David Lee"],
    client: "Acme Corporation"
  },
  {
    id: 2,
    name: "Zero Trust Security Framework",
    description: "Development of a Zero Trust Security implementation framework for financial services",
    status: "planning",
    progress: 25,
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 9, 15),
    lead: "Michael Brown",
    team: ["Sarah Wilson", "James Moore"],
    client: "First National Bank"
  },
  {
    id: 3,
    name: "Database Migration Service",
    description: "Automated service for seamless database migrations across cloud providers",
    status: "completed",
    progress: 100,
    startDate: new Date(2024, 11, 10),
    endDate: new Date(2025, 3, 20),
    lead: "Robert Chen",
    team: ["Lisa Wong", "Kevin Patel", "Jennifer Davis"],
    client: "TechStart Inc."
  },
  {
    id: 4,
    name: "AI Operations Assistant",
    description: "Machine learning system for predictive IT operations and incident management",
    status: "on-hold",
    progress: 40,
    startDate: new Date(2025, 2, 5),
    lead: "Amanda Taylor",
    team: ["Chris Martin", "Sophia Rodriguez"],
    client: "Global Systems LLC"
  }
];

const ProjectsPage = () => {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "planning":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "on-hold":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const filteredProjects = projects.filter(
    project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {!selectedProject ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground">
                Manage and track all service development projects
              </p>
            </div>
            <Button className="bg-nexus-500 hover:bg-nexus-600">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Projects</DropdownMenuItem>
                <DropdownMenuItem>Active Projects</DropdownMenuItem>
                <DropdownMenuItem>Planning Phase</DropdownMenuItem>
                <DropdownMenuItem>Completed Projects</DropdownMenuItem>
                <DropdownMenuItem>On Hold</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Portfolio</CardTitle>
              <CardDescription>
                Complete list of all service development projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id} className="cursor-pointer" onClick={() => setSelectedProject(project)}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="w-[80px]" />
                          <span className="text-sm text-muted-foreground">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{project.lead}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(project.startDate).toLocaleDateString()} 
                          {project.endDate ? ` - ${new Date(project.endDate).toLocaleDateString()}` : ''}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Project Detail View */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">{selectedProject.name}</h1>
              <Badge className={getStatusColor(selectedProject.status)}>
                {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Edit Project</Button>
              <Button className="bg-nexus-500 hover:bg-nexus-600">Update Status</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-nexus-500" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{selectedProject.progress}%</div>
                  <Progress value={selectedProject.progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Project {selectedProject.status === 'completed' ? 'completed' : 'in progress'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-nexus-500" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Start Date</span>
                    <span>{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                  </div>
                  {selectedProject.endDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">End Date</span>
                      <span>{new Date(selectedProject.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Duration</span>
                    <span>
                      {selectedProject.endDate 
                        ? `${Math.ceil((selectedProject.endDate.getTime() - selectedProject.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
                        : 'Ongoing'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-nexus-500" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>{getInitials(selectedProject.lead)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedProject.lead}</p>
                      <p className="text-xs text-muted-foreground">Project Lead</p>
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <p className="text-sm font-medium mb-2">Team Members</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.team.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full pl-1 pr-2 py-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">{getInitials(member)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-nexus-500" />
                  Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Avatar className="h-12 w-12 mx-auto mb-2">
                    <AvatarFallback>{selectedProject.client.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium mb-1">{selectedProject.client}</p>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Client Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>
                    Detailed information about this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-muted-foreground">
                        {selectedProject.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Key Milestones</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p className="text-sm">Project Kickoff - {new Date(selectedProject.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p className="text-sm">Requirements Gathering - Completed</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                          <p className="text-sm">Development Phase - In Progress</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                          <p className="text-sm">Client Testing - Pending</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                          <p className="text-sm">Deployment - Pending</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Risks & Issues</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-red-50">High</Badge>
                          <div>
                            <p className="text-sm font-medium">Resource constraints due to parallel projects</p>
                            <p className="text-xs text-muted-foreground">Mitigation: Adjusting project timeline and reprioritizing tasks</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-amber-50">Medium</Badge>
                          <div>
                            <p className="text-sm font-medium">Integration with legacy systems</p>
                            <p className="text-xs text-muted-foreground">Mitigation: Additional testing phase added to project plan</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <ClipboardList className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Task Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Tasks and assignments will appear here
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Tasks
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Project Resources</h3>
                    <p className="text-muted-foreground mb-4">
                      Resource allocation and management will appear here
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Assign Resources
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Project Documents</h3>
                    <p className="text-muted-foreground mb-4">
                      Documents related to this project will appear here
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Project Activities</h3>
                    <p className="text-muted-foreground mb-4">
                      Timeline of activities and events will appear here
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Log Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
