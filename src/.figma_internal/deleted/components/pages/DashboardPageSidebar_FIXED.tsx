import React, { useEffect, useState } from "react";
import { useRouter } from "react-router-dom";
import {
  TrendingUp,
  Eye,
  Heart,
  DollarSign,
  Users,
  BarChart3,
  Calendar,
  Star,
  MessageSquare,
  Briefcase,
  Home,
  Building,
  Gavel,
  Ticket,
  Package,
  CreditCard,
  Clock,
  Plus,
  Users as CollabIcon,
  Settings,
  ShoppingCart,
  FileText,
  Target,
  Activity,
  BookOpen,
  Palette,
  Camera,
  Lightbulb,
  Zap,
  TrendingDown,
  ArrowRight,
  LogOut,
  ShoppingBag,
  GraduationCap,
  ExternalLink,
  Sun,
  Moon,
  Bell,
  HelpCircle,
  UserCheck,
  Contact,
  Handshake,
  CheckSquare,
  PieChart,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "../ui/sidebar";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useAuth } from "../providers/AuthProvider";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

// Import admin page components
import { AssetMarketplaceAdmin } from "./admin/AssetMarketplaceAdmin";
import { TalentMarketplaceAdmin } from "./admin/TalentMarketplaceAdmin";
import { StudiosAdmin } from "./admin/StudiosAdmin";
import { InvestorsAdmin } from "./admin/InvestorsAdmin";
import { TicketsAdmin } from "./admin/TicketsAdmin";
import { LegalServicesAdmin } from "./admin/LegalServicesAdmin";
import { ProductServicesAdmin } from "./admin/ProductServicesAdmin";
import { EducationAdmin } from "./admin/EducationAdmin";
import { ProductAndServicesListingForm } from "../forms/ProductAndServicesListingForm";
import { AssetListingForm } from "../forms/AssetListingForm";
import { TalentListingForm } from "../forms/TalentListingForm";
import { StudioListingForm } from "../forms/StudioListingForm";
import { InvestorListingForm } from "../forms/InvestorListingForm";
import { TicketListingForm } from "../forms/TicketListingForm";
import { LegalListingForm } from "../forms/LegalListingForm";
import { EducationListingForm } from "../forms/EducationListingForm";
import { CollaborationDashboard } from "./CollaborationDashboard";
import { CollaborationsPage } from "./CollaborationsPage";
import { CreateCollaborationPage } from "./CreateCollaborationPage";
import { UserApplications } from "./UserApplications";
import { CollaborationFlow } from "./CollaborationFlow";
import { ProfileSettingsPage } from "./ProfileSettingsPage";
import { CartPage } from "../CartPage";
import { OrdersPage } from "../OrdersPage";
import { ProfilePage } from "./ProfilePageFixed";
import { TalentDetailPage } from "./TalentDetailPage";
import { BusinessOverview } from "./crm/BusinessOverview";
import { ClientManagement } from "./crm/ClientManagement";
import { ContactManagement } from "./crm/ContactManagement";
import { DealsManagement } from "./crm/DealsManagement";
import { TasksManagement } from "./crm/TasksManagement";
import { BusinessReports } from "./crm/BusinessReports";
import { LeadsStream } from "./leads/LeadsStream";
import { CapturedLeads } from "./leads/CapturedLeads";
import { LeadsAnalytics } from "./leads/LeadsAnalytics";
import { LeadsSettings } from "./leads/LeadsSettings";
import { FormExamplesPage } from "./FormExamplesPage";
import { GigManagementPage } from "./GigManagementPage";

interface DashboardStats {
  totalListings: number;
  totalPurchases: number;
  totalRevenue: number;
  pendingBookings: number;
  activeListings: number;
  totalViews: number;
}

interface MarketplaceListing {
  id: string;
  type: "talent" | "asset" | "studio" | "investment" | "ticket" | "legal" | "product_service" | "education";
  title: string;
  price: number;
  status: "active" | "pending" | "sold" | "expired";
  views: number;
  inquiries: number;
  createdAt: string;
  thumbnail?: string;
  category: string;
  subcategory: string;
}

interface Transaction {
  id: string;
  type: "purchase" | "sale" | "booking" | "investment";
  title: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
  otherParty: string;
  marketplaceType: "talent" | "asset" | "studio" | "investment" | "ticket" | "legal" | "product_service" | "education";
}

