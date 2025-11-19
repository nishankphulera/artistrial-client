
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/utils/api";
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
  X,
  Check,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "@/components/ui/sidebar";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useAuth } from "@/components/providers/AuthProvider";
import { projectId, publicAnonKey } from "@/utils/supabase/info";
import { useCart } from "@/hooks/useCart";

// Import admin page components
import { AssetMarketplaceAdmin } from "./admin/AssetMarketplaceAdmin";
import { AssetMarketplacePage } from "./AssetMarketplacePage";
import { TalentMarketplaceAdmin } from "./admin/TalentMarketplaceAdmin";
import { TalentMarketplacePage } from "./TalentMarketplacePage";
import { TicketsMarketplacePage } from "./TicketsMarketplacePage";
import { StudiosAdmin } from "./admin/StudiosAdmin";
import { InvestorsAdmin } from "./admin/InvestorsAdmin";
import { TicketsAdmin } from "./admin/TicketsAdmin";
import { LegalServicesAdmin } from "./admin/LegalServicesAdmin";
import { ProductServicesAdmin } from "./admin/ProductServicesAdmin";
import { ProductServicesPage } from "./ProductServicesPage";
import { EducationAdmin } from "./admin/EducationAdmin";
import { ProductAndServicesListingForm } from "@/components/forms/ProductAndServicesListingForm";
import { AssetListingForm } from "@/components/forms/AssetListingForm";
import { TalentListingForm } from "@/components/forms/TalentListingForm";
import { StudioListingForm } from "@/components/forms/StudioListingForm";
import { InvestorListingForm } from "@/components/forms/InvestorListingForm";
import { TicketListingForm } from "@/components/forms/TicketListingForm";
import { LegalListingForm } from "@/components/forms/LegalListingForm";
import { EducationListingForm } from "@/components/forms/EducationListingForm";
import { CollaborationDashboard } from "./CollaborationDashboard";
import { CollaborationsPage } from "./CollaborationsPage";
import { CreateCollaborationPage } from "./CreateCollaborationPage";
import { UserApplications } from "./UserApplications";
import { CollaborationFlow } from "./CollaborationFlow";
import { ProfileSettingsPage } from "./ProfileSettingsPage";
import { CartPage } from "@/components/CartPage";
import { OrdersPage } from "@/components/OrdersPage";
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
import { CreateListingPage } from "../forms/ListingFormsManager";
import { IPCreationForm } from "../forms/IPCreationForm";
import { OngoingCreationPage } from "./OngoingCreationPage";
import { OngoingCreationDetailPage } from "./OngoingCreationDetailPage";
import { CreationsPage } from "./CreationsPage";
import { MyOGsPage } from "./MyOGsPage";
import { ActivityFeedPage } from "./ActivityFeedPage";
import { ChatPage } from "./ChatPage";
import { ConnectionsPage } from "./ConnectionsPage";

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

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error" | "message" | "order" | "collaboration" | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  avatar?: string;
  metadata?: {
    amount?: number;
    collaborationId?: string;
    orderId?: string;
    userId?: string;
  };
}

