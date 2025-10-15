import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../ui/avatar";
import { AdminHeader } from "../../shared/AdminHeader";
import {
  Users,
  Search,
  Plus,
  Edit,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Filter,
  MoreHorizontal,
  Eye,
} from "lucide-react";

interface ClientManagementProps {
  isDashboardDarkMode?: boolean;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({
  isDashboardDarkMode = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const clients = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Creative Studio Inc.",
      email: "sarah@creativestudio.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      totalValue: "$12,500",
      lastContact: "2 days ago",
      joinDate: "Jan 15, 2024",
      projects: 3,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9cf4b86?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Digital Arts Agency",
      email: "m.chen@digitalarts.com",
      phone: "+1 (555) 987-6543",
      status: "prospect",
      totalValue: "$8,200",
      lastContact: "1 week ago",
      joinDate: "Feb 3, 2024",
      projects: 1,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      company: "Rodriguez Photography",
      email: "emma@rodriguezphoto.com",
      phone: "+1 (555) 456-7890",
      status: "active",
      totalValue: "$15,750",
      lastContact: "Yesterday",
      joinDate: "Dec 12, 2023",
      projects: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "David Wilson",
      company: "Modern Gallery",
      email: "david@moderngallery.com",
      phone: "+1 (555) 321-0987",
      status: "inactive",
      totalValue: "$5,400",
      lastContact: "3 months ago",
      joinDate: "Sep 8, 2023",
      projects: 2,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      company: "Artisan Collective",
      email: "lisa@artisancollective.com",
      phone: "+1 (555) 654-3210",
      status: "active",
      totalValue: "$22,100",
      lastContact: "Today",
      joinDate: "Nov 20, 2023",
      projects: 7,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "prospect":
        return "bg-blue-100 text-blue-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddClient = () => {
    console.log('Add client clicked');
  };

  return (
    <div className={`p-6 ${isDashboardDarkMode ? "bg-[#171717] text-white" : "bg-gray-50 text-gray-900"}`}>
      <AdminHeader
        title="Client Management"
        description="Manage your client relationships and track interactions"
        createButtonText="Add Client"
        onCreateClick={handleAddClient}
        createButtonIcon={<Plus className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Total Clients
            </CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {clients.length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Active Clients
            </CardTitle>
            <Users className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {clients.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Prospects
            </CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {clients.filter(c => c.status === 'prospect').length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Total Value
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              $63,950
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
                placeholder="Search clients..."
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
                <option value="active">Active</option>
                <option value="prospect">Prospect</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={isDashboardDarkMode ? "border-gray-700" : "border-gray-200"}>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Client
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Contact Info
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Status
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Total Value
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Projects
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Last Contact
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow 
                    key={client.id}
                    className={`hover:bg-opacity-50 ${
                      isDashboardDarkMode 
                        ? "border-gray-700 hover:bg-gray-800" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={client.avatar} alt={client.name} />
                          <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                            {client.name}
                          </p>
                          <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {client.company}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className={`flex items-center gap-1 text-sm ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`${getStatusColor(client.status)} capitalize`}
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${isDashboardDarkMode ? "text-green-400" : "text-green-600"}`}>
                        {client.totalValue}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                        {client.projects}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {client.lastContact}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

