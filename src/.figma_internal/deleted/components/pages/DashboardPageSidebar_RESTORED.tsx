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

      // Mock data for listings and transactions
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
        {
          id: "3",
          type: "studio",
          title: "Photography Studio Rental",
          price: 120,
          status: "active",
          views: 89,
          inquiries: 5,
          createdAt: "2024-01-08",
          thumbnail: "https://images.unsplash.com/photo-1493932484895-752d1471eab5?w=60&h=60&fit=crop",
          category: "Photography",
          subcategory: "Portrait Studio",
        },
        {
          id: "4",
          type: "legal",
          title: "Copyright Law Consultation",
          price: 250,
          status: "pending",
          views: 67,
          inquiries: 3,
          createdAt: "2024-01-12",
          thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=60&h=60&fit=crop",
          category: "Intellectual Property",
          subcategory: "Copyright Law",
        },
        {
          id: "5",
          type: "education",
          title: "Digital Photography Masterclass",
          price: 149,
          status: "active",
          views: 312,
          inquiries: 15,
          createdAt: "2024-01-20",
          thumbnail: "https://images.unsplash.com/photo-1606976722043-c1c5a3b8a8c9?w=60&h=60&fit=crop",
          category: "Photography",
          subcategory: "Digital Photography",
        },
        {
          id: "6",
          type: "product_service",
          title: "Custom Logo Design",
          price: 89,
          status: "sold",
          views: 178,
          inquiries: 7,
          createdAt: "2024-01-18",
          thumbnail: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=60&h=60&fit=crop",
          category: "Design Services",
          subcategory: "Logo Design",
        },
        {
          id: "7",
          type: "ticket",
          title: "Art Gallery Opening Night",
          price: 25,
          status: "active",
          views: 445,
          inquiries: 22,
          createdAt: "2024-01-22",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=60&h=60&fit=crop",
          category: "Art Events",
          subcategory: "Gallery Opening",
        },
        {
          id: "8",
          type: "investment",
          title: "Creative Startup Funding",
          price: 50000,
          status: "pending",
          views: 89,
          inquiries: 4,
          createdAt: "2024-01-25",
          thumbnail: "https://images.unsplash.com/photo-1559209172-716b6ff3f204?w=60&h=60&fit=crop",
          category: "Angel Investment",
          subcategory: "Seed Stage",
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
        {
          id: "2",
          type: "booking",
          title: "Studio Session Booking",
          amount: 240,
          status: "pending",
          date: "2024-01-18",
          otherParty: "John Smith",
          marketplaceType: "studio",
        },
        {
          id: "3",
          type: "purchase",
          title: "Legal Consultation",
          amount: 350,
          status: "completed",
          date: "2024-01-15",
          otherParty: "Legal Pro Services",
          marketplaceType: "legal",
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
      case "studios":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("studios")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <StudiosAdmin isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "investors":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("investors")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <InvestorsAdmin isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "tickets":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("tickets")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <TicketsAdmin isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "legal-services":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("legal-services")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <LegalServicesAdmin isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "product-services":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("product-services")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <ProductServicesAdmin isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "education":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("education")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <EducationAdmin isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "collaborations":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("collaborations")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <CollaborationDashboard isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "collaborations-browse":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("collaborations-browse")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <CollaborationsPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "collaborations-create":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("collaborations-create")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <CreateCollaborationPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "collaborations-applications":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("collaborations-applications")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <UserApplications isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "gigs":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("gigs")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <GigManagementPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "orders":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("orders")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <OrdersPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "cart":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("cart")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <CartPage 
                onProceedToCheckout={onProceedToCheckout}
                isDashboardDarkMode={isDarkMode} 
              />
            </div>
          </div>
        );
      case "profile":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("profile")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <ProfilePage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "profile-settings":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("profile-settings")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <ProfileSettingsPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "form-examples":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("form-examples")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <FormExamplesPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "business-overview":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("business-overview")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <BusinessOverview isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "clients":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("clients")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <ClientManagement isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "contacts":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("contacts")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <ContactManagement isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "deals":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("deals")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <DealsManagement isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "tasks":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("tasks")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <TasksManagement isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "business-reports":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("business-reports")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <BusinessReports isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "leads-stream":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("leads-stream")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <LeadsStream isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "captured-leads":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("captured-leads")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <CapturedLeads isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "leads-analytics":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("leads-analytics")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <LeadsAnalytics isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "leads-settings":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("leads-settings")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <LeadsSettings isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      // Create listing forms
      case "create-talent":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-talent")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <TalentListingForm isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "create-asset":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-asset")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <AssetListingForm isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "create-studio":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-studio")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <StudioListingForm isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "create-investor":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-investor")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <InvestorListingForm isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "create-ticket":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-ticket")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <TicketListingForm isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "create-legal":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-legal")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <LegalListingForm isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "create-product-service":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-product-service")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <ProductAndServicesListingForm isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "create-education":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-education")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <EducationListingForm isDashboardDarkMode={isDarkMode} />
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
      case "activity":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("activity")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <div className="space-y-6">
                <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 font-title ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      <Activity className="w-5 h-5 text-[#FF8D28]" />
                      Recent Activity Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-start gap-3 p-4 rounded-lg border">
                          <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                              Sold: {transaction.title}
                            </p>
                            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              to {transaction.otherParty} • ${transaction.amount}
                            </p>
                            <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      case "revenue":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("revenue")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 ${isDarkMode ? "bg-green-900" : "bg-green-100"}`}>
                          <DollarSign className={`w-6 h-6 ${isDarkMode ? "text-green-300" : "text-green-600"}`} />
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
                  
                  <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 ${isDarkMode ? "bg-blue-900" : "bg-blue-100"}`}>
                          <TrendingUp className={`w-6 h-6 ${isDarkMode ? "text-blue-300" : "text-blue-600"}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Monthly Growth
                          </p>
                          <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            +12.5%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 ${isDarkMode ? "bg-purple-900" : "bg-purple-100"}`}>
                          <CreditCard className={`w-6 h-6 ${isDarkMode ? "text-purple-300" : "text-purple-600"}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Pending Payments
                          </p>
                          <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            $2,340
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );
      case "billing":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("billing")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <div className="text-center py-12">
                <CreditCard className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                <h3 className={`font-title text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Billing & Payments
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Billing management features coming soon.
                </p>
              </div>
            </div>
          </div>
        );
      case "favorites":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("favorites")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <div className="text-center py-12">
                <Heart className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                <h3 className={`font-title text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Your Favorites
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Favorites feature coming soon.
                </p>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("notifications")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <div className="text-center py-12">
                <Bell className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                <h3 className={`font-title text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Notifications
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Notification center coming soon.
                </p>
              </div>
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("preferences")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <div className="text-center py-12">
                <Settings className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                <h3 className={`font-title text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Preferences
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  User preferences coming soon.
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

              {/* Mandatory Actions Alert */}
              <Card className={`mb-6 border-l-4 border-l-[#FF8D28] ${isDarkMode ? "bg-orange-900/20 border-orange-800 shadow-lg" : "bg-orange-50 border-orange-200 shadow-sm"}`}>
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
                        Complete your profile setup to unlock full marketplace features and increase your visibility to potential clients.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
                          onClick={() => router.push('/dashboard/profile-settings')}
                        >
                          Complete Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"}
                          onClick={() => {/* Action placeholder */}}
                        >
                          Remind Later
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Section */}
              <Card className={`mb-8 ${isDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}`}>
                <CardHeader>
                  <CardTitle className={`font-title text-xl flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    <Calendar className="w-5 h-5 text-[#FF8D28]" />
                    Upcoming Events & Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-l-4 border-l-blue-500 ${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          Portfolio Review Meeting
                        </h4>
                        <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
                          Tomorrow 2:00 PM
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Review and discuss new artwork submissions with creative director
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg border-l-4 border-l-green-500 ${isDarkMode ? "bg-green-900/20" : "bg-green-50"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          Studio Booking Session
                        </h4>
                        <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? "bg-green-800 text-green-200" : "bg-green-100 text-green-800"}`}>
                          Wed 10:00 AM
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Photography session at Creative Studios Downtown
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg border-l-4 border-l-purple-500 ${isDarkMode ? "bg-purple-900/20" : "bg-purple-50"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          Collaboration Deadline
                        </h4>
                        <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? "bg-purple-800 text-purple-200" : "bg-purple-100 text-purple-800"}`}>
                          Friday
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Submit final designs for "Urban Art" collaboration project
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg border-l-4 border-l-red-500 ${isDarkMode ? "bg-red-900/20" : "bg-red-50"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          Payment Due
                        </h4>
                        <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? "bg-red-800 text-red-200" : "bg-red-100 text-red-800"}`}>
                          Due Today
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Invoice #1234 from Digital Art Services - $850.00
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      className={`w-full ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      View Full Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Dashboard Stats Grid */}
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

                <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full mr-4 ${isDarkMode ? "bg-orange-900" : "bg-orange-100"}`}>
                        <Clock className={`w-6 h-6 ${isDarkMode ? "text-orange-300" : "text-orange-600"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Pending Bookings
                        </p>
                        <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {stats.pendingBookings}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full mr-4 ${isDarkMode ? "bg-purple-900" : "bg-purple-100"}`}>
                        <Eye className={`w-6 h-6 ${isDarkMode ? "text-purple-300" : "text-purple-600"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Total Views
                        </p>
                        <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {stats.totalViews.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Two Column Layout for Create CTAs and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
                <Card className={isDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-[#171717] hover:text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => router.push("/dashboard/create-talent")}
                      >
                        <Users className="w-6 h-6 text-purple-600" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Talent</p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Offer services
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-[#171717] hover:text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => router.push("/dashboard/create-asset")}
                      >
                        <Palette className="w-6 h-6 text-blue-600" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Asset</p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Sell artwork
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-[#171717] hover:text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => router.push("/dashboard/create-studio")}
                      >
                        <Building className="w-6 h-6 text-green-600" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Studio</p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Rent space
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-[#171717] hover:text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => router.push("/dashboard/create-investor")}
                      >
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Investor</p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Seek funding
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-[#171717] hover:text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => router.push("/dashboard/create-ticket")}
                      >
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Event</p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Sell tickets
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-[#171717] hover:text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => router.push("/dashboard/create-legal")}
                      >
                        <Gavel className="w-6 h-6 text-red-600" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Legal</p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Legal services
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-[#171717] hover:text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => router.push("/dashboard/create-product-service")}
                      >
                        <Package className="w-6 h-6 text-indigo-600" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Products & Services</p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Sell products & services
                          </p>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-[#171717] hover:text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => router.push("/dashboard/create-education")}
                      >
                        <GraduationCap className="w-6 h-6 text-yellow-600" />
                        <div className="text-center">
                          <p className="font-medium text-sm">Education</p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Teach courses
                          </p>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 font-title ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getMarketplaceColor(transaction.marketplaceType)}`}>
                              {getMarketplaceIcon(transaction.marketplaceType)}
                            </div>
                            <div>
                              <p className={`font-medium text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {transaction.title}
                              </p>
                              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {transaction.type} • {transaction.otherParty}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium text-sm ${transaction.type === "sale" ? "text-green-600" : "text-blue-600"}`}>
                              ${transaction.amount}
                            </p>
                            <Badge
                              variant={transaction.status === "completed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* My Listings Section */}
              <Card className={isDarkMode ? "bg-[#171717] border-gray-700" : "bg-white border-gray-200"}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 font-title ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    <Package className="w-5 h-5" />
                    My Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className={isDarkMode ? "border-gray-700" : "border-gray-200"}>
                          <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Type</TableHead>
                          <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Title</TableHead>
                          <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Category</TableHead>
                          <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Subcategory</TableHead>
                          <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Price</TableHead>
                          <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Status</TableHead>
                          <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Views</TableHead>
                          <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Inquiries</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listings.map((listing) => (
                          <TableRow key={listing.id} className={`hover:bg-opacity-50 ${isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-full ${getMarketplaceColor(listing.type)}`}>
                                  {getMarketplaceIcon(listing.type)}
                                </div>
                                <span className={`text-sm font-medium capitalize ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                  {listing.type.replace('_', ' ')}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {listing.thumbnail && (
                                  <ImageWithFallback
                                    src={listing.thumbnail}
                                    alt={listing.title}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                )}
                                <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {listing.title}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                                {listing.category}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                                {listing.subcategory}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                                ${listing.price.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  listing.status === "active"
                                    ? "default"
                                    : listing.status === "sold"
                                    ? "secondary"
                                    : listing.status === "pending"
                                    ? "outline"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {listing.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4 text-gray-400" />
                                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                                  {listing.views}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                                  {listing.inquiries}
                                </span>
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