const menuSections = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
      { id: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
      { id: "activity", label: "Activity Feed", icon: Activity, path: "/dashboard/activity" },
      { id: "chat", label: "Messages & Chat", icon: MessageSquare, path: "/dashboard/chat" },
      { id: "connections", label: "Connections", icon: Users, path: "/dashboard/connections" },
      { id: "profile", label: "Public Profile", icon: Users, path: "/dashboard/profile" },
      { id: "favorites", label: "Favorites", icon: Heart, path: "/dashboard/favorites" },
    ],
  },
  {
    title: "Creations",
    items: [
      { id: "create-ip", label: "Create IP", icon: Lightbulb, path: "/dashboard/create-ip" },
      { id: "ongoing-creation", label: "Ongoing Creation", icon: Clock, path: "/dashboard/ongoing-creation" },
      { id: "creations", label: "Creations", icon: Palette, path: "/dashboard/creations" },
      { id: "my-ogs", label: "My OGs", icon: Star, path: "/dashboard/my-ogs" },
    ],
  },
  {
    title: "Marketplaces",
    items: [
      { id: "talent-marketplace", label: "Talent Marketplace", icon: Briefcase, path: "/dashboard/marketplace/talent" },
      { id: "marketplace", label: "Asset Marketplace", icon: Palette, path: "/dashboard/marketplace/assets" },
      { id: "studios", label: "Studio Bookings", icon: Camera, path: "/dashboard/marketplace/studios" },
      { id: "investors", label: "Investor Connect", icon: TrendingUp, path: "/dashboard/marketplace/investors" },
      { id: "tickets", label: "Event Tickets", icon: Ticket, path: "/dashboard/marketplace/tickets" },
      { id: "legal-services", label: "Legal Services", icon: Gavel, path: "/dashboard/marketplace/legal" },
      { id: "product-services", label: "Products & Services", icon: ShoppingBag, path: "/dashboard/marketplace/products" },
      { id: "education", label: "Education & Learning", icon: GraduationCap, path: "/dashboard/marketplace/education" },
    ],
  },
  {
    title: "Collaborations",
    items: [
      { id: "collaborations", label: "My Projects", icon: Users, path: "/dashboard/collaborations" },
      { id: "collaborations-browse", label: "Browse Collaborations", icon: BookOpen, path: "/dashboard/collaborations/browse" },
      { id: "collaborations-create", label: "Create Project", icon: Plus, path: "/dashboard/collaborations/create" },
      { id: "collaborations-applications", label: "Applications", icon: FileText, path: "/dashboard/collaborations/applications" },
    ],
  },
  {
    title: "Commerce",
    items: [
      { id: "gigs", label: "Gig Management", icon: Clock, path: "/dashboard/gigs" },
      { id: "orders", label: "Orders & Purchases", icon: Package, path: "/dashboard/orders" },
      { id: "cart", label: "Shopping Cart", icon: ShoppingCart, path: "/dashboard/cart" },
      { id: "revenue", label: "Revenue & Earnings", icon: DollarSign, path: "/dashboard/revenue" },
      { id: "billing", label: "Billing & Payments", icon: CreditCard, path: "/dashboard/billing" },
    ],
  },
  {
    title: "Business Management",
    items: [
      { id: "business-overview", label: "Business Overview", icon: BarChart3, path: "/dashboard/business-overview" },
      { id: "clients", label: "Client Management", icon: UserCheck, path: "/dashboard/clients" },
      { id: "contacts", label: "Contacts", icon: Contact, path: "/dashboard/contacts" },
      { id: "deals", label: "Deals & Opportunities", icon: Handshake, path: "/dashboard/deals" },
      { id: "tasks", label: "Tasks & Follow-ups", icon: CheckSquare, path: "/dashboard/tasks" },
      { id: "business-reports", label: "Business Reports", icon: PieChart, path: "/dashboard/business-reports" },
    ],
  },
  {
    title: "Lead Management",
    items: [
      { id: "leads-stream", label: "Live Leads Stream", icon: Zap, path: "/dashboard/leads-stream" },
      { id: "captured-leads", label: "Captured Leads", icon: Target, path: "/dashboard/captured-leads" },
      { id: "leads-analytics", label: "Leads Analytics", icon: BarChart3, path: "/dashboard/leads-analytics" },
      { id: "leads-settings", label: "Leads Settings", icon: Settings, path: "/dashboard/leads-settings" },
    ],
  },

  {
    title: "Settings",
    items: [
      { id: "profile-settings", label: "Profile Settings", icon: Settings, path: "/dashboard/profile-settings" },
      { id: "form-examples", label: "Form Examples", icon: FileText, path: "/dashboard/form-examples" },
      { id: "notifications", label: "Notifications", icon: MessageSquare, path: "/dashboard/notifications" },
      { id: "preferences", label: "Preferences", icon: Target, path: "/dashboard/preferences" },
    ],
  },
  {
    title: "Admin",
    items: [
      { id: "admin-marketplace", label: "Asset Marketplace", icon: Palette, path: "/dashboard/admin/marketplace" },
      { id: "admin-talent-marketplace", label: "Talent Marketplace", icon: Briefcase, path: "/dashboard/admin/talent-marketplace" },
      { id: "admin-studios", label: "Studio Bookings", icon: Camera, path: "/dashboard/admin/studios" },
      { id: "admin-investors", label: "Investor Connect", icon: TrendingUp, path: "/dashboard/admin/investors" },
      { id: "admin-tickets", label: "Event Tickets", icon: Ticket, path: "/dashboard/admin/tickets" },
      { id: "admin-legal-services", label: "Legal Services", icon: Gavel, path: "/dashboard/admin/legal-services" },
      { id: "admin-product-services", label: "Products & Services", icon: ShoppingBag, path: "/dashboard/admin/product-services" },
      { id: "admin-education", label: "Education & Learning", icon: GraduationCap, path: "/dashboard/admin/education" },
    ],
  },
];

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "New Purchase",
    message: "Sarah Chen purchased your 'Urban Landscape #3' artwork for $450",
    time: "2 minutes ago",
    isRead: false,
    actionUrl: "/dashboard/orders",
    actionLabel: "View Order",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face",
    metadata: {
      amount: 450,
      orderId: "ORD-2024-001"
    }
  },
  {
    id: "2",
    type: "collaboration",
    title: "Collaboration Request",
    message: "Marcus Rivera wants to collaborate on a digital art project",
    time: "15 minutes ago",
    isRead: false,
    actionUrl: "/dashboard/collaborations/applications",
    actionLabel: "View Request",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    metadata: {
      collaborationId: "COLLAB-001",
      userId: "marcus-rivera"
    }
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    message: "Elena Rodriguez: 'Thanks for the amazing artwork! Can we discuss licensing terms?'",
    time: "1 hour ago",
    isRead: false,
    actionUrl: "/dashboard/chat",
    actionLabel: "Reply",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: "4",
    type: "success",
    title: "Payment Received",
    message: "Payment of $1,250 from TechFlow Inc. has been processed successfully",
    time: "3 hours ago",
    isRead: true,
    actionUrl: "/dashboard/orders",
    actionLabel: "View Details",
    metadata: {
      amount: 1250,
      orderId: "ORD-2024-002"
    }
  },
  {
    id: "5",
    type: "system",
    title: "Profile Verification",
    message: "Your artist profile has been verified! You can now access premium features.",
    time: "1 day ago",
    isRead: true,
    actionUrl: "/dashboard/profile-settings",
    actionLabel: "View Profile"
  },
  {
    id: "6",
    type: "warning",
    title: "Listing Expiring Soon",
    message: "Your studio booking listing 'Creative Space Downtown' expires in 3 days",
    time: "2 days ago",
    isRead: true,
    actionUrl: "/dashboard/studios",
    actionLabel: "Renew Listing"
  },
  {
    id: "7",
    type: "info",
    title: "Platform Update",
    message: "New features available: Enhanced collaboration tools and improved messaging system",
    time: "3 days ago",
    isRead: true,
    actionUrl: "/dashboard/activity",
    actionLabel: "Learn More"
  },
  {
    id: "8",
    type: "order",
    title: "Order Shipped",
    message: "Your physical artwork 'Abstract Dreams' has been shipped to the buyer",
    time: "5 days ago",
    isRead: true,
    actionUrl: "/dashboard/orders",
    actionLabel: "Track Package",
    metadata: {
      orderId: "ORD-2024-003"
    }
  }
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
  const { user, signOut, setUser } = useAuth();
  const router = useRouter();
  const { handleAddToCart: handleAddToCartHook, handleRemoveFromCart: handleRemoveFromCartHook } = useCart();
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
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null); // Store full user data from API
  const [internalCartItemCount, setInternalCartItemCount] = useState(0);

  // Use internal cart count state (fetched from API)
  // The prop cartItemCount can be used to override, but we'll use internal state by default
  const displayCartItemCount = internalCartItemCount;

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme");
    const shouldUseDark = savedTheme === "dark";
    setIsDarkMode(shouldUseDark);
    updateTheme(shouldUseDark);
  }, []);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user?.id) return;
      
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch(
          apiUrl(`cart/${user.id}`),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const count = data.cart?.items?.length || 0;
          setInternalCartItemCount(count);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, [user?.id]);

  // Handler for adding to cart
  const handleAddToCart = async (assetId: string) => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }

    try {
      await handleAddToCartHook(assetId, user);
      // Update cart count after adding
      const token = localStorage.getItem('access_token');
      if (token) {
        const response = await fetch(
          apiUrl(`cart/${user.id}`),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const count = data.cart?.items?.length || 0;
          setInternalCartItemCount(count);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Handler for removing from cart
  const handleRemoveFromCart = async (assetId: string) => {
    if (!user) {
      return;
    }

    try {
      await handleRemoveFromCartHook(assetId, user);
      // Update cart count after removing
      const token = localStorage.getItem('access_token');
      if (token) {
        const response = await fetch(
          apiUrl(`cart/${user.id}`),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const count = data.cart?.items?.length || 0;
          setInternalCartItemCount(count);
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateTheme = (dark: boolean) => {
    localStorage.setItem("dashboard-theme", dark ? "dark" : "light");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  useEffect(() => {
    // Check for OAuth redirect with token and user parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    const success = urlParams.get('success');

    console.log('OAuth parameters:', { token: !!token, userParam: !!userParam, success, user: !!user });

    if (success === 'true' && token && userParam) {
      try {
        // Parse user data from URL parameter
        const oauthUser = JSON.parse(decodeURIComponent(userParam));
        
        // Store JWT token and user data in localStorage
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(oauthUser));
        setUser(oauthUser);
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        console.log('Google OAuth login successful:', oauthUser);
        return; // Don't redirect to auth, let the user state update
      } catch (error) {
        console.error('Error parsing OAuth user data:', error);
      }
    }

    // Only redirect to auth if we don't have a user and we're not in the middle of OAuth processing
    if (!user || !user?.email) {
      // Check if we have stored user data in localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          return;
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
      router.push("/auth");
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      if (isMounted) {
        await fetchDashboardData();
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, router]); // Only depend on user.id, not the entire user object

  const fetchDashboardData = async () => {
    const controller: AbortController | null = null;
    const timeoutId: NodeJS.Timeout | null = null;

    try {
      const token = localStorage.getItem("access_token");
      
      // Get user ID
      let userId = user?.id;
      if (!userId && typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser?.id;
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }

      if (!token || !userId) {
        console.log("No access token or user ID found, using mock data");
        setStats({
          totalListings: 8,
          totalPurchases: 3,
          totalRevenue: 1040,
          pendingBookings: 2,
          activeListings: 6,
          totalViews: 1420,
        });
        setListings([]);
        setTransactions([]);
        return;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Fetch user data to get subscription_type and avatar_url
      try {
        const userResponse = await fetch(apiUrl(`users/${userId}`), { headers });
        if (userResponse.ok) {
          const fetchedUserData = await userResponse.json();
          setUserData(fetchedUserData); // Store full user data
          
          // Update user in context if subscription_type or avatar_url is available
          // Only update if values actually changed to prevent infinite loops
          if (user && setUser) {
            const hasChanges = 
              (fetchedUserData.subscription_type && fetchedUserData.subscription_type !== user.subscription_type) ||
              (fetchedUserData.avatar_url && fetchedUserData.avatar_url !== user.avatar_url) ||
              (fetchedUserData.display_name && fetchedUserData.display_name !== user.display_name);
            
            if (hasChanges) {
              const updatedUser = {
                ...user,
                subscription_type: fetchedUserData.subscription_type || user.subscription_type,
                avatar_url: fetchedUserData.avatar_url || user.avatar_url,
                display_name: fetchedUserData.display_name || user.display_name,
              };
              setUser(updatedUser);
              
              // Also update localStorage
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                try {
                  const parsedUser = JSON.parse(storedUser);
                  parsedUser.subscription_type = fetchedUserData.subscription_type || parsedUser.subscription_type;
                  parsedUser.avatar_url = fetchedUserData.avatar_url || parsedUser.avatar_url;
                  parsedUser.display_name = fetchedUserData.display_name || parsedUser.display_name;
                  localStorage.setItem('user', JSON.stringify(parsedUser));
                } catch (e) {
                  console.error('Error updating stored user:', e);
                }
              }
            }
          }
        }
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        // Continue with other fetches even if user fetch fails
      }

      // Fetch listings from all marketplaces
      const [assetsResponse, talentsResponse, studiosResponse, ticketsResponse, legalResponse, productServicesResponse] = await Promise.all([
        fetch(apiUrl(`assets/user/${userId}`), { headers }),
        fetch(apiUrl(`talents/user/${userId}`), { headers }),
        fetch(apiUrl(`studios/user/${userId}`), { headers }),
        fetch(apiUrl(`tickets/user/${userId}`), { headers }),
        fetch(apiUrl(`legal/user/${userId}`), { headers }),
        fetch(apiUrl(`product-services/user/${userId}`), { headers })
      ]);

      // Process responses and combine into unified listings
      const allListings: MarketplaceListing[] = [];

      // Process assets
      if (assetsResponse.ok) {
        try {
          const assetsData = await assetsResponse.json();
          const assets = Array.isArray(assetsData) ? assetsData : (assetsData?.data || []);
          if (Array.isArray(assets)) {
            assets.forEach((asset: any) => {
              allListings.push({
                id: asset.id.toString(),
                type: "asset",
                title: asset.title || 'Untitled Asset',
                price: parseFloat(asset.price) || 0,
                status: asset.status === 'active' ? "active" : "pending",
                views: 0, // Not available in current schema
                inquiries: 0, // Not available in current schema
                createdAt: asset.created_at || new Date().toISOString(),
                thumbnail: asset.preview_images?.[0] || asset.avatar_url,
                category: asset.category || 'Digital Art',
                subcategory: asset.tags?.[0] || 'General',
              });
            });
          }
        } catch (error) {
          console.error('Error processing assets:', error);
        }
      }

      // Process talents
      if (talentsResponse.ok) {
        const talents = await talentsResponse.json();
        talents.forEach((talent: any) => {
          allListings.push({
            id: talent.id.toString(),
            type: "talent",
            title: talent.title || 'Talent Service',
            price: parseFloat(talent.hourly_rate) || 0,
            status: talent.status === 'active' ? "active" : "pending",
            views: 0,
            inquiries: 0,
            createdAt: talent.created_at || new Date().toISOString(),
            thumbnail: talent.portfolio_urls?.[0] || talent.avatar_url,
            category: talent.category || 'Services',
            subcategory: talent.skills?.[0] || 'General',
          });
        });
      }

      // Process studios
      if (studiosResponse.ok) {
        const studios = await studiosResponse.json();
        studios.forEach((studio: any) => {
          allListings.push({
            id: studio.id.toString(),
            type: "studio",
            title: studio.name || 'Studio Space',
            price: 0, // Price not in current schema
            status: "active",
            views: 0,
            inquiries: 0,
            createdAt: studio.created_at || new Date().toISOString(),
            thumbnail: undefined,
            category: 'Studio',
            subcategory: studio.description || 'General',
          });
        });
      }

      // Process tickets
      if (ticketsResponse.ok) {
        try {
          const ticketsData = await ticketsResponse.json();
          const tickets = Array.isArray(ticketsData) ? ticketsData : (ticketsData?.data || []);
          if (Array.isArray(tickets)) {
            tickets.forEach((ticket: any) => {
              allListings.push({
                id: ticket.id.toString(),
                type: "ticket",
                title: ticket.title || 'Event Ticket',
                price: 0, // Price not in current schema
                status: ticket.status === 'open' ? "active" : "pending",
                views: 0,
                inquiries: 0,
                createdAt: ticket.created_at || new Date().toISOString(),
                thumbnail: undefined,
                category: ticket.ticket_type || 'Event',
                subcategory: 'General',
              });
            });
          }
        } catch (error) {
          console.error('Error processing tickets:', error);
        }
      }

      // Process legal services
      if (legalResponse.ok) {
        const legalServices = await legalResponse.json();
        legalServices.forEach((service: any) => {
          allListings.push({
            id: service.id.toString(),
            type: "legal",
            title: service.title || 'Legal Service',
            price: 0, // Price not in current schema
            status: "active",
            views: 0,
            inquiries: 0,
            createdAt: service.created_at || new Date().toISOString(),
            thumbnail: undefined,
            category: 'Legal',
            subcategory: service.description || 'General',
          });
        });
      }

      // Process product services
      if (productServicesResponse.ok) {
        const productServices = await productServicesResponse.json();
        productServices.forEach((service: any) => {
          allListings.push({
            id: service.id.toString(),
            type: "product_service",
            title: service.title || 'Product/Service',
            price: parseFloat(service.price) || 0,
            status: service.status === 'active' ? "active" : "pending",
            views: 0,
            inquiries: 0,
            createdAt: service.created_at || new Date().toISOString(),
            thumbnail: service.images?.[0] || service.avatar_url,
            category: service.category || 'General',
            subcategory: service.subcategory || 'General',
          });
        });
      }

      // Fetch stats from API
      try {
        const statsResponse = await fetch(apiUrl(`stats/user/${userId}`), { headers });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success && statsData.data) {
            setStats({
              totalListings: statsData.data.totalListings || 0,
              totalPurchases: 0, // Not available in current API
              totalRevenue: statsData.data.totalRevenue || 0,
              pendingBookings: statsData.data.pendingBookings || 0,
              activeListings: statsData.data.activeListings || 0,
              totalViews: statsData.data.totalViews || 0,
            });
          } else {
            // Fallback to calculated stats if API response is unexpected
            const totalListings = allListings.length;
            const activeListings = allListings.filter(l => l.status === 'active').length;
            const totalRevenue = allListings.reduce((sum, listing) => sum + listing.price, 0);
            const totalViews = allListings.reduce((sum, listing) => sum + listing.views, 0);
            setStats({
              totalListings,
              totalPurchases: 0,
              totalRevenue,
              pendingBookings: allListings.filter(l => l.status === 'pending').length,
              activeListings,
              totalViews,
            });
          }
        } else {
          // Fallback to calculated stats if API fails
          const totalListings = allListings.length;
          const activeListings = allListings.filter(l => l.status === 'active').length;
          const totalRevenue = allListings.reduce((sum, listing) => sum + listing.price, 0);
          const totalViews = allListings.reduce((sum, listing) => sum + listing.views, 0);
          setStats({
            totalListings,
            totalPurchases: 0,
            totalRevenue,
            pendingBookings: allListings.filter(l => l.status === 'pending').length,
            activeListings,
            totalViews,
          });
        }
      } catch (statsError) {
        console.warn("Error fetching stats from API, using calculated stats:", statsError);
        // Fallback to calculated stats
        const totalListings = allListings.length;
        const activeListings = allListings.filter(l => l.status === 'active').length;
        const totalRevenue = allListings.reduce((sum, listing) => sum + listing.price, 0);
        const totalViews = allListings.reduce((sum, listing) => sum + listing.views, 0);
        setStats({
          totalListings,
          totalPurchases: 0,
          totalRevenue,
          pendingBookings: allListings.filter(l => l.status === 'pending').length,
          activeListings,
          totalViews,
        });
      }

      setListings(allListings);

      // Mock transactions for now (not available in current API)
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

      setTransactions(mockTransactions);

    } catch (error) {
      console.warn("Error fetching dashboard data, using mock data:", error);
      // Fallback to mock data
      setStats({
        totalListings: 8,
        totalPurchases: 3,
        totalRevenue: 1040,
        pendingBookings: 2,
        activeListings: 6,
        totalViews: 1420,
      });
      setListings([]);
      setTransactions([]);
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

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <X className="w-4 h-4 text-red-500" />;
      case "message":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "order":
        return <ShoppingCart className="w-4 h-4 text-[#FF8D28]" />;
      case "collaboration":
        return <Users className="w-4 h-4 text-purple-500" />;
      case "system":
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsNotificationOpen(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

            <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 relative ${isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF8D28] rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={`w-96 p-0 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                align="end"
                sideOffset={5}
              >
                {/* Notification Header */}
                <div className={`p-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-title font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Notifications
                    </h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className={`text-xs ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                        >
                          Mark all read
                        </Button>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {unreadCount} new
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Notifications List */}
                <ScrollArea className="h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg mb-2 cursor-pointer transition-all hover:shadow-sm ${notification.isRead
                              ? isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                              : isDarkMode ? "bg-gray-700 border border-[#FF8D28]/30" : "bg-blue-50 border border-blue-200"
                            }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar or Icon */}
                            <div className="flex-shrink-0">
                              {notification.avatar ? (
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={notification.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {notification.title.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-600" : "bg-gray-200"
                                  }`}>
                                  {getNotificationIcon(notification.type)}
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}>
                                    {notification.title}
                                  </h4>
                                  <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                    }`}>
                                    {notification.message}
                                  </p>

                                  {/* Metadata */}
                                  {notification.metadata?.amount && (
                                    <div className="mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        ${notification.metadata.amount.toLocaleString()}
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Action Button */}
                                  {notification.actionLabel && notification.actionUrl && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-2 text-xs h-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleNotificationClick(notification);
                                      }}
                                    >
                                      {notification.actionLabel}
                                    </Button>
                                  )}
                                </div>

                                {/* Time and Actions */}
                                <div className="flex flex-col items-end gap-1">
                                  <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                    }`}>
                                    {notification.time}
                                  </span>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-[#FF8D28] rounded-full"></div>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className={`p-3 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-sm"
                      onClick={() => {
                        router.push("/dashboard/activity");
                        setIsNotificationOpen(false);
                      }}
                    >
                      View All Activity
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
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
              <AssetMarketplacePage 
                isDashboardDarkMode={isDarkMode}
                onAddToCart={onAddToCart || handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                cartItemCount={displayCartItemCount}
              />
            </div>
          </div>
        );
      case "talent-marketplace":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("talent-marketplace")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <TalentMarketplacePage isDashboardDarkMode={isDarkMode} />
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
              <TicketsMarketplacePage isDashboardDarkMode={isDarkMode} />
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
              <ProductServicesPage isDashboardDarkMode={isDarkMode} />
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
              <OrdersPage
                userId={user?.id || ''}
                userRole={(userRole || (user?.user_metadata?.is_artist ? 'artist' : 'user')) as "user" | "artist" | "collector"}
                isDashboardDarkMode={isDarkMode}
              />
            </div>
          </div>
        );
      case "cart":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("cart")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <CartPage
                userId={user?.id || ''}
                onProceedToCheckout={onProceedToCheckout || (() => { })}
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
      case "create-listing":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-listing")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <CreateListingPage isDashboardDarkMode={isDarkMode} />
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
      case "create-talent":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-talent")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <TalentListingForm />
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
              <InvestorListingForm />
            </div>
          </div>
        );
      case "create-ticket":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-ticket")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <TicketListingForm />
            </div>
          </div>
        );
      case "create-legal":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-legal")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              <LegalListingForm />
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
              <EducationListingForm />
            </div>
          </div>
        );
      case "create-ip":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("create-ip")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <IPCreationForm isDashboardDarkMode={isDarkMode} />
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
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <ActivityFeedPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "chat":
        return (
          <div className={`h-full w-full flex flex-col ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("chat")}
            <div className={`flex-1 overflow-hidden ${isDarkMode ? "bg-[#171717]" : ""}`}>
              <ChatPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "connections":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("connections")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <ConnectionsPage isDashboardDarkMode={isDarkMode} />
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

      case "ongoing-creation":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("ongoing-creation")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <OngoingCreationPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "ongoing-creation-detail":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            <OngoingCreationDetailPage isDashboardDarkMode={isDarkMode} />
          </div>
        );
      case "creations":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("creations")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <CreationsPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case "my-ogs":
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("my-ogs")}
            <div className={isDarkMode ? "bg-[#171717]" : ""}>
              <MyOGsPage isDashboardDarkMode={isDarkMode} />
            </div>
          </div>
        );
      default:
        return (
          <div className={`min-h-full w-full ${isDarkMode ? "bg-[#171717]" : ""}`}>
            {renderPageHeader("dashboard")}
            <div className={`p-6 ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}>
              {/* 1. Title */}
              <div className="mb-2">
                <h1 className={`font-title text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Welcome Back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
                </h1>
              </div>

              {/* 2. Sub title */}
              <div className="mb-8">
                <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Here's what's happening with your creative business today
                </p>
              </div>

              {/* 3. Action Alert */}
              <Card className={`mb-8 border-l-4 border-l-[#FF8D28] ${isDarkMode ? "bg-orange-900/20 border-orange-800 shadow-lg" : "bg-orange-50 border-orange-200 shadow-sm"}`}>
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
                          onClick={() => { }}
                        >
                          Remind Later
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Dashboard Stats Grid - 4 Stat cards */}
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

              {/* 5. Two Column Layout for 8 cards CTA section | Create CTA */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

                {/* Create New Listing CTA Section */}
                <Card className={`relative overflow-hidden border-2 border-gray-700 ${isDarkMode ? "bg-gradient-to-br from-purple-900/30 via-[#171717] to-orange-800/20 border-white" : "bg-gradient-to-br from-purple-100 via-white to-orange-200 border-gray-200"}`}>
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8D28]/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FF8D28]/5 rounded-full blur-2xl"></div>

                  <CardContent className="relative p-6">
                    <div className="flex flex-col space-y-4">
                      {/* Header Section */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="p-3 rounded-full bg-[#FF8D28]/20 border border-[#FF8D28]/30">
                              <Plus className="w-6 h-6 text-[#FF8D28]" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF8D28] rounded-full animate-pulse"></div>
                          </div>
                          <div>
                            <h3 className={`font-title text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                              Bring Your Ideas to Life ✨
                            </h3>
                            <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Create and protect your intellectual property with our comprehensive creation tools
                            </p>
                          </div>
                        </div>
                        <Button
                          size="lg"
                          className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl hover:bg-black transition-all duration-200 hover:scale-105"
                          onClick={() => router.push('/dashboard/create-ip')}
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Create Now
                        </Button>
                      </div>

                      {/* IP Creation Description */}
                      <div className="mt-6 p-4 rounded-lg bg-[#FF8D28]/5 border border-[#FF8D28]/10">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded bg-[#FF8D28]/10 mt-1">
                            <Lightbulb className="w-5 h-5 text-[#FF8D28]" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium text-base mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                              Your Creative IP Hub
                            </p>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Whether it's original artwork, innovative designs, creative concepts, or unique intellectual property,
                              this is your dedicated space to document, develop, and protect your creative assets. Build your
                              portfolio of ideas independent of any marketplace considerations.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom CTA Text */}
                      <div className={`text-center pt-2 border-t border-[#FF8D28]/20 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <p className="text-sm">
                          💡 <strong>Unlimited IP creation</strong> • Secure documentation • Build your creative legacy
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 6. Two Column Layout for Upcoming events | Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Upcoming Events */}
                <Card className={isDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
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
                <AvatarImage 
                  src={userData?.avatar_url || user?.avatar_url || user?.user_metadata?.avatar_url || ""} 
                  alt={userData?.display_name || user?.display_name || user?.email || "User"} 
                />
                <AvatarFallback className="bg-[#FF8D28] text-white">
                  {(userData?.display_name || user?.display_name || user?.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {userData?.display_name || user?.display_name || user?.user_metadata?.full_name || user?.email || "User"}
                </p>
                <p className={`text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {user?.email || "No email"}
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
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === item.id
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

