
import RecentActivities from "@/components/dashboard/RecentActivities";
import ServicesList from "@/components/dashboard/ServicesList";
import StatusCard from "@/components/dashboard/StatusCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, Calendar, Package, Plus, Server, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Service Nexus Admin Portal
          </p>
        </div>
        <Button className="bg-nexus-500 hover:bg-nexus-600">
          <Plus className="mr-2 h-4 w-4" />
          New Service
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total Services"
          value="24"
          icon={Package}
          trend={8.2}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatusCard
          title="Active Clients"
          value="18"
          icon={UserPlus}
          trend={4.5}
          iconClassName="bg-green-100 text-green-600"
        />
        <StatusCard
          title="Infrastructure"
          value="92%"
          icon={Server}
          trend={-2.3}
          iconClassName="bg-amber-100 text-amber-600"
        />
        <StatusCard
          title="SLA Compliance"
          value="99.8%"
          icon={Calendar}
          iconClassName="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4">
          <ServicesList />
        </div>
        <div className="md:col-span-3">
          <RecentActivities />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="md:col-span-2 xl:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Analytics</h3>
              <Link to="/analytics">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-4 h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center text-gray-500">
                <BarChart3 className="h-10 w-10 mb-2" />
                <p>Analytics visualization will appear here</p>
                <p className="text-sm">Connect to your data sources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Backend System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <p className="font-medium">FastAPI Backend</p>
                </div>
                <span className="text-sm text-gray-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <p className="font-medium">PostgreSQL Database</p>
                </div>
                <span className="text-sm text-gray-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <p className="font-medium">PowerShell Universal</p>
                </div>
                <span className="text-sm text-gray-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                  <p className="font-medium">Azure OpenAI Integration</p>
                </div>
                <span className="text-sm text-gray-500">Needs Configuration</span>
              </div>
            </div>
            <div className="mt-6 pb-1">
              <p className="text-sm text-gray-500">
                Last checked: May 6, 2025, 10:32 AM
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
