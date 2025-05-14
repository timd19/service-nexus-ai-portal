
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Bot, 
  Calendar, 
  ChevronRight, 
  ClipboardList, 
  Folder,
  FileText,
  History, 
  Home, 
  Layers, 
  Package, 
  Settings, 
  Users,
  Lightbulb
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const NavItem = ({ to, icon, label, end = false }: NavItemProps) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive 
        ? "bg-nexus-500 text-white" 
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    )}
  >
    <span className="flex-shrink-0 w-5 h-5">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

const SideNav = () => {
  return (
    <div className="w-64 border-r border-gray-200 h-screen flex flex-col bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="px-4 py-6">
        <div className="flex items-center gap-2">
          <Layers className="h-8 w-8 text-nexus-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Service Nexus</h1>
        </div>
      </div>
      
      <div className="px-3 py-2">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Core
        </div>
        <nav className="space-y-1">
          <NavItem to="/" icon={<Home size={18} />} label="Dashboard" end />
          <NavItem to="/services" icon={<Package size={18} />} label="Services" />
          <NavItem to="/projects" icon={<ClipboardList size={18} />} label="Projects" />
          <NavItem to="/clients" icon={<Users size={18} />} label="Clients" />
        </nav>
      </div>
      
      <div className="px-3 py-2 mt-6">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Creation Tools
        </div>
        <nav className="space-y-1">
          <NavItem to="/ideas" icon={<Lightbulb size={18} />} label="Idea Generator" />
          <NavItem to="/documents" icon={<FileText size={18} />} label="Document Generator" />
          <NavItem to="/chatbot" icon={<Bot size={18} />} label="AI Assistant" />
        </nav>
      </div>
      
      <div className="px-3 py-2 mt-6">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Management
        </div>
        <nav className="space-y-1">
          <NavItem to="/folder" icon={<Folder size={18} />} label="Documents" />
          <NavItem to="/calendar" icon={<Calendar size={18} />} label="Calendar" />
          <NavItem to="/analytics" icon={<BarChart3 size={18} />} label="Analytics" />
          <NavItem to="/history" icon={<History size={18} />} label="History" />
        </nav>
      </div>
      
      <div className="mt-auto px-3 py-4">
        <NavItem to="/admin" icon={<Settings size={18} />} label="Admin Settings" />
      </div>
      
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-nexus-100 flex items-center justify-center">
            <span className="text-nexus-500 font-medium">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">John Doe</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@example.com</p>
          </div>
          <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
