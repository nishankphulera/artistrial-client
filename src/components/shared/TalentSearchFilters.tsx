import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, ChevronDown, Camera, Video, Palette, Music, FileText, Mic } from 'lucide-react';
import { FilterState } from './FilterSidebar';

export interface CategoryStructure {
  [key: string]: {
    label: string;
    icon: React.ReactNode;
    subcategories: { value: string; label: string }[];
  };
}

export interface TalentSearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isDarkMode?: boolean;
  layoutConfig?: {
    categorySpan: string;
    subcategorySpan: string;
    searchSpan: string;
  };
  placeholder?: string;
}

// Default category structure for talent marketplace
const defaultCategoryStructure: CategoryStructure = {
  photographer: {
    label: 'Photography',
    icon: <Camera className="h-4 w-4" />,
    subcategories: [
      { value: 'portrait', label: 'Portrait Photography' },
      { value: 'wedding', label: 'Wedding Photography' },
      { value: 'commercial', label: 'Commercial Photography' },
      { value: 'fashion', label: 'Fashion Photography' },
      { value: 'event', label: 'Event Photography' },
      { value: 'product', label: 'Product Photography' },
    ],
  },
  video: {
    label: 'Video Production',
    icon: <Video className="h-4 w-4" />,
    subcategories: [
      { value: 'corporate', label: 'Corporate Video' },
      { value: 'wedding', label: 'Wedding Videography' },
      { value: 'music', label: 'Music Videos' },
      { value: 'documentary', label: 'Documentary' },
      { value: 'commercial', label: 'Commercial Video' },
      { value: 'editing', label: 'Video Editing' },
    ],
  },
  artist: {
    label: 'Digital Art',
    icon: <Palette className="h-4 w-4" />,
    subcategories: [
      { value: 'illustration', label: 'Digital Illustration' },
      { value: 'character', label: 'Character Design' },
      { value: 'concept', label: 'Concept Art' },
      { value: 'ui', label: 'UI/UX Design' },
      { value: '3d', label: '3D Modeling' },
    ],
  },
  music: {
    label: 'Music Production',
    icon: <Music className="h-4 w-4" />,
    subcategories: [
      { value: 'recording', label: 'Recording' },
      { value: 'mixing', label: 'Mixing & Mastering' },
      { value: 'composition', label: 'Music Composition' },
      { value: 'sound', label: 'Sound Design' },
    ],
  },
  designer: {
    label: 'Graphic Design',
    icon: <Palette className="h-4 w-4" />,
    subcategories: [
      { value: 'logo', label: 'Logo Design' },
      { value: 'web', label: 'Web Design' },
      { value: 'print', label: 'Print Design' },
      { value: 'branding', label: 'Brand Identity' },
      { value: 'packaging', label: 'Packaging Design' },
    ],
  },
  writer: {
    label: 'Writing',
    icon: <FileText className="h-4 w-4" />,
    subcategories: [
      { value: 'copy', label: 'Copywriting' },
      { value: 'content', label: 'Content Writing' },
      { value: 'technical', label: 'Technical Writing' },
      { value: 'creative', label: 'Creative Writing' },
      { value: 'script', label: 'Scriptwriting' },
    ],
  },
  voice: {
    label: 'Voice Over',
    icon: <Mic className="h-4 w-4" />,
    subcategories: [
      { value: 'commercial', label: 'Commercial VO' },
      { value: 'narration', label: 'Narration' },
      { value: 'character', label: 'Character Voices' },
      { value: 'audiobook', label: 'Audiobook Narration' },
    ],
  },
};

export function TalentSearchFilters({
  filters,
  onFiltersChange,
  isDarkMode = false,
  layoutConfig = {
    categorySpan: 'lg:col-span-2',
    subcategorySpan: 'lg:col-span-3', 
    searchSpan: 'lg:col-span-6'
  },
  placeholder = 'Search talents by name, profession, or skills...'
}: TalentSearchFiltersProps) {

  // Get subcategories for the selected main categories
  const getSubcategories = () => {
    if (!Array.isArray(filters.category) || filters.category.length === 0) {
      return [];
    }
    
    const allSubcategories: { value: string; label: string }[] = [];
    filters.category.forEach(category => {
      const categoryData = defaultCategoryStructure[category as keyof typeof defaultCategoryStructure];
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
  const categories = Object.entries(defaultCategoryStructure).map(([key, category]) => ({
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
                    const categoryData = defaultCategoryStructure[categoryValue as keyof typeof defaultCategoryStructure];
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
    </div>
  );
}

