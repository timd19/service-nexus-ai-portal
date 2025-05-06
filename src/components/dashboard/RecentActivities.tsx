
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CheckCircle2, FileEdit, Lock, Package, Trash, UserPlus, Wrench } from "lucide-react";

// Mock data for activities
const activities = [
  {
    id: 1,
    type: "service_updated",
    user: {
      name: "Alex Johnson",
      avatar: "",
      initials: "AJ",
    },
    service: "Cloud Infrastructure Management",
    time: "30 minutes ago",
  },
  {
    id: 2,
    type: "maintenance_scheduled",
    user: {
      name: "Sarah Miller",
      avatar: "",
      initials: "SM",
    },
    service: "Data Analytics Platform",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "user_added",
    user: {
      name: "Chris Wong",
      avatar: "",
      initials: "CW",
    },
    service: "Security Monitoring",
    time: "Yesterday",
  },
  {
    id: 4,
    type: "service_deleted",
    user: {
      name: "Emma Thompson",
      avatar: "",
      initials: "ET",
    },
    service: "Legacy App Support",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "security_update",
    user: {
      name: "Mark Davis",
      avatar: "",
      initials: "MD",
    },
    service: "Network Infrastructure",
    time: "2 days ago",
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "service_updated":
      return <FileEdit className="h-4 w-4" />;
    case "maintenance_scheduled":
      return <Wrench className="h-4 w-4" />;
    case "user_added":
      return <UserPlus className="h-4 w-4" />;
    case "service_deleted":
      return <Trash className="h-4 w-4" />;
    case "service_created":
      return <Package className="h-4 w-4" />;
    case "security_update":
      return <Lock className="h-4 w-4" />;
    default:
      return <CheckCircle2 className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "service_updated":
      return "bg-blue-100 text-blue-600";
    case "maintenance_scheduled":
      return "bg-amber-100 text-amber-600";
    case "user_added":
      return "bg-green-100 text-green-600";
    case "service_deleted":
      return "bg-red-100 text-red-600";
    case "service_created":
      return "bg-purple-100 text-purple-600";
    case "security_update":
      return "bg-indigo-100 text-indigo-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getActivityText = (type: string) => {
  switch (type) {
    case "service_updated":
      return "updated";
    case "maintenance_scheduled":
      return "scheduled maintenance for";
    case "user_added":
      return "added to";
    case "service_deleted":
      return "deleted";
    case "service_created":
      return "created";
    case "security_update":
      return "applied security update to";
    default:
      return "modified";
  }
};

const RecentActivities = () => {
  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Recent Activities</h2>
      </div>

      <div className="p-4">
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={cn("p-2 rounded-full mr-4", getActivityColor(activity.type))}>
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{activity.user.name}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {getActivityText(activity.type)}{" "}
                  <span className="font-medium text-gray-900">{activity.service}</span>
                </p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
