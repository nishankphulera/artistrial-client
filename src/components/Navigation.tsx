'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Settings, ShoppingCart, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "@/components/providers/AuthProvider";
import { projectId } from "@/utils/supabase/info";

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Fetch cart count when user is logged in
  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const fetchCartCount = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/cart/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setCartItemCount(data.cart.items.length);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const baseNavItems = [
    // { path: '/', label: 'Home' },
    { path: "/community", label: "Community" },
    { path: "/marketplace/talent", label: "Talent" },
    { path: "/marketplace/assets", label: "Assets" },
    { path: "/marketplace/studios", label: "Studios" },
    { path: "/marketplace/investors", label: "Investors" },
    { path: "/marketplace/tickets", label: "Tickets" },
    { path: "/marketplace/legal", label: "Legal" },
    { path: "/marketplace/products", label: "Products" },
    { path: "/education", label: "Education" },
  ];

  const primaryNavItems = baseNavItems;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            
            <span className="text-xl font-bold text-gray-900 font-title">
              Artistrial
            </span>
          </Link>

          {/* Spacer for center alignment */}
          <div className="flex-1"></div>

          {/* Navigation Items - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  isActive(item.path)
                    ? "text-[#FF8D28] bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push("/dashboard")}
                  className="group flex items-center space-x-2 bg-black hover:bg-gray-800 text-white transition-colors duration-200 ease-in-out"
                >
                  <LayoutDashboard className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
                  <span className="transition-transform duration-200 ease-in-out group-hover:translate-x-1">Dashboard</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/cart")}
                  className="relative flex items-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0 min-w-0">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/auth")}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/auth?mode=signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            {/* Mobile Navigation */}
            <div className="space-y-2">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? "text-[#FF8D28] bg-orange-50"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-[#FF8D28] hover:bg-[#E67E22] mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/cart"
                    className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs rounded-full">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

