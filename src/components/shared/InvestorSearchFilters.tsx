import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, ChevronDown, TrendingUp, Building, Users, DollarSign, Globe } from 'lucide-react';
import { FilterState } from './FilterSidebar';

export interface InvestorCategoryStructure {
  [key: string]: {
    label: string;
    icon: React.ReactNode;
    subcategories: { value: string; label: string }[];
  };
}

export interface InvestorSearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isDarkMode?: boolean;
  layoutConfig?: {
    categorySpan: string;
    subcategorySpan: string;
    searchSpan: string;
  };
  placeholder?: string;
  showActiveFilters?: boolean;
  filterType?: 'investors' | 'projects';
}

// Default category structures for investor marketplace
const defaultInvestorCategoryStructure: InvestorCategoryStructure = {
  angel: {
    label: 'Angel Investors',
    icon: <Users className="h-4 w-4" />,
    subcategories: [
      { value: 'individual', label: 'Individual Angels' },
      { value: 'group', label: 'Angel Groups' },
      { value: 'network', label: 'Angel Networks' },
      { value: 'accredited', label: 'Accredited Investors' },
      { value: 'strategic', label: 'Strategic Angels' }
    ]
  },
  vc_fund: {
    label: 'VC Funds',
    icon: <Building className="h-4 w-4" />,
    subcategories: [
      { value: 'micro', label: 'Micro VCs' },
      { value: 'early_stage', label: 'Early Stage VCs' },
      { value: 'growth', label: 'Growth Stage VCs' },
      { value: 'late_stage', label: 'Late Stage VCs' },
      { value: 'corporate', label: 'Corporate VCs' }
    ]
  },
  art_fund: {
    label: 'Art Funds',
    icon: <TrendingUp className="h-4 w-4" />,
    subcategories: [
      { value: 'contemporary', label: 'Contemporary Art' },
      { value: 'digital', label: 'Digital Art Funds' },
      { value: 'photography', label: 'Photography Funds' },
      { value: 'collectibles', label: 'Art Collectibles' },
      { value: 'nft', label: 'NFT Funds' }
    ]
  },
  private: {
    label: 'Private Investors',
    icon: <DollarSign className="h-4 w-4" />,
    subcategories: [
      { value: 'family_office', label: 'Family Offices' },
      { value: 'hedge_fund', label: 'Hedge Funds' },
      { value: 'pension', label: 'Pension Funds' },
      { value: 'sovereign', label: 'Sovereign Wealth' },
      { value: 'endowment', label: 'Endowments' }
    ]
  },
  corporate: {
    label: 'Corporate Investors',
    icon: <Globe className="h-4 w-4" />,
    subcategories: [
      { value: 'strategic', label: 'Strategic Corporate' },
      { value: 'media', label: 'Media Companies' },
      { value: 'tech', label: 'Tech Companies' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'publishing', label: 'Publishing' }
    ]
  }
};

const defaultProjectCategoryStructure: InvestorCategoryStructure = {
  digital_art: {
    label: 'Digital Art',
    icon: <TrendingUp className="h-4 w-4" />,
    subcategories: [
      { value: 'platforms', label: 'Art Platforms' },
      { value: 'nft', label: 'NFT Projects' },
      { value: 'vr_ar', label: 'VR/AR Art' },
      { value: 'ai_art', label: 'AI Art Tools' },
      { value: 'blockchain', label: 'Blockchain Art' }
    ]
  },
  photography: {
    label: 'Photography',
    icon: <Building className="h-4 w-4" />,
    subcategories: [
      { value: 'stock', label: 'Stock Photography' },
      { value: 'marketplace', label: 'Photo Marketplaces' },
      { value: 'tools', label: 'Photo Tools' },
      { value: 'services', label: 'Photo Services' },
      { value: 'education', label: 'Photo Education' }
    ]
  },
  music: {
    label: 'Music',
    icon: <Users className="h-4 w-4" />,
    subcategories: [
      { value: 'streaming', label: 'Music Streaming' },
      { value: 'production', label: 'Music Production' },
      { value: 'distribution', label: 'Music Distribution' },
      { value: 'discovery', label: 'Music Discovery' },
      { value: 'licensing', label: 'Music Licensing' }
    ]
  },
  film: {
    label: 'Film & Video',
    icon: <DollarSign className="h-4 w-4" />,
    subcategories: [
      { value: 'production', label: 'Film Production' },
      { value: 'streaming', label: 'Video Streaming' },
      { value: 'post_production', label: 'Post-Production' },
      { value: 'animation', label: 'Animation' },
      { value: 'documentary', label: 'Documentary' }
    ]
  },
  technology: {
    label: 'Art Technology',
    icon: <Globe className="h-4 w-4" />,
    subcategories: [
      { value: 'creation_tools', label: 'Creation Tools' },
      { value: 'collaboration', label: 'Collaboration Platforms' },
      { value: 'marketplace', label: 'Art Marketplaces' },
      { value: 'analytics', label: 'Art Analytics' },
      { value: 'education', label: 'Art EdTech' }
    ]
  }
};

