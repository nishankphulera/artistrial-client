import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTalentData, TalentProfile } from './data/TalentDataService';


interface FeaturedArtistsProps {
  isDashboardDarkMode?: boolean;
  onArtistClick?: (artistId: string) => void;
}

export function FeaturedArtists({ 
  isDashboardDarkMode = false,
  onArtistClick
}: FeaturedArtistsProps) {
  const [featuredArtists, setFeaturedArtists] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchTalentProfiles } = useTalentData();

  // Fetch featured artists data from API
  useEffect(() => {
    const loadFeaturedArtists = async () => {
      try {
        setLoading(true);
        console.log('Loading featured artists...');
        // Fetch talents and take first 6 as featured artists
        const talents = await fetchTalentProfiles(
          { 
            sortBy: 'rating' // Get highest rated talents as featured artists
          },
          { context: 'public' }
        );
        
        console.log('Fetched artists:', talents);
        // Take first 6 talents as featured artists
        const featured = talents.slice(0, 6);
        console.log('Featured artists:', featured);
        setFeaturedArtists(featured);
      } catch (error) {
        console.error('Error loading featured artists:', error);
        // Fallback to empty array if API fails
        setFeaturedArtists([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedArtists();
  }, []); // Remove fetchTalentProfiles from dependencies to avoid infinite re-renders

  const handleArtistClick = (artistId: string) => {
    if (onArtistClick) {
      onArtistClick(artistId);
    }
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-title text-2xl mb-2">Featured Artists</h2>
          <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Top-rated creative professionals with proven expertise
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-[#FF8D28]" />
          <Badge variant="secondary" className="bg-[#FF8D28]/10 text-[#FF8D28] border-[#FF8D28]/20">
            Top Talent
          </Badge>
        </div>
      </div>

      {/* Featured Artists Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8D28] mx-auto mb-4"></div>
            <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading featured artists...
            </p>
          </div>
        </div>
      ) : featuredArtists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredArtists.map((artist) => (
            <div 
              key={artist.id}
              className={`group cursor-pointer p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center ${
                isDashboardDarkMode 
                  ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750' 
                  : 'bg-white border border-gray-200 hover:shadow-xl'
              }`}
              onClick={() => handleArtistClick(artist.id)}
            >
              {/* Artist Avatar */}
              <div className="mb-3">
                <Avatar className="h-16 w-16 mx-auto ring-2 ring-[#FF8D28]/20 group-hover:ring-[#FF8D28]/40 transition-all">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback className="bg-[#FF8D28]/10 text-[#FF8D28]">
                    {artist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Artist Name */}
              <h3 className={`font-title text-sm mb-3 truncate ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {artist.name}
              </h3>

              {/* Top Skills */}
              <div className="space-y-1">
                {artist.skills.slice(0, 2).map((skill, index) => (
                  <div 
                    key={index}
                    className={`text-xs px-2 py-1 rounded ${
                      index === 0 
                        ? 'bg-[#FF8D28]/10 text-[#FF8D28]' 
                        : isDashboardDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {skill}
                  </div>
                ))}
                {artist.skills.length > 2 && (
                  <div className={`text-xs ${isDashboardDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    +{artist.skills.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No featured artists available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}