const menuSections = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
      { id: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
      { id: "activity", label: "Activity Feed", icon: Activity, path: "/dashboard/activity" },
    ],
  },
  {
    title: "Marketplaces",
    items: [
      { id: "talent-marketplace", label: "Talent Marketplace", icon: Briefcase, path: "/talent-marketplace" },
      { id: "marketplace", label: "Asset Marketplace", icon: Palette, path: "/marketplace" },
      { id: "studios", label: "Studio Bookings", icon: Camera, path: "/studios" },
      { id: "investors", label: "Investor Connect", icon: TrendingUp, path: "/investors" },
      { id: "tickets", label: "Event Tickets", icon: Ticket, path: "/tickets" },
      { id: "legal-services", label: "Legal Services", icon: Gavel, path: "/legal-services" },
      { id: "product-services", label: "Products & Services", icon: ShoppingBag, path: "/product-services" },
      { id: "education", label: "Education & Learning", icon: GraduationCap, path: "/education" },
    ],
  },
  {
    title: "Collaborations",
    items: [
      { id: "collaborations", label: "My Projects", icon: CollabIcon, path: "/collaborations" },
      { id: "collaborations-browse", label: "Browse Collaborations", icon: BookOpen, path: "/collaborations/browse" },
      { id: "collaborations-create", label: "Create Project", icon: Plus, path: "/collaborations/create" },
      { id: "collaborations-applications", label: "Applications", icon: FileText, path: "/collaborations/applications" },
    ],
  },
  {
    title: "Commerce",
    items: [
      { id: "gigs", label: "Gig Management", icon: Clock, path: "/gigs" },
      { id: "orders", label: "Orders & Purchases", icon: Package, path: "/orders" },
      { id: "cart", label: "Shopping Cart", icon: ShoppingCart, path: "/cart" },
      { id: "revenue", label: "Revenue & Earnings", icon: DollarSign, path: "/dashboard/revenue" },
      { id: "billing", label: "Billing & Payments", icon: CreditCard, path: "/dashboard/billing" },
    ],
  },
  {
    title: "Business Management",
    items: [
      { id: "business-overview", label: "Business Overview", icon: BarChart3, path: "/business-overview" },
      { id: "clients", label: "Client Management", icon: UserCheck, path: "/clients" },
      { id: "contacts", label: "Contacts", icon: Contact, path: "/contacts" },
      { id: "deals", label: "Deals & Opportunities", icon: Handshake, path: "/deals" },
      { id: "tasks", label: "Tasks & Follow-ups", icon: CheckSquare, path: "/tasks" },
      { id: "business-reports", label: "Business Reports", icon: PieChart, path: "/business-reports" },
    ],
  },
  {
    title: "Lead Management",
    items: [
      { id: "leads-stream", label: "Live Leads Stream", icon: Zap, path: "/leads-stream" },
      { id: "captured-leads", label: "Captured Leads", icon: Target, path: "/captured-leads" },
      { id: "leads-analytics", label: "Leads Analytics", icon: BarChart3, path: "/leads-analytics" },
      { id: "leads-settings", label: "Leads Settings", icon: Settings, path: "/leads-settings" },
    ],
  },
  {
    title: "Content & Profile",
    items: [
      { id: "profile", label: "Public Profile", icon: Users, path: "/profile" },
      { id: "favorites", label: "Favorites", icon: Heart, path: "/dashboard/favorites" },
    ],
  },
  {
    title: "Settings",
    items: [
      { id: "profile-settings", label: "Profile Settings", icon: Settings, path: "/profile-settings" },
      { id: "form-examples", label: "Form Examples", icon: FileText, path: "/form-examples" },
      { id: "notifications", label: "Notifications", icon: MessageSquare, path: "/dashboard/notifications" },
      { id: "preferences", label: "Preferences", icon: Target, path: "/dashboard/preferences" },
    ],
  },
];

interface DashboardPageSidebarProps {
  currentPage?: string;
  onAddToCart?: (artworkId: string) => void;
  cartItemCount?: number;
  onProceedToCheckout?: (cartData: { items: any[]; total: number }) => void;
  userRole?: string;
}

