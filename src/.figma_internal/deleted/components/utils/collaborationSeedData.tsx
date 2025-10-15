import { projectId } from '../../utils/supabase/info';

export const seedDemoCollaborations = async (userToken: string) => {
  const demoCollaborations = [
    {
      id: 'collab-1',
      title: 'Wedding Shoot Campaign',
      description: 'Looking for talented professionals for a luxury wedding campaign shoot in Napa Valley',
      creatorId: 'demo-creator-1',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'active',
    },
    {
      id: 'collab-2',
      title: 'Fashion Brand Lookbook',
      description: 'Creating a spring/summer lookbook for emerging fashion brand',
      creatorId: 'demo-creator-2',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      status: 'active',
    },
    {
      id: 'collab-3',
      title: 'Music Video Production',
      description: 'Independent artist seeking creative team for music video production',
      creatorId: 'demo-creator-3',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      status: 'active',
    }
  ];

  const demoRequirements = [
    // Wedding Shoot Campaign requirements
    {
      id: 'req-1',
      collaborationId: 'collab-1',
      role: 'Photographer',
      quantityNeeded: 2,
      quantityFilled: 1,
      budget: '$800-1200 per day',
      timing: 'June 15-16, 2024',
      location: 'Napa Valley, CA',
      skills: ['Wedding Photography', 'Portrait Photography', 'Adobe Lightroom'],
      description: 'Experienced wedding photographer needed for luxury campaign shoot',
      status: 'open',
    },
    {
      id: 'req-2',
      collaborationId: 'collab-1',
      role: 'Makeup Artist',
      quantityNeeded: 1,
      quantityFilled: 0,
      budget: '$500-700 per day',
      timing: 'June 15-16, 2024',
      location: 'Napa Valley, CA',
      skills: ['Bridal Makeup', 'Editorial Makeup', 'Airbrush'],
      description: 'Professional makeup artist for bridal and editorial looks',
      status: 'open',
    },
    {
      id: 'req-3',
      collaborationId: 'collab-1',
      role: 'Videographer',
      quantityNeeded: 1,
      quantityFilled: 1,
      budget: '$1000-1500 per day',
      timing: 'June 15-16, 2024',
      location: 'Napa Valley, CA',
      skills: ['Cinematic Video', 'Drone Operations', 'Color Grading'],
      description: 'Cinematic videographer for wedding highlight reels',
      status: 'closed',
    },
    // Fashion Brand Lookbook requirements
    {
      id: 'req-4',
      collaborationId: 'collab-2',
      role: 'Fashion Photographer',
      quantityNeeded: 1,
      quantityFilled: 0,
      budget: '$600-900 per day',
      timing: 'March 20-22, 2024',
      location: 'Los Angeles, CA',
      skills: ['Fashion Photography', 'Studio Lighting', 'Retouching'],
      description: 'Fashion photographer with editorial experience',
      status: 'open',
    },
    {
      id: 'req-5',
      collaborationId: 'collab-2',
      role: 'Stylist',
      quantityNeeded: 1,
      quantityFilled: 0,
      budget: '$400-600 per day',
      timing: 'March 20-22, 2024',
      location: 'Los Angeles, CA',
      skills: ['Fashion Styling', 'Wardrobe Coordination', 'Trend Forecasting'],
      description: 'Creative stylist for contemporary fashion lookbook',
      status: 'open',
    },
    {
      id: 'req-6',
      collaborationId: 'collab-2',
      role: 'Hair Artist',
      quantityNeeded: 1,
      quantityFilled: 1,
      budget: '$350-500 per day',
      timing: 'March 20-22, 2024',
      location: 'Los Angeles, CA',
      skills: ['Editorial Hair', 'Hair Extensions', 'Creative Styling'],
      description: 'Hair artist for editorial and commercial looks',
      status: 'closed',
    },
    // Music Video Production requirements
    {
      id: 'req-7',
      collaborationId: 'collab-3',
      role: 'Director of Photography',
      quantityNeeded: 1,
      quantityFilled: 0,
      budget: '$800-1200',
      timing: 'April 5-7, 2024',
      location: 'Nashville, TN',
      skills: ['Music Video', 'Cinematography', 'Camera Operation'],
      description: 'Creative DP for indie rock music video with visual effects',
      status: 'open',
    },
    {
      id: 'req-8',
      collaborationId: 'collab-3',
      role: 'Video Editor',
      quantityNeeded: 1,
      quantityFilled: 0,
      budget: '$600-900',
      timing: 'Post-production: April 10-20',
      location: 'Remote/Nashville, TN',
      skills: ['Adobe Premiere', 'After Effects', 'Color Correction'],
      description: 'Editor experienced in music video post-production',
      status: 'open',
    },
    {
      id: 'req-9',
      collaborationId: 'collab-3',
      role: 'Set Designer',
      quantityNeeded: 1,
      quantityFilled: 0,
      budget: '$400-700',
      timing: 'April 3-7, 2024',
      location: 'Nashville, TN',
      skills: ['Set Design', 'Props', 'Visual Concepts'],
      description: 'Creative set designer for indie rock aesthetic',
      status: 'open',
    }
  ];

  try {
    // Seed collaborations
    for (const collab of demoCollaborations) {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaboration:${collab.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(collab)
      });

      if (!response.ok) {
        console.log('Failed to seed collaboration:', collab.id);
      }
    }

    // Seed requirements
    for (const req of demoRequirements) {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/requirement:${req.collaborationId}:${req.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(req)
      });

      if (!response.ok) {
        console.log('Failed to seed requirement:', req.id);
      }
    }

    console.log('Demo collaboration data seeded successfully');
    return true;
  } catch (error) {
    console.error('Failed to seed demo collaboration data:', error);
    return false;
  }
};

