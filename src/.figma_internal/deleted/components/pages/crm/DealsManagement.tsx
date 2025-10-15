import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { AdminHeader } from "../../shared/AdminHeader";
import {
  Handshake,
  Search,
  Plus,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Edit,
} from "lucide-react";

interface DealsManagementProps {
  isDashboardDarkMode?: boolean;
}

export const DealsManagement: React.FC<DealsManagementProps> = ({
  isDashboardDarkMode = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");

  const deals = [
    {
      id: 1,
      title: "Creative Studio Website Redesign",
      client: "Creative Studio Inc.",
      value: 12500,
      probability: 85,
      stage: "negotiation",
      closeDate: "2024-12-15",
      lastActivity: "2 days ago",
      contact: "Sarah Johnson",
      description: "Complete website redesign with new branding and portfolio showcase",
      priority: "high",
    },
    {
      id: 2,
      title: "Digital Marketing Campaign",
      client: "Digital Arts Agency",
      value: 8200,
      probability: 65,
      stage: "proposal",
      closeDate: "2024-12-20",
      lastActivity: "1 week ago",
      contact: "Michael Chen",
      description: "6-month digital marketing campaign for art gallery promotion",
      priority: "medium",
    },
    {
      id: 3,
      title: "Photography Exhibition Setup",
      client: "Rodriguez Photography",
      value: 15750,
      probability: 95,
      stage: "closed-won",
      closeDate: "2024-11-30",
      lastActivity: "Yesterday",
      contact: "Emma Rodriguez",
      description: "Complete setup and curation for photography exhibition",
      priority: "high",
    },
    {
      id: 4,
      title: "Gallery Management System",
      client: "Modern Gallery",
      value: 22000,
      probability: 40,
      stage: "discovery",
      closeDate: "2025-01-15",
      lastActivity: "3 weeks ago",
      contact: "David Wilson",
      description: "Custom gallery management and inventory tracking system",
      priority: "low",
    },
    {
      id: 5,
      title: "Art Collective Branding",
      client: "Artisan Collective",
      value: 9800,
      probability: 30,
      stage: "closed-lost",
      closeDate: "2024-11-20",
      lastActivity: "1 month ago",
      contact: "Lisa Thompson",
      description: "Complete rebranding package for art collective",
      priority: "medium",
    },
    {
      id: 6,
      title: "Virtual Gallery Platform",
      client: "Future Arts Inc.",
      value: 35000,
      probability: 70,
      stage: "proposal",
      closeDate: "2025-02-01",
      lastActivity: "3 days ago",
      contact: "Alex Morgan",
      description: "Development of virtual reality gallery platform",
      priority: "high",
    },
  ];

  const stages = [
    { key: "discovery", label: "Discovery", color: "bg-blue-100 text-blue-700" },
    { key: "qualification", label: "Qualification", color: "bg-indigo-100 text-indigo-700" },
    { key: "proposal", label: "Proposal", color: "bg-yellow-100 text-yellow-700" },
    { key: "negotiation", label: "Negotiation", color: "bg-orange-100 text-orange-700" },
    { key: "closed-won", label: "Won", color: "bg-green-100 text-green-700" },
    { key: "closed-lost", label: "Lost", color: "bg-red-100 text-red-700" },
  ];

  const getStageInfo = (stage: string) => {
    return stages.find(s => s.key === stage) || stages[0];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === "all" || deal.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(deal => deal.stage === 'closed-won');
  const activeDeals = deals.filter(deal => !deal.stage.startsWith('closed'));
  const avgDealSize = totalValue / deals.length;

  const handleAddDeal = () => {
    console.log('Add deal clicked');
  };

  return (
    <div className={`p-6 ${isDashboardDarkMode ? "bg-[#171717] text-white" : "bg-gray-50 text-gray-900"}`}>
      <AdminHeader
        title="Deals & Opportunities"
        description="Track and manage your sales pipeline"
        createButtonText="Add Deal"
        onCreateClick={handleAddDeal}
        createButtonIcon={<Plus className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Total Pipeline
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              ${totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Active Deals
            </CardTitle>
            <Handshake className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {activeDeals.length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Won This Month
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {wonDeals.length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Avg Deal Size
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              ${Math.round(avgDealSize).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className={`mb-6 ${isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF8D28] focus:border-transparent ${
                  isDashboardDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF8D28] focus:border-transparent ${
                  isDashboardDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Stages</option>
                {stages.map(stage => (
                  <option key={stage.key} value={stage.key}>{stage.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDeals.map((deal) => (
          <Card key={deal.id} className={`${isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"} hover:shadow-lg transition-shadow`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className={`text-lg font-title mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    {deal.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="secondary"
                      className={getStageInfo(deal.stage).color}
                    >
                      {getStageInfo(deal.stage).label}
                    </Badge>
                    {getPriorityIcon(deal.priority)}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Deal Value */}
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${isDashboardDarkMode ? "text-green-400" : "text-green-600"}`}>
                    ${deal.value.toLocaleString()}
                  </span>
                  <span className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {deal.probability}% probability
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>Progress</span>
                    <span className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>{deal.probability}%</span>
                  </div>
                  <Progress value={deal.probability} className="h-2" />
                </div>

                {/* Client Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {deal.client}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Close: {new Date(deal.closeDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"} line-clamp-2`}>
                  {deal.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Last activity: {deal.lastActivity}
                  </span>
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

