import React, { useState } from "react";
import { useParams, useRouter } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Settings, 
  User, 
  DollarSign, 
  Shield,
  UtensilsCrossed,
  Sparkles,
  Megaphone,
  Video,
  Trash2,
  Award,
  UserPlus,
  Search,
  X,
  CheckCircle,
  Star,
  MapPin,
  Clock,
  Share2,
  Plus,
  Mail,
  Phone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface OngoingCreationDetailPageProps {
  isDashboardDarkMode: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "active" | "busy" | "offline";
  skills: string[];
}

interface Profile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  location: string;
  experience: string;
  skills: string[];
  category: string;
  subcategory: string;
  price: string;
  availability: "available" | "busy" | "booked";
  verified: boolean;
}

interface ManualMemberForm {
  name: string;
  role: string;
  email: string;
  phone: string;
  skills: string;
  category: string;
  subcategory: string;
  notes: string;
}

interface ProjectDetails {
  id: string;
  title: string;
  client: string;
  clientAvatar?: string;
  type: "event" | "project";
  category: string;
  status: "in-progress" | "review" | "revision" | "completed";
  progress: number;
  deadline: string;
  budget: number;
  description: string;
  lastUpdate: string;
  startDate: string;
  team: TeamMember[];
}

// Mock data for profiles/listings
const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Alex Rodriguez",
    title: "Senior Event Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    rating: 4.9,
    location: "New York, NY",
    experience: "8+ years",
    skills: ["Event Planning", "Vendor Management", "Budget Control", "Timeline Management"],
    category: "Event Management",
    subcategory: "Event Planning",
    price: "$120/hr",
    availability: "available",
    verified: true
  },
  {
    id: "2",
    name: "Sarah Chen",
    title: "Creative Event Designer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b812c8d5?w=60&h=60&fit=crop&crop=face",
    rating: 4.8,
    location: "Los Angeles, CA",
    experience: "6+ years",
    skills: ["Creative Direction", "Theme Development", "Decor Planning", "Visual Design"],
    category: "Event Management",
    subcategory: "Creative Design",
    price: "$100/hr",
    availability: "available",
    verified: true
  },
  {
    id: "3",
    name: "Marcus Johnson",
    title: "Technical Director",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    rating: 4.7,
    location: "Chicago, IL",
    experience: "10+ years",
    skills: ["Audio Engineering", "Lighting Design", "Equipment Management", "Technical Setup"],
    category: "Technical Team",
    subcategory: "Audio Engineering",
    price: "$150/hr",
    availability: "busy",
    verified: true
  },
  {
    id: "4",
    name: "Emily Davis",
    title: "Marketing Strategist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    rating: 4.9,
    location: "Miami, FL",
    experience: "7+ years",
    skills: ["Digital Marketing", "Social Media", "Content Creation", "Campaign Management"],
    category: "Marketing and Promotions",
    subcategory: "Digital Marketing",
    price: "$90/hr",
    availability: "available",
    verified: true
  },
  {
    id: "5",
    name: "David Wilson",
    title: "Professional Photographer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
    rating: 4.8,
    location: "Seattle, WA",
    experience: "12+ years",
    skills: ["Event Photography", "Portrait Photography", "Photo Editing", "Studio Lighting"],
    category: "Photography/Videography",
    subcategory: "Photography",
    price: "$200/hr",
    availability: "available",
    verified: true
  }
];

// Categories and subcategories data
const categoriesData = {
  "Event Management": ["Event Planning", "Creative Design", "Logistics", "Vendor Coordination"],
  "Performer Management": ["Artist Relations", "Talent Booking", "Performance Coordination", "Contract Management"],
  "Technical Team": ["Audio Engineering", "Lighting Design", "Equipment Management", "Technical Setup"],
  "Marketing and Promotions": ["Digital Marketing", "Social Media", "Content Creation", "PR & Communications"],
  "Photography/Videography": ["Photography", "Videography", "Live Streaming", "Post-Production"],
  "Decor and Stage Setup": ["Stage Design", "Decor Planning", "Installation", "Event Styling"],
  "Hospitality and Catering": ["Catering Services", "Guest Services", "Food & Beverage", "Hospitality Management"],
  "Security and Safety": ["Event Security", "Crowd Control", "Safety Planning", "Emergency Response"],
  "Clean up and Maintenance": ["Event Cleanup", "Equipment Maintenance", "Waste Management", "Post-Event Services"]
};

