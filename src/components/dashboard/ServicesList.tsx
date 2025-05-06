
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for services
const services = [
  {
    id: 1,
    name: "Cloud Infrastructure Management",
    client: "Acme Corp",
    status: "active",
    health: "healthy",
    lastUpdated: "2025-05-05T10:30:00",
  },
  {
    id: 2,
    name: "Data Analytics Platform",
    client: "TechSolutions Inc.",
    status: "active",
    health: "warning",
    lastUpdated: "2025-05-04T14:45:00",
  },
  {
    id: 3,
    name: "Security Monitoring",
    client: "Global Services LLC",
    status: "maintenance",
    health: "healthy",
    lastUpdated: "2025-05-03T09:15:00",
  },
  {
    id: 4,
    name: "Database Migration",
    client: "Innovate Systems",
    status: "planning",
    health: "inactive",
    lastUpdated: "2025-05-01T16:20:00",
  },
  {
    id: 5,
    name: "Network Infrastructure",
    client: "MegaCorp Industries",
    status: "active",
    health: "critical",
    lastUpdated: "2025-05-06T08:10:00",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

const ServicesList = () => {
  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Active Services</h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">
                  <Link
                    to={`/services/${service.id}`}
                    className="text-nexus-600 hover:text-nexus-800 hover:underline"
                  >
                    {service.name}
                  </Link>
                </TableCell>
                <TableCell>{service.client}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      service.status === "active" && "bg-green-50 text-green-700 border-green-200",
                      service.status === "maintenance" && "bg-amber-50 text-amber-700 border-amber-200",
                      service.status === "planning" && "bg-blue-50 text-blue-700 border-blue-200"
                    )}
                  >
                    {service.status === "active" && "Active"}
                    {service.status === "maintenance" && "Maintenance"}
                    {service.status === "planning" && "Planning"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {service.health === "healthy" && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                    )}
                    {service.health === "warning" && (
                      <Clock className="h-4 w-4 text-amber-500 mr-1" />
                    )}
                    {service.health === "critical" && (
                      <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={cn(
                        "capitalize",
                        service.health === "healthy" && "text-green-600",
                        service.health === "warning" && "text-amber-500",
                        service.health === "critical" && "text-red-600"
                      )}
                    >
                      {service.health}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(service.lastUpdated)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ServicesList;
