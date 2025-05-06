
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  FileText, 
  Package, 
  ClipboardList,
  Clock,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CalendarEvent {
  id: number;
  title: string;
  type: 'service' | 'document' | 'activity' | 'project';
  date: Date;
  status?: string;
  description?: string;
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  
  const events: CalendarEvent[] = [
    {
      id: 1,
      title: "Cloud Cost Optimization Service Launch",
      type: 'service',
      date: new Date(2025, 4, 15),
      status: 'active',
      description: "Official launch of the Cloud Cost Optimization Service"
    },
    {
      id: 2,
      title: "Security Assessment Document Finalized",
      type: 'document',
      date: new Date(2025, 4, 10),
      description: "Final version of the Security Assessment methodology document"
    },
    {
      id: 3,
      title: "Zero Trust Implementation Kickoff",
      type: 'project',
      date: new Date(2025, 4, 20),
      status: 'planning',
      description: "Project kickoff for the Zero Trust Implementation service"
    },
    {
      id: 4,
      title: "Database Migration Service Update",
      type: 'activity',
      date: new Date(2025, 4, 5),
      description: "Major update to the Database Migration Service"
    }
  ];

  // Helper to get events for the selected date
  const getEventsForSelectedDate = () => {
    if (!date) return [];
    
    return events.filter(
      event => 
        event.date.getDate() === date.getDate() && 
        event.date.getMonth() === date.getMonth() && 
        event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Get highlighted dates for the calendar
  const getHighlightedDates = () => {
    return events.map(event => event.date);
  };
  
  // Helper to get icon based on event type
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'service':
        return <Package className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'project':
        return <ClipboardList className="h-4 w-4" />;
      case 'activity':
        return <Clock className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };
  
  // Helper to get badge color based on event type
  const getEventBadgeClass = (type: string) => {
    switch(type) {
      case 'service':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'document':
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      case 'project':
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case 'activity':
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  const selectedDateEvents = getEventsForSelectedDate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Calendar</h1>
          <p className="text-muted-foreground">
            Track all services, documents, and activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="month" onValueChange={(value) => setView(value as 'day' | 'week' | 'month')}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            Today
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-1">
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    highlight: getHighlightedDates()
                  }}
                  modifiersClassNames={{
                    highlight: "bg-nexus-100 text-nexus-800 font-bold"
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-nexus-500" />
                  {date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a date'}
                </CardTitle>
                <CardDescription>
                  {selectedDateEvents.length} events scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No events scheduled for this date
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateEvents.map(event => (
                      <div key={event.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getEventBadgeClass(event.type)}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                            {event.status && (
                              <Badge variant="outline">
                                {event.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Scheduled Events</CardTitle>
              <CardDescription>
                Complete list of all services, documents, and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.sort((a, b) => a.date.getTime() - b.date.getTime()).map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 border-b last:border-b-0">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {event.date.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground my-1">{event.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getEventBadgeClass(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                        {event.status && (
                          <Badge variant="outline">
                            {event.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarPage;
