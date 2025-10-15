import React from 'react';
import { Badge } from '../ui/badge';
import { Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface FeaturedArtist {
  id: string;
  name: string;
  avatar: string;
  topSkills: string[];
}

interface FeaturedArtistsProps {
  isDashboardDarkMode?: boolean;
  onArtistClick?: (artistId: string) => void;
}

export function FeaturedArtists({ 
  isDashboardDarkMode = false,
  onArtistClick
}: FeaturedArtistsProps) {
  // Mock featured artists data - simplified
  const featuredArtists: FeaturedArtist[] = [
    {
      id: 'artist-1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      topSkills: ['Portrait Photography', 'Fashion Photography', 'Studio Photography']
    },
    {
      id: 'artist-2',
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      topSkills: ['Brand Strategy', 'Visual Identity', 'Logo Design']
    },
    {
      id: 'artist-3',
      name: 'Elena Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      topSkills: ['Wedding Videography', 'Cinematic Storytelling', 'Drone Videography']
    },
    {
      id: 'artist-4',
      name: 'Alex Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      topSkills: ['Character Design', 'Digital Art', 'Game Art']
    },
    {
      id: 'artist-5',
      name: 'David Thompson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      topSkills: ['Motion Graphics', '3D Animation', 'VFX']
    },
    {
      id: 'artist-6',
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
      topSkills: ['UI/UX Design', 'Product Design', 'Prototyping']
    }
  ];

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
              {artist.topSkills.slice(0, 2).map((skill, index) => (
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
              {artist.topSkills.length > 2 && (
                <div className={`text-xs ${isDashboardDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  +{artist.topSkills.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