// Mock data for the project
const mockProjectData: ProjectDetails = {
  id: "1",
  title: "Summer Art Festival 2024",
  client: "Creative Arts Foundation",
  type: "event",
  category: "Art Exhibition",
  status: "in-progress",
  progress: 65,
  deadline: "2024-12-25",
  budget: 25000,
  description: "A comprehensive summer art festival featuring local and international artists, with workshops, exhibitions, and live performances.",
  lastUpdate: "2 hours ago",
  startDate: "2024-01-15",
  team: [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Event Manager",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b812c8d5?w=40&h=40&fit=crop&crop=face",
      status: "active",
      skills: ["Event Planning", "Vendor Management", "Logistics"]
    },
    {
      id: "2",
      name: "Mike Chen",
      role: "Artist Coordinator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      status: "active",
      skills: ["Artist Relations", "Contract Management", "Creative Direction"]
    },
    {
      id: "3",
      name: "Emily Davis",
      role: "Marketing Lead",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      status: "busy",
      skills: ["Digital Marketing", "Content Creation", "Social Media"]
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      role: "Technical Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      status: "active",
      skills: ["Audio Engineering", "Equipment Management", "Technical Setup"]
    }
  ]
};

export function OngoingCreationDetailPage({ isDashboardDarkMode }: OngoingCreationDetailPageProps) {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("event-management");
  const [project] = useState<ProjectDetails>(mockProjectData);
  
  // Add Member States
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberMethod, setAddMemberMethod] = useState<"manual" | "float" | "add-manually" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Manual Member Form State
  const [manualForm, setManualForm] = useState<ManualMemberForm>({
    name: "",
    role: "",
    email: "",
    phone: "",
    skills: "",
    category: "",
    subcategory: "",
    notes: ""
  });
  
  // Filter profiles based on selected criteria
  const filteredProfiles = mockProfiles.filter(profile => {
    const matchesCategory = !selectedCategory || profile.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || profile.subcategory === selectedSubcategory;
    const matchesSearch = !searchQuery || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const handleBackToOngoing = () => {
    router.push("/dashboard/ongoing-creation");
  };

  const handleAddMember = () => {
    setShowAddMember(true);
    setAddMemberMethod(null);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSearchQuery("");
  };

  const handleCloseAddMember = () => {
    setShowAddMember(false);
    setAddMemberMethod(null);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSearchQuery("");
    setManualForm({
      name: "",
      role: "",
      email: "",
      phone: "",
      skills: "",
      category: "",
      subcategory: "",
      notes: ""
    });
  };

  const handleMethodSelect = (method: "manual" | "float" | "add-manually") => {
    setAddMemberMethod(method);
    if (method === "manual" || method === "add-manually") {
      // Map current tab to category
      const tabToCategoryMap: { [key: string]: string } = {
        "event-management": "Event Management",
        "performer-management": "Performer Management",
        "technical-team": "Technical Team",
        "marketing-promotions": "Marketing and Promotions",
        "photography-videography": "Photography/Videography",
        "decor-stage-setup": "Decor and Stage Setup",
        "hospitality-catering": "Hospitality and Catering",
        "security-safety": "Security and Safety",
        "cleanup-maintenance": "Clean up and Maintenance"
      };
      const category = tabToCategoryMap[activeTab] || "";
      setSelectedCategory(category);
      if (method === "add-manually") {
        setManualForm(prev => ({
          ...prev,
          category: category
        }));
      }
    }
  };

  const handleManualFormChange = (field: keyof ManualMemberForm, value: string) => {
    setManualForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManualFormSubmit = () => {
    console.log("Adding manual member:", manualForm);
    // Add manual member logic here
    // Reset form and close
    handleCloseAddMember();
  };

  const handleInviteProfile = (profileId: string) => {
    console.log(`Inviting profile ${profileId} to the project`);
    // Add invitation logic here
  };





  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToOngoing}
            className={`mb-4 ${isDashboardDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ongoing Creations
          </Button>
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className={`font-title text-3xl font-bold mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                {project.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {project.client}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-medium">
                    ${project.budget.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Due {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className={`text-lg max-w-3xl ${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {project.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className={`${isDashboardDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}`}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Project
              </Button>
              <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                <Settings className="w-4 h-4 mr-2" />
                Project Settings
              </Button>
            </div>
          </div>

          {/* Project Status Header */}
          <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className={`font-medium capitalize ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Progress</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-[#FF8D28] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Size</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-[#FF8D28]" />
                      <span className={`font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                        {project.team.length} Members
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Days Remaining</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className={`font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                        {Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {project.team.slice(0, 5).map((member, index) => (
                    <div
                      key={member.id}
                      className="relative w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden"
                    >
                      <img
                        src={member.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&t=${index}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {project.team.length > 5 && (
                    <div className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium ${isDashboardDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}>
                      +{project.team.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
            <div className="flex flex-col lg:flex-row gap-6">
              <TabsList className="flex flex-col lg:flex-col h-fit space-y-1 bg-transparent p-0 lg:min-w-[280px] w-full lg:w-auto">
                <TabsTrigger 
                  value="event-management" 
                  className={`w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-[#FF8D28] data-[state=active]:text-white ${
                    isDashboardDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Event Management
                </TabsTrigger>
                <TabsTrigger 
                  value="performer-management" 
                  className={`w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-[#FF8D28] data-[state=active]:text-white ${
                    isDashboardDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Performer Management
                </TabsTrigger>
                <TabsTrigger 
                  value="technical-team" 
                  className={`w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-[#FF8D28] data-[state=active]:text-white ${
                    isDashboardDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Technical Team
                </TabsTrigger>
                <TabsTrigger 
                  value="marketing-promotions" 
                  className={`w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-[#FF8D28] data-[state=active]:text-white ${
                    isDashboardDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Megaphone className="w-4 h-4 mr-2" />
                  Marketing and Promotions
                </TabsTrigger>
                <TabsTrigger 
                  value="photography-videography" 
                  className={`w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-[#FF8D28] data-[state=active]:text-white ${
                    isDashboardDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Photography/Videography
                </TabsTrigger>
                <TabsTrigger 
                  value="decor-stage-setup" 
                  className={`w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-[#FF8D28] data-[state=active]:text-white ${
                    isDashboardDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Decor and Stage Setup
                </TabsTrigger>
                <TabsTrigger 
                  value="hospitality-catering" 
                  className={`w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-[#FF8D28] data-[state=active]:text-white ${
                    isDashboardDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4 mr-2" />
                  Hospitality and Catering
                </TabsTrigger>
                <TabsTrigger 
                  value="security-safety" 
                  className={`w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-[#FF8D28] data-[state=active]:text-white ${
                    isDashboardDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security and Safety
                </TabsTrigger>
                <TabsTrigger 
                  value="cleanup-maintenance" 
                  className={`w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-[#FF8D28] data-[state=active]:text-white ${
                    isDashboardDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clean up and Maintenance
                </TabsTrigger>
              </TabsList>

                <div className="flex-1">
                  {/* Event Management Tab */}
                  <TabsContent value="event-management" className="mt-0">
                    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          Event Management Team
                        </CardTitle>
                        <Button 
                          onClick={handleAddMember}
                          className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-body"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>5</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Members</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>12</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Tasks Completed</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>8</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Active Tasks</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>75%</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Progress</p>
                          </div>
                        </div>
                        
                        {/* Add Member Section */}
                        {showAddMember && activeTab === "event-management" && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className={`font-title text-lg font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                Add New Team Member
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCloseAddMember}
                                className={`${isDashboardDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {!addMemberMethod ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card 
                                  className={`cursor-pointer border-2 transition-colors hover:border-[#FF8D28] ${isDashboardDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
                                  onClick={() => handleMethodSelect("manual")}
                                >
                                  <CardContent className="p-6 text-center">
                                    <Search className="w-8 h-8 text-[#FF8D28] mx-auto mb-3" />
                                    <h4 className={`font-title font-medium mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                      Manual Search
                                    </h4>
                                    <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                      Browse and search through our marketplace of professionals
                                    </p>
                                  </CardContent>
                                </Card>
                                
                                <Card 
                                  className={`cursor-pointer border-2 transition-colors hover:border-[#FF8D28] ${isDashboardDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
                                  onClick={() => handleMethodSelect("float")}
                                >
                                  <CardContent className="p-6 text-center">
                                    <Share2 className="w-8 h-8 text-[#FF8D28] mx-auto mb-3" />
                                    <h4 className={`font-title font-medium mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                      Float Lead
                                    </h4>
                                    <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                      Post your requirements and let professionals come to you
                                    </p>
                                  </CardContent>
                                </Card>

                                <Card 
                                  className={`cursor-pointer border-2 transition-colors hover:border-[#FF8D28] ${isDashboardDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
                                  onClick={() => handleMethodSelect("add-manually")}
                                >
                                  <CardContent className="p-6 text-center">
                                    <Plus className="w-8 h-8 text-[#FF8D28] mx-auto mb-3" />
                                    <h4 className={`font-title font-medium mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                      Add Manually
                                    </h4>
                                    <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                      Manually enter team member details and contact information
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
                            ) : addMemberMethod === "manual" ? (
                              <div className="space-y-6">
                                {/* Search and Filter Controls */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className={`${isDashboardDarkMode ? "bg-gray-700 border-gray-600" : ""}`}>
                                      <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.keys(categoriesData).map((category) => (
                                        <SelectItem key={category} value={category}>
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  
                                  <Select 
                                    value={selectedSubcategory} 
                                    onValueChange={setSelectedSubcategory}
                                    disabled={!selectedCategory}
                                  >
                                    <SelectTrigger className={`${isDashboardDarkMode ? "bg-gray-700 border-gray-600" : ""}`}>
                                      <SelectValue placeholder="Select Subcategory" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {selectedCategory && categoriesData[selectedCategory as keyof typeof categoriesData]?.map((subcategory) => (
                                        <SelectItem key={subcategory} value={subcategory}>
                                          {subcategory}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                      placeholder="Search professionals..."
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                      className={`pl-10 ${isDashboardDarkMode ? "bg-gray-700 border-gray-600" : ""}`}
                                    />
                                  </div>
                                </div>

                                {/* Professional Listings */}
                                <div className="space-y-4">
                                  <h4 className={`font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                    Available Professionals ({filteredProfiles.length})
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                                    {filteredProfiles.map((profile) => (
                                      <Card key={profile.id} className={`${isDashboardDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} hover:shadow-md transition-shadow max-w-xs`}>
                                        <CardContent className="p-4">
                                          <div className="text-center space-y-3">
                                            <div className="relative mx-auto w-16 h-16">
                                              <img
                                                src={profile.avatar}
                                                alt={profile.name}
                                                className="w-16 h-16 rounded-full object-cover mx-auto"
                                              />
                                              {profile.verified && (
                                                <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
                                              )}
                                            </div>
                                            
                                            <div>
                                              <div className="flex items-center justify-center gap-1 mb-1">
                                                <h5 className={`font-medium text-sm truncate ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                                  {profile.name}
                                                </h5>
                                                <div className="flex items-center gap-1">
                                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                  <span className="text-xs text-yellow-600">{profile.rating}</span>
                                                </div>
                                              </div>
                                              <p className={`text-xs text-center truncate ${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                {profile.title}
                                              </p>
                                            </div>

                                            <div className="space-y-2">
                                              <div className="flex items-center justify-center gap-3 text-xs">
                                                <div className="flex items-center gap-1">
                                                  <MapPin className="w-3 h-3 text-gray-400" />
                                                  <span className="text-gray-500 truncate">{profile.location.split(',')[0]}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Clock className="w-3 h-3 text-gray-400" />
                                                  <span className="text-gray-500">{profile.experience}</span>
                                                </div>
                                              </div>
                                              
                                              <Badge 
                                                variant={profile.availability === "available" ? "default" : "secondary"}
                                                className="text-xs mx-auto"
                                              >
                                                {profile.availability}
                                              </Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-1 justify-center">
                                              {profile.skills.slice(0, 2).map((skill) => (
                                                <Badge key={skill} variant="outline" className="text-xs">
                                                  {skill}
                                                </Badge>
                                              ))}
                                              {profile.skills.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                  +{profile.skills.length - 2}
                                                </Badge>
                                              )}
                                            </div>

                                            <div className="space-y-2">
                                              <p className={`font-medium text-sm ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                                {profile.price}
                                              </p>
                                              <Button
                                                size="sm"
                                                onClick={() => handleInviteProfile(profile.id)}
                                                className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white w-full text-xs"
                                              >
                                                Invite
                                              </Button>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                    {filteredProfiles.length === 0 && (
                                      <div className={`col-span-full text-center py-8 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        <p>No professionals found matching your criteria.</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : addMemberMethod === "float" ? (
                              <div className="text-center py-8">
                                <Share2 className="w-12 h-12 text-[#FF8D28] mx-auto mb-4" />
                                <h4 className={`font-title text-lg font-medium mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                  Float Lead Feature
                                </h4>
                                <p className={`${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
                                  This feature will allow you to post your requirements and let professionals apply to join your project.
                                </p>
                                <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                                  Create Lead Post
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                <div className="text-center mb-6">
                                  <Plus className="w-12 h-12 text-[#FF8D28] mx-auto mb-4" />
                                  <h4 className={`font-title text-lg font-medium mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                    Add Team Member Manually
                                  </h4>
                                  <p className={`${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    Enter the details of the team member you want to add to this project.
                                  </p>
                                </div>

                                <Card className={`${isDashboardDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}>
                                  <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                        <Label htmlFor="name" className={`font-body ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                          Full Name *
                                        </Label>
                                        <Input
                                          id="name"
                                          value={manualForm.name}
                                          onChange={(e) => handleManualFormChange("name", e.target.value)}
                                          placeholder="Enter full name"
                                          className={`${isDashboardDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="role" className={`font-body ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                          Role/Title *
                                        </Label>
                                        <Input
                                          id="role"
                                          value={manualForm.role}
                                          onChange={(e) => handleManualFormChange("role", e.target.value)}
                                          placeholder="e.g., Event Manager, Technical Director"
                                          className={`${isDashboardDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="email" className={`font-body ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                          Email Address *
                                        </Label>
                                        <div className="relative">
                                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                          <Input
                                            id="email"
                                            type="email"
                                            value={manualForm.email}
                                            onChange={(e) => handleManualFormChange("email", e.target.value)}
                                            placeholder="email@example.com"
                                            className={`pl-10 ${isDashboardDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="phone" className={`font-body ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                          Phone Number
                                        </Label>
                                        <div className="relative">
                                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                          <Input
                                            id="phone"
                                            type="tel"
                                            value={manualForm.phone}
                                            onChange={(e) => handleManualFormChange("phone", e.target.value)}
                                            placeholder="+1 (555) 123-4567"
                                            className={`pl-10 ${isDashboardDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="category" className={`font-body ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                          Category *
                                        </Label>
                                        <Select value={manualForm.category} onValueChange={(value) => handleManualFormChange("category", value)}>
                                          <SelectTrigger className={`${isDashboardDarkMode ? "bg-gray-600 border-gray-500" : ""}`}>
                                            <SelectValue placeholder="Select Category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Object.keys(categoriesData).map((category) => (
                                              <SelectItem key={category} value={category}>
                                                {category}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="subcategory" className={`font-body ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                          Subcategory
                                        </Label>
                                        <Select 
                                          value={manualForm.subcategory} 
                                          onValueChange={(value) => handleManualFormChange("subcategory", value)}
                                          disabled={!manualForm.category}
                                        >
                                          <SelectTrigger className={`${isDashboardDarkMode ? "bg-gray-600 border-gray-500" : ""}`}>
                                            <SelectValue placeholder="Select Subcategory" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {manualForm.category && categoriesData[manualForm.category as keyof typeof categoriesData]?.map((subcategory) => (
                                              <SelectItem key={subcategory} value={subcategory}>
                                                {subcategory}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="skills" className={`font-body ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                          Skills & Expertise
                                        </Label>
                                        <Input
                                          id="skills"
                                          value={manualForm.skills}
                                          onChange={(e) => handleManualFormChange("skills", e.target.value)}
                                          placeholder="e.g., Event Planning, Budget Management, Vendor Relations (separate with commas)"
                                          className={`${isDashboardDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                                        />
                                      </div>

                                      <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="notes" className={`font-body ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                          Additional Notes
                                        </Label>
                                        <Textarea
                                          id="notes"
                                          value={manualForm.notes}
                                          onChange={(e) => handleManualFormChange("notes", e.target.value)}
                                          placeholder="Any additional information about this team member..."
                                          rows={3}
                                          className={`${isDashboardDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                                        />
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                      <Button
                                        variant="outline"
                                        onClick={handleCloseAddMember}
                                        className={`${isDashboardDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}`}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={handleManualFormSubmit}
                                        disabled={!manualForm.name || !manualForm.role || !manualForm.email || !manualForm.category}
                                        className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
                                      >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Team Member
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Performer Management Tab */}
                  <TabsContent value="performer-management" className="mt-0">
                    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          Performer Management Team
                        </CardTitle>
                        <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-body">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>3</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Members</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>15</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Artists Confirmed</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>3</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Live Shows</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>8</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Workshops</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Technical Team Tab */}
                  <TabsContent value="technical-team" className="mt-0">
                    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          Technical Team
                        </CardTitle>
                        <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-body">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>6</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Members</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>4</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Equipment Sets</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>12</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Setup Tasks</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>60%</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Setup Progress</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Marketing and Promotions Tab */}
                  <TabsContent value="marketing-promotions" className="mt-0">
                    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          Marketing & Promotions Team
                        </CardTitle>
                        <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-body">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>4</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Members</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>2.5K</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Social Reach</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>6</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Active Campaigns</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>75%</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Campaign Progress</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Photography/Videography Tab */}
                  <TabsContent value="photography-videography" className="mt-0">
                    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          Photography & Videography Team
                        </CardTitle>
                        <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-body">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>5</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Members</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>3</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Photographers</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>2</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Video Crew</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>8hrs</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Coverage Time</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Decor and Stage Setup Tab */}
                  <TabsContent value="decor-stage-setup" className="mt-0">
                    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          Decor & Stage Setup Team
                        </CardTitle>
                        <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-body">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>7</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Members</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>1</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Main Stage</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>15</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Decor Elements</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>80%</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Setup Complete</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Hospitality and Catering Tab */}
                  <TabsContent value="hospitality-catering" className="mt-0">
                    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          Hospitality & Catering Team
                        </CardTitle>
                        <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-body">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>8</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Members</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>200</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Expected Guests</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>3</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Catering Stations</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>5</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Service Staff</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Security and Safety Tab */}
                  <TabsContent value="security-safety" className="mt-0">
                    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          Security & Safety Team
                        </CardTitle>
                        <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-body">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>10</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Members</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>8</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Security Guards</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>2</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Medical Staff</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>6</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Safety Checkpoints</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Clean up and Maintenance Tab */}
                  <TabsContent value="cleanup-maintenance" className="mt-0">
                    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          Cleanup & Maintenance Team
                        </CardTitle>
                        <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-body">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>6</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Team Members</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>2</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Cleanup Shifts</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>12hrs</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total Duration</p>
                          </div>
                          <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className={`text-2xl font-bold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>5</div>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Cleanup Zones</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

