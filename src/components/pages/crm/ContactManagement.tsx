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
import {
  Contact,
  Search,
  Plus,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  User,
  Star,
  MoreHorizontal,
} from "lucide-react";

interface ContactManagementProps {
  isDashboardDarkMode?: boolean;
}

export const ContactManagement: React.FC<ContactManagementProps> = ({
  isDashboardDarkMode = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Creative Director",
      company: "Creative Studio Inc.",
      email: "sarah@creativestudio.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      category: "client",
      lastContact: "2 days ago",
      tags: ["VIP", "Decision Maker"],
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9cf4b86?w=40&h=40&fit=crop&crop=face",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Marketing Manager",
      company: "Digital Arts Agency",
      email: "m.chen@digitalarts.com",
      phone: "+1 (555) 987-6543",
      location: "Los Angeles, CA",
      category: "lead",
      lastContact: "1 week ago",
      tags: ["Hot Lead", "Photography"],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      rating: 4,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      title: "Founder",
      company: "Rodriguez Photography",
      email: "emma@rodriguezphoto.com",
      phone: "+1 (555) 456-7890",
      location: "Miami, FL",
      category: "client",
      lastContact: "Yesterday",
      tags: ["Long-term", "Referrer"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      rating: 5,
    },
    {
      id: 4,
      name: "David Wilson",
      title: "Gallery Owner",
      company: "Modern Gallery",
      email: "david@moderngallery.com",
      phone: "+1 (555) 321-0987",
      location: "Chicago, IL",
      category: "partner",
      lastContact: "3 months ago",
      tags: ["Partner", "Exhibition"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 3,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      title: "Art Curator",
      company: "Artisan Collective",
      email: "lisa@artisancollective.com",
      phone: "+1 (555) 654-3210",
      location: "Seattle, WA",
      category: "client",
      lastContact: "Today",
      tags: ["Curator", "High Value"],
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
      rating: 5,
    },
    {
      id: 6,
      name: "James Anderson",
      title: "Marketing Specialist",
      company: "TechStart Inc.",
      email: "james@techstart.com",
      phone: "+1 (555) 789-0123",
      location: "Austin, TX",
      category: "lead",
      lastContact: "2 weeks ago",
      tags: ["Cold Lead", "Tech"],
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
      rating: 2,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "client":
        return "bg-green-100 text-green-700";
      case "lead":
        return "bg-blue-100 text-blue-700";
      case "partner":
        return "bg-purple-100 text-purple-700";
      case "vendor":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-red-100 text-red-700",
      "bg-yellow-100 text-yellow-700",
      "bg-green-100 text-green-700",
      "bg-blue-100 text-blue-700",
      "bg-indigo-100 text-indigo-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
    ];
    return colors[tag.length % colors.length];
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || contact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddContact = () => {
    console.log('Add contact clicked');
  };

  return (
    <div className={`p-6 ${isDashboardDarkMode ? "bg-[#171717] text-white" : "bg-gray-50 text-gray-900"}`}>
      <AdminHeader
        title="Contact Management"
        description="Organize and manage all your business contacts"
        createButtonText="Add Contact"
        onCreateClick={handleAddContact}
        createButtonIcon={<Plus className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Total Contacts
            </CardTitle>
            <Contact className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {contacts.length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Clients
            </CardTitle>
            <User className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {contacts.filter(c => c.category === 'client').length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Leads
            </CardTitle>
            <User className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {contacts.filter(c => c.category === 'lead').length}
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Partners
            </CardTitle>
            <Building className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {contacts.filter(c => c.category === 'partner').length}
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
                placeholder="Search contacts..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF8D28] focus:border-transparent ${
                  isDashboardDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Categories</option>
                <option value="client">Clients</option>
                <option value="lead">Leads</option>
                <option value="partner">Partners</option>
                <option value="vendor">Vendors</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className={isDashboardDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={isDashboardDarkMode ? "border-gray-700" : "border-gray-200"}>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Contact
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Contact Info
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Category
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Rating
                  </TableHead>
                  <TableHead className={isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}>
                    Tags
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
                {filteredContacts.map((contact) => (
                  <TableRow 
                    key={contact.id}
                    className={`hover:bg-opacity-50 ${
                      isDashboardDarkMode 
                        ? "border-gray-700 hover:bg-gray-800" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                            {contact.name}
                          </p>
                          <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {contact.title}
                          </p>
                          <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {contact.company}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className={`flex items-center gap-1 text-sm ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <MapPin className="w-3 h-3" />
                          {contact.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`${getCategoryColor(contact.category)} capitalize`}
                      >
                        {contact.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(contact.rating)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className={`text-xs ${getTagColor(tag)}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {contact.lastContact}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Mail className="w-4 h-4" />
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

