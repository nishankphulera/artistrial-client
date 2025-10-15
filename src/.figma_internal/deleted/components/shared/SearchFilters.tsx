import React from 'react';
import { Search, Filter, MapPin, DollarSign } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export interface FilterConfig {
  categories?: { value: string; label: string }[];
  locations?: { value: string; label: string }[];
  priceRange?: { min: number; max: number };
  availability?: boolean;
  rating?: boolean;
  customFilters?: {
    name: string;
    options: { value: string; label: string }[];
  }[];
}

export interface FilterState {
  searchTerm: string;
  category: string;
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
  [key: string]: any;
}

interface SearchFiltersProps {
  config: FilterConfig;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  placeholder?: string;
  showAdvanced?: boolean;
  resultCount?: number;
}

export function SearchFilters({
  config,
  filters,
  onFiltersChange,
  placeholder = "Search...",
  showAdvanced = true,
  resultCount
}: SearchFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      category: 'all',
      location: 'all',
      priceRange: config.priceRange ? [config.priceRange.min, config.priceRange.max] : [0, 1000],
      availability: 'all',
      minRating: 0,
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.searchTerm ||
      filters.category !== 'all' ||
      filters.location !== 'all' ||
      filters.availability !== 'all' ||
      filters.minRating > 0 ||
      (config.priceRange && (
        filters.priceRange[0] !== config.priceRange.min ||
        filters.priceRange[1] !== config.priceRange.max
      ))
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.category !== 'all') count++;
    if (filters.location !== 'all') count++;
    if (filters.availability !== 'all') count++;
    if (filters.minRating > 0) count++;
    if (config.priceRange && (
      filters.priceRange[0] !== config.priceRange.min ||
      filters.priceRange[1] !== config.priceRange.max
    )) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      {/* Main Search Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={placeholder}
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        {config.categories && (
          <div className="md:col-span-2">
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {config.categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Location Filter */}
        {config.locations && (
          <div className="md:col-span-2">
            <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {config.locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sort */}
        <div className="md:col-span-2">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Button */}
        {showAdvanced && (
          <div className="md:col-span-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="h-4 w-4" />
                  {getActiveFilterCount() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h3 className="font-medium">Advanced Filters</h3>

                  {/* Price Range */}
                  {config.priceRange && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price Range
                      </label>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => updateFilter('priceRange', value)}
                        max={config.priceRange.max}
                        min={config.priceRange.min}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {config.availability && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Availability</label>
                      <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Minimum Rating */}
                  {config.rating && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Minimum Rating</label>
                      <Select value={filters.minRating.toString()} onValueChange={(value) => updateFilter('minRating', parseInt(value))}>
                        <SelectTrigger>
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
                      <label className="text-sm font-medium">{customFilter.name}</label>
                      <Select
                        value={filters[customFilter.name] || 'all'}
                        onValueChange={(value) => updateFilter(customFilter.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {customFilter.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}

                  {/* Clear Filters */}
                  {hasActiveFilters() && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.searchTerm}
                <button onClick={() => updateFilter('searchTerm', '')} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
            {filters.category !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {config.categories?.find(c => c.value === filters.category)?.label || filters.category}
                <button onClick={() => updateFilter('category', 'all')} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
            {filters.location !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {config.locations?.find(l => l.value === filters.location)?.label || filters.location}
                <button onClick={() => updateFilter('location', 'all')} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
          </div>
          
          {resultCount !== undefined && (
            <span className="text-sm text-muted-foreground ml-auto">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