export const DashboardPageSidebar: React.FC<DashboardPageSidebarProps> = ({
  currentPage = "dashboard",
  onAddToCart,
  cartItemCount = 0,
  onProceedToCheckout,
  userRole,
}) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    activeListings: 0,
    totalViews: 0,
  });
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(currentPage);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme");
    const shouldUseDark = savedTheme === "dark";
    setIsDarkMode(shouldUseDark);
    updateTheme(shouldUseDark);
  }, []);

  const updateTheme = (dark: boolean) => {
    localStorage.setItem("dashboard-theme", dark ? "dark" : "light");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("No access token found, using mock data");
        setStats({
          totalListings: 8,
          totalPurchases: 3,
          totalRevenue: 1040,
          pendingBookings: 2,
          activeListings: 6,
          totalViews: 1420,
        });
      } else {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalListings: data.stats.totalArtworks || 0,
            totalPurchases: data.stats.totalSales || 0,
            totalRevenue: data.stats.totalRevenue || 0,
            pendingBookings: Math.floor(Math.random() * 5),
            activeListings: data.stats.itemsForSale || 0,
            totalViews: data.stats.totalViews || 0,
          });
        } else {
          setStats({
            totalListings: 8,
            totalPurchases: 3,
            totalRevenue: 1040,
            pendingBookings: 2,
            activeListings: 6,
            totalViews: 1420,
          });
        }
      }

      // Mock data
      const mockListings: MarketplaceListing[] = [
        {
          id: "1",
          type: "talent",
          title: "UI/UX Design Services",
          price: 75,
          status: "active",
          views: 234,
          inquiries: 8,
          createdAt: "2024-01-15",
          thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=60&h=60&fit=crop",
          category: "Design",
          subcategory: "UI/UX Design",
        },
        {
          id: "2",
          type: "asset",
          title: "Digital Art Collection",
          price: 299,
          status: "active",
          views: 456,
          inquiries: 12,
          createdAt: "2024-01-10",
          thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=60&h=60&fit=crop",
          category: "Digital Art",
          subcategory: "Abstract",
        },
      ];

      const mockTransactions: Transaction[] = [
        {
          id: "1",
          type: "sale",
          title: "Digital Landscape Artwork",
          amount: 450,
          status: "completed",
          date: "2024-01-20",
          otherParty: "Emma Wilson",
          marketplaceType: "asset",
        },
      ];

      setListings(mockListings);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats({
        totalListings: 8,
        totalPurchases: 3,
        totalRevenue: 1040,
        pendingBookings: 2,
        activeListings: 6,
        totalViews: 1420,
      });
    } finally {
      setLoading(false);
    }
  };

  const getMarketplaceIcon = (type: string) => {
    switch (type) {
      case "talent": return <Briefcase className="w-4 h-4" />;
      case "asset": return <Package className="w-4 h-4" />;
      case "studio": return <Building className="w-4 h-4" />;
      case "investment": return <TrendingUp className="w-4 h-4" />;
      case "ticket": return <Ticket className="w-4 h-4" />;
      case "legal": return <Gavel className="w-4 h-4" />;
      case "product_service": return <ShoppingBag className="w-4 h-4" />;
      case "education": return <GraduationCap className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getMarketplaceColor = (type: string) => {
    switch (type) {
      case "talent": return "text-blue-600 bg-blue-100";
      case "asset": return "text-green-600 bg-green-100";
      case "studio": return "text-purple-600 bg-purple-100";
      case "investment": return "text-orange-600 bg-orange-100";
      case "ticket": return "text-pink-600 bg-pink-100";
      case "legal": return "text-indigo-600 bg-indigo-100";
      case "product_service": return "text-teal-600 bg-teal-100";
      case "education": return "text-amber-600 bg-amber-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleNavigation = (path: string, id: string) => {
    setActiveSection(id);
    if (path.startsWith("#")) {
      return;
    }
    if (id === "profile") {
      router.push(`/dashboard/profile`);
      return;
    }
    if (path.startsWith("/") && !path.startsWith("/dashboard")) {
      router.push(`/dashboard${path}`);
    } else {
      router.push(path);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleBackToMainSite = () => {
    router.push("/");
  };

  const getPageInfo = (pageId: string) => {
    if (pageId === "talent-detail") {
      return { title: "Talent Profile", icon: Users };
    }
    for (const section of menuSections) {
      const item = section.items.find((item) => item.id === pageId);
      if (item) {
        return { title: item.label, icon: item.icon };
      }
    }
    return { title: "Dashboard", icon: Home };
  };

  const renderPageHeader = (pageId: string) => {
    const { title, icon: Icon } = getPageInfo(pageId);
    return (
      <div className={`border-b p-4 h-[72px] ${isDarkMode ? "bg-[#171717] border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
            <h1 className={`text-2xl font-bold font-title ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {title}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className={`h-8 w-8 p-0 ${isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {}}
              className={`h-8 w-8 p-0 ${isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToMainSite}
              className={`${isDarkMode ? "bg-[#004D40] text-white hover:text-black hover:bg-white" : "bg-[#004D40] text-white hover:text-white hover:bg-gray-800"}`}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Back to Main Site
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case "marketplace":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("marketplace")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <AssetMarketplaceAdmin
                onAddToCart={onAddToCart}
                cartItemCount={cartItemCount}
                isDashboardDarkMode={isDarkMode}
              />
            </div>
          </div>
        );
      case "talent-marketplace":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("talent-marketplace")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <TalentMarketplaceAdmin isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("analytics")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <div className="text-center py-12">
                <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                <h3 className={`font-title text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Analytics Dashboard
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Advanced analytics and insights coming soon.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("dashboard")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className={`font-title text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Welcome Back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
                </h1>
                <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Here's what's happening with your creative business today
                </p>
              </div>

              {/* Action Required Alert */}
              <Card className={`mb-6 border-l-4 border-l-[#FF8D28] ${isDarkMode ? "bg-orange-900/20 border-orange-800" : "bg-orange-50 border-orange-200"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-[#FF8D28]/20">
                      <Bell className="w-5 h-5 text-[#FF8D28]" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-title text-lg font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        Action Required
                      </h3>
                      <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Complete your profile setup to unlock full marketplace features.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
                          onClick={() => router.push('/dashboard/profile-settings')}
                        >
                          Complete Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full mr-4 ${isDarkMode ? "bg-gray-800" : "bg-blue-100"}`}>
                        <Package className={`w-6 h-6 ${isDarkMode ? "text-blue-300" : "text-blue-600"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Active Listings
                        </p>
                        <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {stats.activeListings}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full mr-4 ${isDarkMode ? "bg-green-900" : "bg-green-100"}`}>
                        <CreditCard className={`w-6 h-6 ${isDarkMode ? "text-green-300" : "text-green-600"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Total Revenue
                        </p>
                        <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          ${stats.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Create New Listing Section */}
              <Card className={`mb-8 ${isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 font-title ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    <Plus className="w-5 h-5 text-[#FF8D28]" />
                    Create New Listing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className={`h-24 flex flex-col items-center justify-center gap-2 ${isDarkMode ? "border-gray-600 hover:border-[#FF8D28]" : "border-gray-200 hover:border-[#FF8D28]"}`}
                      onClick={() => router.push('/dashboard/create-talent')}
                    >
                      <Briefcase className="w-6 h-6 text-[#FF8D28]" />
                      <span className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Talent Services
                      </span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className={`h-24 flex flex-col items-center justify-center gap-2 ${isDarkMode ? "border-gray-600 hover:border-[#FF8D28]" : "border-gray-200 hover:border-[#FF8D28]"}`}
                      onClick={() => router.push('/dashboard/create-asset')}
                    >
                      <Palette className="w-6 h-6 text-[#FF8D28]" />
                      <span className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Digital Assets
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 font-title ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            Sold: {transaction.title}
                          </p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            to {transaction.otherParty}
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
    }
  };

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
        <Sidebar className={`${isDarkMode ? "!bg-[#171717] !border-gray-800" : "!bg-white !border-gray-200"}`}>
          <SidebarHeader className={`h-[72px] p-6 border-b ${isDarkMode ? "!bg-[#171717] !border-gray-800" : "!bg-white !border-gray-200"}`}>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} />
                <AvatarFallback className="bg-[#FF8D28] text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className={`text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {user?.email}
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className={`px-3 py-4 ${isDarkMode ? "!bg-[#171717]" : "!bg-white"}`}>
            {menuSections.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel className={`px-3 py-2 text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => handleNavigation(item.path, item.id)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            activeSection === item.id
                              ? isDarkMode
                                ? "bg-[#004D40] text-white hover:!bg-[#004D40] hover:!text-white"
                                : "bg-[#004D40] text-white hover:!bg-[#004D40] hover:!text-white"
                              : isDarkMode
                                ? "text-gray-300 hover:bg-[#004D40] hover:text-white"
                                : "text-gray-700 hover:bg-[#004D40] hover:text-white"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className={`p-4 border-t ${isDarkMode ? "!bg-[#171717] !border-gray-800" : "!bg-white !border-gray-200"}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className={`w-full justify-start gap-2 ${isDarkMode ? "border-red-300 text-red-300" : "border-red-300 text-red-600"}`}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

