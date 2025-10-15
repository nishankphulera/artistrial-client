import React from "react";
import {
  Filter,
  MapPin,
  DollarSign,
  Star,
  Users,
  Clock,
  Camera,
  Mic,
  Palette,
  Building,
  Briefcase,
  Eye,
  Heart,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface FilterConfig {
  categories?: {
    value: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  locations?: { value: string; label: string }[];
  priceRange?: { min: number; max: number };
  availability?: boolean;
  rating?: boolean;
  customFilters?: {
    name: string;
    type: "select" | "slider" | "checkbox";
    options?: { value: string; label: string }[];
    range?: { min: number; max: number };
  }[];
  moduleType:
    | "talent"
    | "assets"
    | "studios"
    | "investors"
    | "tickets"
    | "legal";
}

export interface FilterState {
  searchTerm?: string;
  category: string | string[];
  subcategory?: string | string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
  [key: string]: any;
}

interface FilterSidebarProps {
  config: FilterConfig;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount?: number;
  isDashboardDarkMode?: boolean;
}

export function FilterSidebar({
  config,
  filters,
  onFiltersChange,
  resultCount,
  isDashboardDarkMode = false,
}: FilterSidebarProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      location: "all",
      subcategory: "all",
      priceRange: config.priceRange
        ? [config.priceRange.min, config.priceRange.max]
        : [0, 1000],
      availability: "all",
      minRating: 0,
      sortBy: "newest",
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.location !== "all" ||
      filters.availability !== "all" ||
      filters.minRating > 0 ||
      (filters.subcategory && filters.subcategory !== "all") ||
      (config.priceRange &&
        (filters.priceRange[0] !== config.priceRange.min ||
          filters.priceRange[1] !== config.priceRange.max))
    );
  };

  const getModuleTitle = () => {
    switch (config.moduleType) {
      case "talent":
        return "Find Talent";
      case "assets":
        return "Browse Assets";
      case "studios":
        return "Book Studios";
      case "investors":
        return "Connect with Investors";
      case "tickets":
        return "Find Events";
      case "legal":
        return "Legal Services";
      default:
        return "Filters";
    }
  };

  const getModuleIcon = () => {
    switch (config.moduleType) {
      case "talent":
        return <Users className="h-5 w-5" />;
      case "assets":
        return <Eye className="h-5 w-5" />;
      case "studios":
        return <Building className="h-5 w-5" />;
      case "investors":
        return <DollarSign className="h-5 w-5" />;
      case "tickets":
        return <Camera className="h-5 w-5" />;
      case "legal":
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Filter className="h-5 w-5" />;
    }
  };

  return (
    <div
      className={`w-80 h-full ${isDashboardDarkMode ? "bg-[#171717] border-gray-700 text-white" : "bg-white border-gray-200"} border-r overflow-y-auto scrollbar-hide`}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          {getModuleIcon()}
          <h2
            className={`font-title text-xl ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}
          >
            {getModuleTitle()}
          </h2>
        </div>

        {/* Location */}
        {config.locations && (
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}
            >
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Select
              value={filters.location}
              onValueChange={(value) =>
                updateFilter("location", value)
              }
            >
              <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Locations
                </SelectItem>
                {config.locations.map((location) => (
                  <SelectItem
                    key={location.value}
                    value={location.value}
                  >
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Range */}
        {config.priceRange && (
          <div className="space-y-3">
            <label className={`block text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
              <DollarSign className="h-4 w-4" />
              Price Range
            </label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) =>
                updateFilter("priceRange", value)
              }
              max={config.priceRange.max}
              min={config.priceRange.min}
              step={config.moduleType === "assets" ? 5 : 10}
              className="w-full"
            />
            <div className={`flex justify-between text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        )}

        {/* Availability */}
        {config.availability && (
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
              <Clock className="h-4 w-4" />
              Availability
            </label>
            <Select
              value={filters.availability}
              onValueChange={(value) =>
                updateFilter("availability", value)
              }
            >
              <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">
                  Available
                </SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="unavailable">
                  Unavailable
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Rating */}
        {config.rating && (
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
              <Star className="h-4 w-4" />
              Minimum Rating
            </label>
            <Select
              value={filters.minRating.toString()}
              onValueChange={(value) =>
                updateFilter("minRating", parseInt(value))
              }
            >
              <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any Rating</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="5">5 Stars Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Custom Filters */}
        {config.customFilters?.map((customFilter) => (
          <div key={customFilter.name} className="space-y-2">
            <label className={`block text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {customFilter.name}
            </label>
            {customFilter.type === "select" &&
              customFilter.options && (
                <Select
                  value={filters[customFilter.name] || "all"}
                  onValueChange={(value) =>
                    updateFilter(customFilter.name, value)
                  }
                >
                  <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {customFilter.options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            {customFilter.type === "slider" &&
              customFilter.range && (
                <>
                  <Slider
                    value={
                      filters[customFilter.name] || [
                        customFilter.range.min,
                        customFilter.range.max,
                      ]
                    }
                    onValueChange={(value) =>
                      updateFilter(customFilter.name, value)
                    }
                    max={customFilter.range.max}
                    min={customFilter.range.min}
                    step={1}
                    className="w-full"
                  />
                  <div className={`flex justify-between text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <span>
                      {
                        (filters[customFilter.name] || [
                          customFilter.range.min,
                        ])[0]
                      }
                    </span>
                    <span>
                      {
                        (filters[customFilter.name] || [
                          customFilter.range.min,
                          customFilter.range.max,
                        ])[1]
                      }
                    </span>
                  </div>
                </>
              )}
          </div>
        ))}

        <Separator />

        {/* Sort */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              updateFilter("sortBy", value)
            }
          >
            <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                Newest First
              </SelectItem>
              <SelectItem value="oldest">
                Oldest First
              </SelectItem>
              <SelectItem value="price_low">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price_high">
                Price: High to Low
              </SelectItem>
              <SelectItem value="rating">
                Highest Rated
              </SelectItem>
              <SelectItem value="popular">
                Most Popular
              </SelectItem>
              {config.moduleType === "talent" && (
                <SelectItem value="experience">
                  Most Experienced
                </SelectItem>
              )}
              {config.moduleType === "assets" && (
                <SelectItem value="trending">
                  Trending
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        
      </div>
    </div>
  );
}

