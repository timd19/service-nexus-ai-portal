
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  className?: string;
  iconClassName?: string;
}

const StatusCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className, 
  iconClassName 
}: StatusCardProps) => {
  const isTrendPositive = trend && trend > 0;
  const isTrendNegative = trend && trend < 0;
  
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  isTrendPositive && "text-green-600",
                  isTrendNegative && "text-red-600",
                  !isTrendPositive && !isTrendNegative && "text-gray-500"
                )}
              >
                {isTrendPositive && "+"}
                {trend}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center",
          iconClassName || "bg-nexus-100 text-nexus-500"
        )}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