export function InvestorSearchFilters({
  filters,
  onFiltersChange,
  isDarkMode = false,
  layoutConfig = {
    categorySpan: 'lg:col-span-3',
    subcategorySpan: 'lg:col-span-3',
    searchSpan: 'lg:col-span-6'
  },
  placeholder = 'Search investors, companies, or focus areas...',
  showActiveFilters = true,
  filterType = 'investors'
}: InvestorSearchFiltersProps) {

  const categoryStructure = filterType === 'investors' 
    ? defaultInvestorCategoryStructure 
    : defaultProjectCategoryStructure;

  // Get subcategories for the selected main categories
  const getSubcategories = () => {
    if (!Array.isArray(filters.category) || filters.category.length === 0) {
      return [];
    }
    
    const allSubcategories: { value: string; label: string }[] = [];
    filters.category.forEach(category => {
      const categoryData = categoryStructure[category as keyof typeof categoryStructure];
      if (categoryData && categoryData.subcategories) {
        allSubcategories.push(...categoryData.subcategories);
      }
    });
    
    // Remove duplicates
    const uniqueSubcategories = allSubcategories.filter((subcategory, index, self) => 
      index === self.findIndex(s => s.value === subcategory.value)
    );
    
    return uniqueSubcategories;
  };

  // Handle multi-select category changes
  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    const currentCategories = Array.isArray(filters.category) ? filters.category : [];
    
    let newCategories;
    if (checked) {
      newCategories = [...currentCategories, categoryValue];
    } else {
      newCategories = currentCategories.filter(cat => cat !== categoryValue);
    }
    
    onFiltersChange({
      ...filters,
      category: newCategories,
      subcategory: [] // Reset subcategories when categories change
    });
  };

  // Handle multi-select subcategory changes
  const handleSubcategoryChange = (subcategoryValue: string, checked: boolean) => {
    const currentSubcategories = Array.isArray(filters.subcategory) ? filters.subcategory : [];
    
    let newSubcategories;
    if (checked) {
      newSubcategories = [...currentSubcategories, subcategoryValue];
    } else {
      newSubcategories = currentSubcategories.filter(sub => sub !== subcategoryValue);
    }
    
    onFiltersChange({
      ...filters,
      subcategory: newSubcategories
    });
  };

  // Convert categoryStructure to filterConfig format  
  const categories = Object.entries(categoryStructure).map(([key, category]) => ({
    value: key,
    label: category.label,
    icon: category.icon,
  }));

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4 sm:p-6 mb-6 space-y-4`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Main Category Filter - Multi-select */}
        <div className={`sm:col-span-1 ${layoutConfig.categorySpan}`}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal"
              >
                {Array.isArray(filters.category) && filters.category.length > 0
                  ? `${filters.category.length} categories selected`
                  : "All Categories"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`p-0 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`} align="start">
              <div className="p-4 space-y-2">
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                  {categories.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.value}`}
                        checked={Array.isArray(filters.category) && filters.category.includes(category.value)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.value, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`category-${category.value}`}
                        className={`flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                      >
                        {category.icon}
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Subcategory Filter - Multi-select */}
        <div className={`sm:col-span-1 ${layoutConfig.subcategorySpan}`}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal"
                disabled={!Array.isArray(filters.category) || filters.category.length === 0 || getSubcategories().length === 0}
              >
                {Array.isArray(filters.subcategory) && filters.subcategory.length > 0
                  ? `${filters.subcategory.length} subcategories selected`
                  : "All Subcategories"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`p-0 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`} align="start">
              <div className="p-4 space-y-2">
                <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                  {Array.isArray(filters.category) && filters.category.map((categoryValue) => {
                    const categoryData = categoryStructure[categoryValue as keyof typeof categoryStructure];
                    if (!categoryData || !categoryData.subcategories) return null;
                    
                    return (
                      <div key={categoryValue} className="space-y-2">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {categoryData.label}
                        </h5>
                        <div className="space-y-2 pl-2">
                          {categoryData.subcategories.map((subcategory) => (
                            <div key={subcategory.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`subcategory-${subcategory.value}`}
                                checked={Array.isArray(filters.subcategory) && filters.subcategory.includes(subcategory.value)}
                                onCheckedChange={(checked) =>
                                  handleSubcategoryChange(subcategory.value, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`subcategory-${subcategory.value}`}
                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                              >
                                {subcategory.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Input */}
        <div className={`sm:col-span-2 ${layoutConfig.searchSpan}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={filters.searchTerm}
              onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {showActiveFilters && (filters.searchTerm || 
        (Array.isArray(filters.category) && filters.category.length > 0) || 
        (Array.isArray(filters.subcategory) && filters.subcategory.length > 0)) && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.searchTerm}
                <button onClick={() => onFiltersChange({...filters, searchTerm: ''})} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
            {Array.isArray(filters.category) && filters.category.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1">
                {categories.find(c => c.value === category)?.label || category}
                <button 
                  onClick={() => handleCategoryChange(category, false)} 
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
            {Array.isArray(filters.subcategory) && filters.subcategory.map((subcategory) => (
              <Badge key={subcategory} variant="secondary" className="gap-1">
                {getSubcategories().find(s => s.value === subcategory)?.label || subcategory}
                <button 
                  onClick={() => handleSubcategoryChange(subcategory, false)} 
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

