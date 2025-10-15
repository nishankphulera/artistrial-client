import React from 'react';
import { Button } from '../ui/button';
import { Grid, List } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description: string;
  createButtonText: string;
  onCreateClick: () => void;
  createButtonIcon?: React.ReactNode;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showViewToggle?: boolean;
  additionalActions?: React.ReactNode;
  isDashboardDarkMode?: boolean;
}

export function AdminHeader({
  title,
  description,
  createButtonText,
  onCreateClick,
  createButtonIcon,
  viewMode = 'grid',
  onViewModeChange,
  showViewToggle = true,
  additionalActions,
  isDashboardDarkMode = false
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
      <div className="flex-1">
        <h1 className={`mb-2 lg:mb-4 font-title text-2xl lg:text-3xl ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h1>
        <p className={`${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <Button onClick={onCreateClick} className="w-full sm:w-auto bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
          {createButtonIcon && <span className="mr-2">{createButtonIcon}</span>}
          {createButtonText}
        </Button>
        
        {additionalActions && (
          <div className="flex items-center gap-2">
            {additionalActions}
          </div>
        )}
        
        {showViewToggle && onViewModeChange && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

