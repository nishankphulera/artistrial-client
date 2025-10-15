import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { AdminHeader } from "../../shared/AdminHeader";
import {
  CheckSquare,
  Search,
  Plus,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Phone,
  Mail,
  FileText,
  Video,
} from "lucide-react";

interface TasksManagementProps {
  isDashboardDarkMode?: boolean;
}

export const TasksManagement: React.FC<TasksManagementProps> = ({
  isDashboardDarkMode = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Send proposal to Creative Studio Inc.",
      description: "Prepare and send detailed project proposal for website redesign",
      client: "Creative Studio Inc.",
      contact: "Sarah Johnson",
      type: "proposal",
      priority: "high",
      status: "pending",
      dueDate: "2024-12-10",
      dueTime: "15:00",
      estimatedDuration: "2 hours",
      completed: false,
      createdDate: "2024-12-08",
    },
    {
      id: 2,
      title: "Follow-up call with Digital Arts Agency",
      description: "Schedule follow-up call to discuss marketing campaign details",
      client: "Digital Arts Agency",
      contact: "Michael Chen",
      type: "call",
      priority: "medium",
      status: "pending",
      dueDate: "2024-12-11",
      dueTime: "10:00",
      estimatedDuration: "1 hour",
      completed: false,
      createdDate: "2024-12-07",
    },
    {
      id: 3,
      title: "Contract review for Rodriguez Photography",
      description: "Review and finalize contract terms for photography exhibition setup",
      client: "Rodriguez Photography",
      contact: "Emma Rodriguez",
      type: "document",
      priority: "high",
      status: "completed",
      dueDate: "2024-12-09",
      dueTime: "12:00",
      estimatedDuration: "3 hours",
      completed: true,
      completedDate: "2024-12-08",
      createdDate: "2024-12-05",
    },
    {
      id: 4,
      title: "Quarterly review meeting with Modern Gallery",
      description: "Conduct quarterly business review and discuss upcoming projects",
      client: "Modern Gallery",
      contact: "David Wilson",
      type: "meeting",
      priority: "medium",
      status: "scheduled",
      dueDate: "2024-12-15",
      dueTime: "14:00",
      estimatedDuration: "2 hours",
      completed: false,
      createdDate: "2024-12-06",
    },
    {
      id: 5,
      title: "Email campaign setup for Artisan Collective",
      description: "Set up automated email campaign for new art collection launch",
      client: "Artisan Collective",
      contact: "Lisa Thompson",
      type: "email",
      priority: "low",
      status: "pending",
      dueDate: "2024-12-20",
      dueTime: "09:00",
      estimatedDuration: "4 hours",
      completed: false,
      createdDate: "2024-12-08",
    },
    {
      id: 6,
      title: "Demo presentation for Future Arts Inc.",
      description: "Prepare and present virtual gallery platform demo",
      client: "Future Arts Inc.",
      contact: "Alex Morgan",
      type: "presentation",
      priority: "high",
      status: "overdue",
      dueDate: "2024-12-08",
      dueTime: "16:00",
      estimatedDuration: "1.5 hours",
      completed: false,
      createdDate: "2024-12-05",
    },
  ]);

  const taskTypes = [
    { key: "call", label: "Call", icon: Phone, color: "bg-blue-100 text-blue-700" },
    { key: "email", label: "Email", icon: Mail, color: "bg-green-100 text-green-700" },
    { key: "meeting", label: "Meeting", icon: Video, color: "bg-purple-100 text-purple-700" },
    { key: "proposal", label: "Proposal", icon: FileText, color: "bg-yellow-100 text-yellow-700" },
    { key: "document", label: "Document", icon: FileText, color: "bg-indigo-100 text-indigo-700" },
    { key: "presentation", label: "Presentation", icon: Video, color: "bg-pink-100 text-pink-700" },
  ];

  const getTaskTypeInfo = (type: string) => {
    return taskTypes.find(t => t.key === type) || taskTypes[0];
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "scheduled":
        return "bg-purple-100 text-purple-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "overdue":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "scheduled":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed, 
            status: task.completed ? 'pending' : 'completed',
            completedDate: !task.completed ? new Date().toISOString().split('T')[0] : undefined
          }
        : task
    ));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const todayTasks = tasks.filter(task => task.dueDate === new Date().toISOString().split('T')[0]);
  const overdueTasks = tasks.filter(task => task.status === 'overdue');
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  const isToday = (dateString: string) => {
    return dateString === new Date().toISOString().split('T')[0];
  };

  const isOverdue = (dateString: string, status: string) => {
    return new Date(dateString) < new Date() && status !== 'completed';
  };

  const handleAddTask = () => {
    console.log('Add task clicked');
  };

  return (
    <div className={`p-6 ${isDashboardDarkMode ? "bg-[#171717] text-white" : "bg-gray-50 text-gray-900"}`}>
      <AdminHeader
        title="Tasks & Follow-ups"
        description="Manage your tasks and client follow-ups"
        createButtonText="Add Task"
        onCreateClick={handleAddTask}
        createButtonIcon={<Plus className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Today's Tasks
            </CardTitle>
            <Calendar className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {todayTasks.length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Overdue
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {overdueTasks.length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Pending
            </CardTitle>
            <Clock className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {pendingTasks.length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Completed
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {completedTasks.length}
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
                placeholder="Search tasks..."
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF8D28] focus:border-transparent ${
                  isDashboardDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF8D28] focus:border-transparent ${
                  isDashboardDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const typeInfo = getTaskTypeInfo(task.type);
          const TypeIcon = typeInfo.icon;
          
          return (
            <Card key={task.id} className={`${isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"} hover:shadow-md transition-shadow ${task.completed ? 'opacity-75' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="flex items-center mt-1">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className={`font-title text-lg mb-2 ${task.completed ? 'line-through' : ''} ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={typeInfo.color}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeInfo.label}
                          </Badge>
                          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="secondary" className={getStatusColor(task.status)}>
                            {getStatusIcon(task.status)}
                            <span className="ml-1 capitalize">{task.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className={`text-sm mb-4 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {task.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className={`flex items-center gap-1 ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <User className="w-3 h-3" />
                          <span className="font-medium">Client:</span>
                        </div>
                        <p className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>
                          {task.client}
                        </p>
                        <p className={`text-xs ${isDashboardDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                          Contact: {task.contact}
                        </p>
                      </div>

                      <div>
                        <div className={`flex items-center gap-1 ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <Calendar className="w-3 h-3" />
                          <span className="font-medium">Due Date:</span>
                        </div>
                        <p className={`${
                          isToday(task.dueDate) ? 'text-blue-600 font-medium' : 
                          isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' :
                          isDashboardDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <p className={`text-xs ${isDashboardDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                          {task.dueTime} ({task.estimatedDuration})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {task.type === 'call' && (
                          <Button variant="outline" size="sm">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                        )}
                        {task.type === 'email' && (
                          <Button variant="outline" size="sm">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

