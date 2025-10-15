import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { AdminHeader } from "../../shared/AdminHeader";
import {
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter,
  Target,
  Activity,
  Clock,
  CheckCircle,
} from "lucide-react";

interface BusinessReportsProps {
  isDashboardDarkMode?: boolean;
}

export const BusinessReports: React.FC<BusinessReportsProps> = ({
  isDashboardDarkMode = false,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock data for reports
  const salesData = [
    { month: "Jan", revenue: 15400, deals: 12, clients: 8 },
    { month: "Feb", revenue: 18200, deals: 15, clients: 11 },
    { month: "Mar", revenue: 22100, deals: 18, clients: 14 },
    { month: "Apr", revenue: 19800, deals: 16, clients: 12 },
    { month: "May", revenue: 24500, deals: 20, clients: 16 },
    { month: "Jun", revenue: 27300, deals: 22, clients: 18 },
  ];

  const clientSegments = [
    { segment: "Enterprise", count: 45, revenue: 125000, percentage: 45 },
    { segment: "Small Business", count: 67, revenue: 89000, percentage: 32 },
    { segment: "Startups", count: 23, revenue: 34000, percentage: 12 },
    { segment: "Individual", count: 31, revenue: 28000, percentage: 11 },
  ];

  const dealsPipeline = [
    { stage: "Discovery", count: 8, value: 45000 },
    { stage: "Qualification", count: 12, value: 67000 },
    { stage: "Proposal", count: 6, value: 89000 },
    { stage: "Negotiation", count: 4, value: 125000 },
    { stage: "Closed Won", count: 15, value: 234000 },
    { stage: "Closed Lost", count: 3, value: 23000 },
  ];

  const performanceMetrics = [
    {
      title: "Conversion Rate",
      value: "32%",
      change: "+5%",
      changeType: "positive",
      description: "Lead to client conversion",
      icon: Target,
    },
    {
      title: "Average Deal Size",
      value: "$18,500",
      change: "+12%",
      changeType: "positive",
      description: "Average revenue per deal",
      icon: DollarSign,
    },
    {
      title: "Sales Cycle",
      value: "45 days",
      change: "-8 days",
      changeType: "positive",
      description: "Average time to close",
      icon: Clock,
    },
    {
      title: "Client Retention",
      value: "89%",
      change: "+3%",
      changeType: "positive",
      description: "12-month retention rate",
      icon: Users,
    },
  ];

  const topClients = [
    { name: "Creative Studio Inc.", revenue: 45000, deals: 8, growth: 25 },
    { name: "Artisan Collective", revenue: 38500, deals: 6, growth: 18 },
    { name: "Digital Arts Agency", revenue: 32000, deals: 5, growth: -5 },
    { name: "Rodriguez Photography", revenue: 28900, deals: 4, growth: 32 },
    { name: "Modern Gallery", revenue: 25600, deals: 3, growth: 12 },
  ];

  const activitySummary = [
    { activity: "Calls Made", count: 156, target: 200, completion: 78 },
    { activity: "Emails Sent", count: 340, target: 300, completion: 113 },
    { activity: "Meetings Held", count: 45, target: 60, completion: 75 },
    { activity: "Proposals Sent", count: 23, target: 25, completion: 92 },
  ];

  const handleExportReport = () => {
    console.log('Export report clicked');
  };

  return (
    <div className={`p-6 ${isDashboardDarkMode ? "bg-[#171717] text-white" : "bg-gray-50 text-gray-900"}`}>
      <AdminHeader
        title="Business Reports"
        description="Analyze your business performance and sales metrics"
        createButtonText="Export Report"
        onCreateClick={handleExportReport}
        createButtonIcon={<Download className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
        additionalActions={
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        }
      />

      {/* Report Controls */}
      <Card className={`mb-6 ${isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF8D28] focus:border-transparent ${
                  isDashboardDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF8D28] focus:border-transparent ${
                  isDashboardDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="overview">Overview</option>
                <option value="sales">Sales Performance</option>
                <option value="clients">Client Analysis</option>
                <option value="pipeline">Pipeline Report</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {metric.title}
              </CardTitle>
              <metric.icon className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                {metric.value}
              </div>
              <div className="flex items-center gap-1">
                {metric.changeType === "positive" ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span className={`text-xs ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {metric.change}
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend Chart */}
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              <BarChart3 className="w-5 h-5" />
              Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 p-4">
              {salesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t flex flex-col justify-end h-48">
                    <div 
                      className="bg-[#FF8D28] rounded-t transition-all duration-500"
                      style={{ height: `${(data.revenue / 30000) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs mt-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {data.month}
                  </span>
                  <span className={`text-xs font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    ${(data.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Segments */}
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              <PieChart className="w-5 h-5" />
              Client Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientSegments.map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      {segment.segment}
                    </span>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                        {segment.count} clients
                      </div>
                      <div className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        ${segment.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#FF8D28] h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${segment.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              <Users className="w-5 h-5" />
              Top Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-[#FF8D28] text-white flex items-center justify-center text-sm font-bold`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className={`font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                        {client.name}
                      </p>
                      <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {client.deals} deals
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${isDashboardDarkMode ? "text-green-400" : "text-green-600"}`}>
                      ${client.revenue.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center ${
                      client.growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {client.growth >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(client.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              <Activity className="w-5 h-5" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitySummary.map((activity, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      {activity.activity}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {activity.count} / {activity.target}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          activity.completion >= 100 
                            ? "bg-green-100 text-green-700" 
                            : activity.completion >= 75 
                              ? "bg-yellow-100 text-yellow-700" 
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {activity.completion}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        activity.completion >= 100 
                          ? "bg-green-500" 
                          : activity.completion >= 75 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(activity.completion, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

