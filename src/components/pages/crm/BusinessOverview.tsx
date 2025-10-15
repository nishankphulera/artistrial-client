import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { AdminHeader } from "../../shared/AdminHeader";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  Target,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

interface BusinessOverviewProps {
  isDashboardDarkMode?: boolean;
}

export const BusinessOverview: React.FC<BusinessOverviewProps> = ({
  isDashboardDarkMode = false,
}) => {
  const stats = [
    {
      title: "Total Clients",
      value: "142",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Active Deals",
      value: "28",
      change: "+5",
      changeType: "positive",
      icon: Target,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Revenue This Month",
      value: "$24,500",
      change: "+18%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Conversion Rate",
      value: "32%",
      change: "+3%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "deal_won",
      title: "Deal closed with Creative Studio Inc.",
      amount: "$5,200",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "client_added",
      title: "New client: Maria Rodriguez",
      company: "Rodriguez Photography",
      time: "4 hours ago",
      status: "new",
    },
    {
      id: 3,
      type: "task_completed",
      title: "Follow-up call with Johnson Gallery",
      time: "6 hours ago",
      status: "completed",
    },
    {
      id: 4,
      type: "meeting_scheduled",
      title: "Discovery meeting with Artisan Collective",
      time: "1 day ago",
      status: "scheduled",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Send proposal to Digital Arts Agency",
      priority: "high",
      dueDate: "Today, 3:00 PM",
      client: "Digital Arts Agency",
    },
    {
      id: 2,
      title: "Follow up on contract with Modern Gallery",
      priority: "medium",
      dueDate: "Tomorrow, 10:00 AM",
      client: "Modern Gallery",
    },
    {
      id: 3,
      title: "Quarterly review with Top Creative Co.",
      priority: "low",
      dueDate: "Dec 15, 2024",
      client: "Top Creative Co.",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "deal_won":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "client_added":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "task_completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "meeting_scheduled":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleAddAction = () => {
    console.log('Add business action');
  };

  return (
    <div className={`p-6 ${isDashboardDarkMode ? "bg-[#171717] text-white" : "bg-gray-50 text-gray-900"}`}>
      <AdminHeader
        title="Business Overview"
        description="Monitor your business performance and manage client relationships"
        createButtonText="Analytics Report"
        onCreateClick={handleAddAction}
        createButtonIcon={<BarChart3 className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card 
            key={index}
            className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                {stat.value}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      {activity.title}
                    </p>
                    {activity.amount && (
                      <p className="text-sm font-semibold text-green-600 mt-1">
                        {activity.amount}
                      </p>
                    )}
                    {activity.company && (
                      <p className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {activity.company}
                      </p>
                    )}
                    <p className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              <Clock className="w-5 h-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={`text-sm font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                        {task.title}
                      </p>
                      <Badge 
                        variant="secondary"
                        className={`text-xs ml-2 ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                      Client: {task.client}
                    </p>
                    <p className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Due: {task.dueDate}
                    </p>
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

