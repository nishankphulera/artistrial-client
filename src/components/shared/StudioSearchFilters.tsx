import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, ChevronDown, Camera, Mic, Palette, Building, Film } from 'lucide-react';
import { FilterState } from './FilterSidebar';

export interface StudioCategoryStructure {
  [key: string]: {
    label: string;
    icon: React.ReactNode;
    subcategories: { value: string; label: string }[];
  };
}

export interface StudioSearchFiltersProps {
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
  resultCount?: number;
}

// Default category structure for studio marketplace
const defaultStudioCategoryStructure: StudioCategoryStructure = {
  photography: {
    label: 'Photography Studios',
    icon: <Camera className="h-4 w-4" />,
    subcategories: [
      { value: 'portrait', label: 'Portrait Studio' },
      { value: 'fashion', label: 'Fashion Studio' },
      { value: 'product', label: 'Product Photography' },
      { value: 'event', label: 'Event Photography' },
      { value: 'commercial', label: 'Commercial Studio' }
    ]
  },
  recording: {
    label: 'Recording Studios',
    icon: <Mic className="h-4 w-4" />,
    subcategories: [
      { value: 'music', label: 'Music Recording' },
      { value: 'podcast', label: 'Podcast Studio' },
      { value: 'voiceover', label: 'Voice Over Studio' },
      { value: 'live', label: 'Live Recording' },
      { value: 'mixing', label: 'Mixing & Mastering' }
    ]
  },
  art: {
    label: 'Art Studios',
    icon: <Palette className="h-4 w-4" />,
    subcategories: [
      { value: 'painting', label: 'Painting Studio' },
      { value: 'sculpture', label: 'Sculpture Studio' },
      { value: 'pottery', label: 'Pottery Studio' },
      { value: 'printmaking', label: 'Printmaking Studio' },
      { value: 'mixed_media', label: 'Mixed Media Studio' }
    ]
  },
  video: {
    label: 'Video Production',
    icon: <Film className="h-4 w-4" />,
    subcategories: [
      { value: 'film', label: 'Film Production' },
      { value: 'commercial', label: 'Commercial Video' },
      { value: 'green_screen', label: 'Green Screen Studio' },
      { value: 'streaming', label: 'Live Streaming' },
      { value: 'editing', label: 'Post-Production' }
    ]
  },
  multipurpose: {
    label: 'Multi-Purpose Spaces',
    icon: <Building className="h-4 w-4" />,
    subcategories: [
      { value: 'event', label: 'Event Space' },
      { value: 'workshop', label: 'Workshop Space' },
      { value: 'exhibition', label: 'Exhibition Space' },
      { value: 'rehearsal', label: 'Rehearsal Space' },
      { value: 'coworking', label: 'Creative Coworking' }
    ]
  }
};

export function StudioSearchFilters({
  filters,
  onFiltersChange,
  isDarkMode = false,
  layoutConfig = {
    categorySpan: 'lg:col-span-2',
    subcategorySpan: 'lg:col-span-2',
    searchSpan: 'lg:col-span-8'
  },
  placeholder = 'Search studios, equipment, or features...',
  showActiveFilters = true,
  resultCount = 0
}: StudioSearchFiltersProps) {

  // Get subcategories for the selected main categories
  const getSubcategories = () => {
    if (!Array.isArray(filters.category) || filters.category.length === 0) {
      return [];
    }
    
    const allSubcategories: { value: string; label: string }[] = [];
    filters.category.forEach(category => {
      const categoryData = defaultStudioCategoryStructure[category as keyof typeof defaultStudioCategoryStructure];
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
  const categories = Object.entries(defaultStudioCategoryStructure).map(([key, category]) => ({
    value: key,
    label: category.label,
    icon: category.icon,
  }));

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4 sm:p-6 mb-6 lg:mb-8 space-y-4`}>
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
                    const categoryData = defaultStudioCategoryStructure[categoryValue as keyof typeof defaultStudioCategoryStructure];
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
          
          <span className="text-sm text-muted-foreground ml-auto">
            {resultCount} result{resultCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

