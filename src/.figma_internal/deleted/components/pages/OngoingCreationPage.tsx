import React, { useState } from "react";
import { useRouter } from "react-router-dom";
import { Clock, FileText, Truck, CheckCircle, AlertCircle, User, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface OngoingCreationPageProps {
  isDashboardDarkMode: boolean;
}

interface CreationProject {
  id: string;
  title: string;
  client: string;
  clientAvatar?: string;
  type: "artwork" | "design" | "concept" | "product";
  status: "in-progress" | "review" | "revision" | "completed";
  progress: number;
  deadline: string;
  budget: number;
  description: string;
  lastUpdate: string;
}

interface CreationRequest {
  id: string;
  title: string;
  client: string;
  clientAvatar?: string;
  type: "artwork" | "design" | "concept" | "product";
  budget: number;
  deadline: string;
  description: string;
  status: "pending" | "accepted" | "declined";
  requestDate: string;
}

interface DeliveryItem {
  id: string;
  title: string;
  client: string;
  clientAvatar?: string;
  type: "artwork" | "design" | "concept" | "product";
  deliveryDate: string;
  status: "preparing" | "shipped" | "delivered" | "confirmed";
  trackingNumber?: string;
  value: number;
}

const mockInProgressProjects: CreationProject[] = [
  {
    id: "1",
    title: "Brand Identity Design",
    client: "TechFlow Inc.",
    type: "design",
    status: "in-progress",
    progress: 65,
    deadline: "2024-12-25",
    budget: 2500,
    description: "Complete brand identity including logo, color palette, and style guide",
    lastUpdate: "2 hours ago"
  },
  {
    id: "2",
    title: "Digital Artwork Commission",
    client: "Sarah Martinez",
    type: "artwork",
    status: "review",
    progress: 90,
    deadline: "2024-12-20",
    budget: 800,
    description: "Fantasy landscape digital painting for book cover",
    lastUpdate: "1 day ago"
  },
  {
    id: "3",
    title: "Product Concept Development",
    client: "Innovation Labs",
    type: "concept",
    status: "revision",
    progress: 45,
    deadline: "2024-12-30",
    budget: 3200,
    description: "Mobile app UI/UX design and prototype",
    lastUpdate: "3 hours ago"
  }
];

const mockRequests: CreationRequest[] = [
  {
    id: "1",
    title: "Logo Design for Startup",
    client: "NextGen Solutions",
    type: "design",
    budget: 1200,
    deadline: "2025-01-15",
    description: "Modern, minimalist logo for AI startup company",
    status: "pending",
    requestDate: "2024-12-10"
  },
  {
    id: "2",
    title: "Custom Portrait Commission",
    client: "Michael Chen",
    type: "artwork",
    budget: 600,
    deadline: "2025-01-20",
    description: "Digital portrait for anniversary gift",
    status: "pending",
    requestDate: "2024-12-09"
  }
];

const mockDeliveries: DeliveryItem[] = [
  {
    id: "1",
    title: "Website Mockups",
    client: "E-Commerce Plus",
    type: "design",
    deliveryDate: "2024-12-15",
    status: "delivered",
    trackingNumber: "TRK123456789",
    value: 1800
  },
  {
    id: "2",
    title: "Character Design Set",
    client: "Game Studios Ltd",
    type: "artwork",
    deliveryDate: "2024-12-12",
    status: "confirmed",
    value: 2200
  }
];

export function OngoingCreationPage({ isDashboardDarkMode }: OngoingCreationPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("in-progress");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "in-progress": { variant: "default" as const, icon: Clock, color: "#FF8D28" },
      "review": { variant: "secondary" as const, icon: FileText, color: "#3B82F6" },
      "revision": { variant: "destructive" as const, icon: AlertCircle, color: "#EF4444" },
      "completed": { variant: "default" as const, icon: CheckCircle, color: "#10B981" },
      "pending": { variant: "outline" as const, icon: Clock, color: "#6B7280" },
      "accepted": { variant: "default" as const, icon: CheckCircle, color: "#10B981" },
      "declined": { variant: "destructive" as const, icon: AlertCircle, color: "#EF4444" },
      "preparing": { variant: "outline" as const, icon: Clock, color: "#6B7280" },
      "shipped": { variant: "secondary" as const, icon: Truck, color: "#3B82F6" },
      "delivered": { variant: "default" as const, icon: CheckCircle, color: "#10B981" },
      "confirmed": { variant: "default" as const, icon: CheckCircle, color: "#10B981" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      artwork: "🎨",
      design: "✏️",
      concept: "💡",
      product: "📦"
    };
    return icons[type as keyof typeof icons] || "📄";
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className={`font-title text-3xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
          Ongoing Creation
        </h1>
        <p className={`mt-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Track active projects, requests, and deliveries in progress
        </p>
      </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="in-progress" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              In Progress ({mockInProgressProjects.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Requests ({mockRequests.length})
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Delivery ({mockDeliveries.length})
            </TabsTrigger>
          </TabsList>

          {/* In Progress Tab */}
          <TabsContent value="in-progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {mockInProgressProjects.map((project) => (
                <Card key={project.id} className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <CardHeader className="pb-3 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-lg">{getTypeIcon(project.type)}</div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className={`text-base mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"} truncate`}>
                            {project.title}
                          </CardTitle>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <User className="w-3 h-3 text-gray-500" />
                              <span className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"} truncate`}>
                                {project.client}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <DollarSign className="w-3 h-3 text-green-500" />
                              <span className="text-green-500 font-medium">
                                ${project.budget.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="w-3 h-3 text-orange-500" />
                              <span className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Due {new Date(project.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        {getStatusBadge(project.status)}
                        <span className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {project.lastUpdate}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Progress
                        </span>
                        <span className={`font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          {project.progress}%
                        </span>
                      </div>
                      <div className={`w-full bg-gray-200 rounded-full h-1.5 ${isDashboardDarkMode ? "bg-gray-700" : ""}`}>
                        <div 
                          className="bg-[#FF8D28] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-1 pt-1">
                        <Button size="sm" className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white text-xs px-2 py-1 h-7 flex-1">
                          Update
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs px-2 py-1 h-7 flex-1"
                          onClick={() => router.push(`/dashboard/ongoing-creation/${project.id}`)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {mockRequests.map((request) => (
                <Card key={request.id} className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} max-w-sm`}>
                  <CardHeader className="pb-3 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-lg">{getTypeIcon(request.type)}</div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className={`text-base mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"} truncate`}>
                            {request.title}
                          </CardTitle>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <User className="w-3 h-3 text-gray-500" />
                              <span className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"} truncate`}>
                                {request.client}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <DollarSign className="w-3 h-3 text-green-500" />
                              <span className="text-green-500 font-medium">
                                ${request.budget.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="w-3 h-3 text-orange-500" />
                              <span className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Due {new Date(request.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className={`text-xs mt-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"} line-clamp-2`}>
                            {request.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        {getStatusBadge(request.status)}
                        <span className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {new Date(request.requestDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-4">
                    <div className="grid grid-cols-2 gap-1">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-7">
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive" className="text-xs px-2 py-1 h-7">
                        Decline
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs px-2 py-1 h-7"
                        onClick={() => router.push(`/dashboard/ongoing-creation/${request.id}`)}
                      >
                        Details
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {mockDeliveries.map((delivery) => (
                <Card key={delivery.id} className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} max-w-sm`}>
                  <CardHeader className="pb-3 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-lg">{getTypeIcon(delivery.type)}</div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className={`text-base mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"} truncate`}>
                            {delivery.title}
                          </CardTitle>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <User className="w-3 h-3 text-gray-500" />
                              <span className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"} truncate`}>
                                {delivery.client}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <DollarSign className="w-3 h-3 text-green-500" />
                              <span className="text-green-500 font-medium">
                                ${delivery.value.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="w-3 h-3 text-blue-500" />
                              <span className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {new Date(delivery.deliveryDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {delivery.trackingNumber && (
                            <p className={`text-xs mt-1 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                              <span className="font-mono text-blue-500">{delivery.trackingNumber}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        {getStatusBadge(delivery.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-4">
                    <div className="flex flex-col gap-1">
                      <div className="grid grid-cols-2 gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs px-2 py-1 h-7"
                          onClick={() => router.push(`/dashboard/ongoing-creation/${delivery.id}`)}
                        >
                          Details
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                          Download
                        </Button>
                      </div>
                      {delivery.status === "delivered" && (
                        <Button size="sm" className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white text-xs px-2 py-1 h-7 mt-1">
                          Request Confirmation
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}

