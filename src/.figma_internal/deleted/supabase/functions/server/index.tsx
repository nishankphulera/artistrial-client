import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { addCartRoutes } from './cart_routes.tsx';

// Types for collaboration system
interface Collaboration {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
  requirements: CollaborationRequirement[];
}

interface CollaborationRequirement {
  id: string;
  collaborationId: string;
  role: string;
  quantityNeeded: number;
  quantityFilled: number;
  budget?: string;
  timing?: string;
  location?: string;
  skills?: string[];
  description?: string;
  status: 'open' | 'closed';
  applications: Application[];
}

interface Application {
  id: string;
  requirementId: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

interface CollaborationComment {
  id: string;
  collaborationId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  createdAt: string;
  isSystemMessage?: boolean;
}

const app = new Hono();

// CORS and logging middleware
app.use('*', cors({
  origin: '*',  // Allow all origins for development
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false,
}));

app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Health check endpoint
app.get('/make-server-f6985a91/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dashboard stats endpoint
app.get('/make-server-f6985a91/dashboard/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log('Auth error or no user:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all artworks from the user
    const allArtworks = await kv.getByPrefix('artwork:');
    const userArtworks = allArtworks
      .filter(item => item && item.value && item.value.artist_id === user.id)
      .map(item => item.value);

    const forSaleArtworks = userArtworks.filter(artwork => artwork.is_for_sale);
    const totalViews = userArtworks.reduce((sum, artwork) => sum + (artwork.views_count || 0), 0);
    const totalRevenue = userArtworks.reduce((sum, artwork) => 
      sum + ((artwork.sold_price || 0) * (artwork.sold_count || 0)), 0
    );

    // Mock some additional stats for demonstration
    const stats = {
      totalArtworks: userArtworks.length,
      itemsForSale: forSaleArtworks.length,
      totalViews: totalViews,
      totalSales: userArtworks.filter(artwork => artwork.sold_count > 0).length,
      totalRevenue: totalRevenue
    };

    console.log('Dashboard stats generated successfully for user:', user.id);
    return c.json({ stats });
  } catch (error) {
    console.log('Error fetching dashboard stats:', error);
    return c.json({ 
      error: 'Failed to fetch dashboard stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// User signup endpoint with profile creation
app.post('/make-server-f6985a91/auth/signup', async (c) => {
  try {
    const { email, password, full_name, profile_type = 'Artist' } = await c.req.json();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        full_name,
        profile_type 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Error creating user:', error);
      return c.json({ error: error.message }, 400);
    }

    if (data.user) {
      // Create user profile immediately after signup
      const userProfile = {
        id: data.user.id,
        username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
        full_name: full_name || email.split('@')[0],
        email,
        profile_type, // Artist, Venue, Investor, Legal
        bio: '',
        avatar_url: '',
        website: '',
        location: '',
        phone: '',
        followers_count: 0,
        following_count: 0,
        is_verified: false,
        joined_date: new Date().toISOString().split('T')[0],
        overall_rating: 0,
        total_reviews: 0,
        total_listings: 0,
        response_rate: 100,
        response_time: '< 2 hours',
        // Profile type specific fields
        specialties: [], // For Artists and Legal professionals
        venue_capacity: profile_type === 'Venue' ? 0 : undefined,
        venue_amenities: profile_type === 'Venue' ? [] : undefined,
        investment_range: profile_type === 'Investor' ? { min: 0, max: 0 } : undefined,
        investment_focus: profile_type === 'Investor' ? [] : undefined,
        legal_specialization: profile_type === 'Legal' ? [] : undefined,
        bar_admission: profile_type === 'Legal' ? [] : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await kv.set(`user_profile:${data.user.id}`, userProfile);
      
      console.log('User profile created:', userProfile);
      
      return c.json({ 
        message: 'User created successfully',
        user: data.user,
        profile: userProfile
      });
    }

    return c.json({ error: 'Failed to create user' }, 500);
  } catch (error) {
    console.log('Error in signup:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Initialize sample data endpoint (for development)
app.post('/make-server-f6985a91/init-sample-data', async (c) => {
  try {
    // Add some sample artworks for testing cart functionality
    const sampleArtworks = [
      {
        id: 'artwork-1',
        title: 'Abstract Dreams',
        artist_name: 'Sarah Chen',
        artist_id: 'user-artist-1',
        price: 150,
        image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
        description: 'A vibrant abstract painting exploring dreams and consciousness.',
        category: 'Painting',
        medium: 'Acrylic on Canvas',
        dimensions: '24" x 36"',
        year: 2024,
        is_for_sale: true,
        views_count: 45,
        created_at: new Date().toISOString()
      },
      {
        id: 'artwork-2',
        title: 'Urban Landscape',
        artist_name: 'Marcus Rodriguez',
        artist_id: 'user-artist-2',
        price: 200,
        image_url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400',
        description: 'A contemporary view of city life through mixed media.',
        category: 'Mixed Media',
        medium: 'Mixed Media on Canvas',
        dimensions: '30" x 40"',
        year: 2024,
        is_for_sale: true,
        views_count: 62,
        created_at: new Date().toISOString()
      },
      {
        id: 'artwork-3',
        title: 'Digital Harmony',
        artist_name: 'Alex Kim',
        artist_id: 'user-artist-3',
        price: 75,
        image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
        description: 'A digital artwork exploring the harmony between technology and nature.',
        category: 'Digital Art',
        medium: 'Digital Print',
        dimensions: '16" x 20"',
        year: 2024,
        is_for_sale: true,
        views_count: 33,
        created_at: new Date().toISOString()
      }
    ];

    // Store sample artworks
    for (const artwork of sampleArtworks) {
      await kv.set(`artwork:${artwork.id}`, artwork);
    }

    // Add sample collaborations for testing
    const sampleCollaborations = [
      {
        id: 'collab-sample-1',
        title: 'Fashion Photography Campaign',
        description: 'Creating a high-end fashion photography series for a luxury brand launch. Looking for creative professionals to bring this vision to life.',
        creatorId: 'sample-user-1',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'collab-sample-2',
        title: 'Music Video Production',
        description: 'Indie music video project for an upcoming single. Seeking talented individuals for a creative and artistic music video.',
        creatorId: 'sample-user-2',
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];

    // Store sample collaborations
    for (const collaboration of sampleCollaborations) {
      await kv.set(`collaboration:${collaboration.id}`, collaboration);
    }

    // Add sample requirements for collaborations
    const sampleRequirements = [
      {
        id: 'req-sample-1',
        collaborationId: 'collab-sample-1',
        role: 'Fashion Photographer',
        quantityNeeded: 1,
        quantityFilled: 0,
        budget: '$2,000 - $3,500',
        timing: 'Next 2 weeks',
        location: 'New York City',
        skills: ['Fashion Photography', 'Studio Lighting', 'Post-Production'],
        description: 'Lead photographer for luxury fashion campaign. Must have experience with high-end fashion brands and studio work.',
        status: 'open',
        applications: []
      },
      {
        id: 'req-sample-2',
        collaborationId: 'collab-sample-2',
        role: 'Video Editor',
        quantityNeeded: 1,
        quantityFilled: 0,
        budget: '$1,500 - $2,500',
        timing: 'January 2025',
        location: 'Remote',
        skills: ['Video Editing', 'Color Grading', 'Motion Graphics'],
        description: 'Post-production for indie music video. Creative editing and visual effects required.',
        status: 'open',
        applications: []
      }
    ];

    // Store sample requirements
    for (const requirement of sampleRequirements) {
      await kv.set(`requirement:${requirement.collaborationId}:${requirement.id}`, requirement);
    }

    return c.json({ 
      message: 'Sample data initialized successfully',
      artworks: sampleArtworks.length,
      collaborations: sampleCollaborations.length,
      requirements: sampleRequirements.length
    });
  } catch (error) {
    console.error('Error initializing sample data:', error);
    return c.json({ error: 'Failed to initialize sample data' }, 500);
  }
});

// Add cart routes to the app
addCartRoutes(app);

// ==============================
// ARTWORK ENDPOINTS
// ==============================

// Get all artworks (for public browsing and profile fallback)  
app.get('/make-server-f6985a91/artworks', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    console.log('Artworks request - hasToken:', !!accessToken);
    
    if (!accessToken) {
      console.log('No access token provided');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Handle both actual access tokens and public anon key
    let user = null;
    if (accessToken !== Deno.env.get('SUPABASE_ANON_KEY')) {
      const { data: userData, error: authError } = await supabase.auth.getUser(accessToken);
      if (authError) {
        console.log('Auth error in artworks:', authError);
        return c.json({ error: 'Unauthorized' }, 401);
      }
      user = userData.user;
    }

    const allArtworks = await kv.getByPrefix('artwork:');
    const artworks = allArtworks
      .map(item => item?.value)
      .filter(artwork => artwork && artwork.is_for_sale);

    console.log('Artworks fetched successfully:', artworks.length);
    return c.json({ artworks });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return c.json({ 
      error: 'Failed to fetch artworks',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Initialize collaboration sample data endpoint
app.post('/make-server-f6985a91/init-collaboration-data', async (c) => {
  try {
    // Sample collaborations with requirements
    const collaborations = [
      {
        id: 'collab-1',
        title: 'Fashion Photography Campaign',
        description: 'Creating a high-end fashion photography series for a luxury brand launch. Looking for creative professionals to bring this vision to life.',
        creatorId: 'sample-creator-1',
        createdAt: '2024-12-01T10:00:00Z',
        status: 'active'
      },
      {
        id: 'collab-2', 
        title: 'Music Video Production',
        description: 'Indie music video project for an upcoming single. Seeking talented individuals for a creative and artistic music video.',
        creatorId: 'sample-creator-2',
        createdAt: '2024-11-28T15:20:00Z',
        status: 'active'
      },
      {
        id: 'collab-3',
        title: 'Art Gallery Exhibition',
        description: 'Collaborative art exhibition featuring emerging digital artists. Creating an immersive gallery experience.',
        creatorId: 'sample-creator-3',
        createdAt: '2024-11-25T12:00:00Z',
        status: 'active'
      }
    ];

    const requirements = [
      {
        id: 'req-1',
        collaborationId: 'collab-1',
        role: 'Fashion Photographer',
        quantityNeeded: 1,
        quantityFilled: 0,
        budget: '$2,000 - $3,500',
        timing: 'Next 2 weeks',
        location: 'New York City',
        skills: ['Fashion Photography', 'Studio Lighting', 'Post-Production'],
        description: 'Lead photographer for luxury fashion campaign. Must have experience with high-end fashion brands and studio work.',
        status: 'open',
        applications: []
      },
      {
        id: 'req-2',
        collaborationId: 'collab-1',
        role: 'Hair & Makeup Artist',
        quantityNeeded: 2,
        quantityFilled: 1,
        budget: '$800 - $1,200',
        timing: 'Next 2 weeks',
        location: 'New York City',
        skills: ['Fashion Makeup', 'Hair Styling', 'Editorial Work'],
        description: 'Creative makeup and hair styling for luxury fashion shoot.',
        status: 'open',
        applications: []
      },
      {
        id: 'req-3',
        collaborationId: 'collab-2',
        role: 'Video Editor',
        quantityNeeded: 1,
        quantityFilled: 0,
        budget: '$1,500 - $2,500',
        timing: 'January 2025',
        location: 'Remote',
        skills: ['Video Editing', 'Color Grading', 'Motion Graphics'],
        description: 'Post-production for indie music video. Creative editing and visual effects required.',
        status: 'open',
        applications: []
      },
      {
        id: 'req-4',
        collaborationId: 'collab-3',
        role: 'Digital Artist',
        quantityNeeded: 5,
        quantityFilled: 2,
        budget: '$500 - $1,000 per piece',
        timing: 'February 2025',
        location: 'Miami',
        skills: ['Digital Art', 'NFT Creation', 'Interactive Media'],
        description: 'Digital artworks for gallery exhibition. Looking for innovative and contemporary pieces.',
        status: 'open',
        applications: []
      }
    ];

    // Store collaborations
    for (const collaboration of collaborations) {
      await kv.set(`collaboration:${collaboration.id}`, collaboration);
    }

    // Store requirements
    for (const requirement of requirements) {
      await kv.set(`requirement:${requirement.collaborationId}:${requirement.id}`, requirement);
    }

    return c.json({ 
      message: 'Collaboration sample data initialized successfully',
      collaborations: collaborations.length,
      requirements: requirements.length
    });
  } catch (error) {
    console.error('Error initializing collaboration data:', error);
    return c.json({ error: 'Failed to initialize collaboration data' }, 500);
  }
});

// ==============================
// COLLABORATION ENDPOINTS
// ==============================

// Get all collaborations (for browsing)
app.get('/make-server-f6985a91/collaborations', async (c) => {
  try {
    const collaborations = await kv.getByPrefix('collaboration:');
    const collaborationsWithRequirements = await Promise.all(
      collaborations.map(async (collab: any) => {
        if (!collab?.value) return null;
        const collaborationData = collab.value;
        const requirements = await kv.getByPrefix(`requirement:${collaborationData.id}:`);
        const requirementValues = requirements.map(req => req?.value).filter(Boolean);
        return { ...collaborationData, requirements: requirementValues };
      })
    );
    
    const validCollaborations = collaborationsWithRequirements.filter(c => 
      c && c.status === 'active'
    );
    
    return c.json({ 
      collaborations: validCollaborations
    });
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return c.json({ error: 'Failed to fetch collaborations' }, 500);
  }
});

// Get user's collaborations (for dashboard)
app.get('/make-server-f6985a91/collaborations/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const allCollaborations = await kv.getByPrefix('collaboration:');
    const userCollaborations = allCollaborations
      .map(item => item?.value)
      .filter(collab => collab && collab.creatorId === userId);
    
    const collaborationsWithRequirements = await Promise.all(
      userCollaborations.map(async (collab: any) => {
        const requirements = await kv.getByPrefix(`requirement:${collab.id}:`);
        const requirementsWithApplications = await Promise.all(
          requirements.map(async (reqItem: any) => {
            if (!reqItem?.value) return null;
            const req = reqItem.value;
            const applications = await kv.getByPrefix(`application:${req.id}:`);
            const applicationValues = applications.map(app => app?.value).filter(Boolean);
            return { ...req, applications: applicationValues };
          })
        );
        const validRequirements = requirementsWithApplications.filter(Boolean);
        return { ...collab, requirements: validRequirements };
      })
    );
    
    return c.json({ collaborations: collaborationsWithRequirements });
  } catch (error) {
    console.error('Error fetching user collaborations:', error);
    return c.json({ error: 'Failed to fetch user collaborations' }, 500);
  }
});

// Create collaboration
app.post('/make-server-f6985a91/collaborations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { title, description, requirements } = await c.req.json();
    
    if (!title || !requirements || requirements.length === 0) {
      return c.json({ error: 'Title and at least one requirement are required' }, 400);
    }

    const collaborationId = crypto.randomUUID();
    const collaboration: Collaboration = {
      id: collaborationId,
      title,
      description,
      creatorId: user.id,
      createdAt: new Date().toISOString(),
      status: 'active',
      requirements: []
    };

    await kv.set(`collaboration:${collaborationId}`, collaboration);

    // Create requirements
    for (const req of requirements) {
      const requirementId = crypto.randomUUID();
      const requirement: CollaborationRequirement = {
        id: requirementId,
        collaborationId,
        role: req.role,
        quantityNeeded: req.quantityNeeded,
        quantityFilled: 0,
        budget: req.budget,
        timing: req.timing,
        location: req.location,
        skills: req.skills,
        description: req.description,
        status: 'open',
        applications: []
      };
      
      await kv.set(`requirement:${collaborationId}:${requirementId}`, requirement);
    }

    return c.json({ collaboration, success: true });
  } catch (error) {
    console.error('Error creating collaboration:', error);
    return c.json({ error: 'Failed to create collaboration' }, 500);
  }
});

// Apply to a requirement
app.post('/make-server-f6985a91/collaborations/:collaborationId/requirements/:requirementId/apply', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const collaborationId = c.req.param('collaborationId');
    const requirementId = c.req.param('requirementId');
    const { message } = await c.req.json();

    // Get requirement
    const requirement = await kv.get(`requirement:${collaborationId}:${requirementId}`);
    if (!requirement) {
      return c.json({ error: 'Requirement not found' }, 404);
    }

    // Check if user already applied
    const existingApplications = await kv.getByPrefix(`application:${requirementId}:`);
    const alreadyApplied = existingApplications.some((appItem: any) => 
      appItem?.value && appItem.value.applicantId === user.id
    );
    
    if (alreadyApplied) {
      return c.json({ error: 'You have already applied to this requirement' }, 400);
    }

    // Check if requirement is still open
    if (requirement.status !== 'open' || requirement.quantityFilled >= requirement.quantityNeeded) {
      return c.json({ error: 'This requirement is no longer accepting applications' }, 400);
    }

    const applicationId = crypto.randomUUID();
    const application: Application = {
      id: applicationId,
      requirementId,
      applicantId: user.id,
      applicantName: user.user_metadata?.full_name || user.email || 'Anonymous',
      applicantAvatar: user.user_metadata?.avatar_url,
      message,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };

    await kv.set(`application:${requirementId}:${applicationId}`, application);

    return c.json({ application, success: true });
  } catch (error) {
    console.error('Error applying to requirement:', error);
    return c.json({ error: 'Failed to apply to requirement' }, 500);
  }
});

// Accept/reject application
app.post('/make-server-f6985a91/collaborations/:collaborationId/requirements/:requirementId/applications/:applicationId/:action', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const collaborationId = c.req.param('collaborationId');
    const requirementId = c.req.param('requirementId');
    const applicationId = c.req.param('applicationId');
    const action = c.req.param('action'); // 'accept' or 'reject'

    // Verify user owns the collaboration
    const collaboration = await kv.get(`collaboration:${collaborationId}`);
    if (!collaboration || collaboration.creatorId !== user.id) {
      return c.json({ error: 'Unauthorized to manage this collaboration' }, 403);
    }

    // Get application and requirement
    const application = await kv.get(`application:${requirementId}:${applicationId}`);
    const requirement = await kv.get(`requirement:${collaborationId}:${requirementId}`);
    
    if (!application || !requirement) {
      return c.json({ error: 'Application or requirement not found' }, 404);
    }

    if (action === 'accept') {
      // Check if there's still space
      if (requirement.quantityFilled >= requirement.quantityNeeded) {
        return c.json({ error: 'This requirement is already filled' }, 400);
      }

      // Update application status
      application.status = 'accepted';
      await kv.set(`application:${requirementId}:${applicationId}`, application);

      // Update requirement quantity
      requirement.quantityFilled += 1;
      if (requirement.quantityFilled >= requirement.quantityNeeded) {
        requirement.status = 'closed';
      }
      await kv.set(`requirement:${collaborationId}:${requirementId}`, requirement);

    } else if (action === 'reject') {
      application.status = 'rejected';
      await kv.set(`application:${requirementId}:${applicationId}`, application);
    } else {
      return c.json({ error: 'Invalid action' }, 400);
    }

    return c.json({ application, requirement, success: true });
  } catch (error) {
    console.error('Error managing application:', error);
    return c.json({ error: 'Failed to manage application' }, 500);
  }
});

// Get user's applications
app.get('/make-server-f6985a91/applications/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const allApplications = await kv.getByPrefix('application:');
    const userApplications = allApplications
      .map(item => item?.value)
      .filter(app => app && app.applicantId === userId);

    // Enrich with collaboration and requirement details
    const enrichedApplications = await Promise.all(
      userApplications.map(async (app: any) => {
        try {
          // Find the requirement by searching through all requirements
          const allRequirements = await kv.getByPrefix('requirement:');
          const foundReq = allRequirements.find(item => item?.value?.id === app.requirementId);
          
          if (!foundReq?.value) {
            console.log(`Requirement not found for application ${app.id} with requirementId ${app.requirementId}`);
            return null;
          }

          const requirement = foundReq.value;
          const collaboration = await kv.get(`collaboration:${requirement.collaborationId}`);
          
          if (!collaboration) {
            console.log(`Collaboration not found for requirement ${requirement.id} with collaborationId ${requirement.collaborationId}`);
            return null;
          }
          
          return {
            ...app,
            requirement,
            collaboration
          };
        } catch (error) {
          console.error('Error enriching application:', error);
          return null;
        }
      })
    );

    const validApplications = enrichedApplications.filter(Boolean);
    return c.json({ applications: validApplications });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return c.json({ error: 'Failed to fetch user applications' }, 500);
  }
});

// ==============================
// PROFILE MANAGEMENT ENDPOINTS
// ==============================

// Get user profile
app.get('/make-server-f6985a91/profiles/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user_profile:${userId}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Get complete user profile with listings and reviews (optimized for ProfilePageOptimized)
app.get('/make-server-f6985a91/profiles/:userId/complete', async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    console.log('Complete profile request - userId:', userId, 'hasToken:', !!accessToken);
    
    if (!accessToken) {
      console.log('No access token provided');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Handle both actual access tokens and public anon key
    let user = null;
    if (accessToken !== Deno.env.get('SUPABASE_ANON_KEY')) {
      const { data: userData, error: authError } = await supabase.auth.getUser(accessToken);
      if (authError) {
        console.log('Auth error:', authError);
        return c.json({ error: 'Unauthorized' }, 401);
      }
      user = userData.user;
    }

    console.log('Fetching complete profile for user:', userId, 'authenticated as:', user?.id || 'anonymous');

    const profile = await kv.get(`user_profile:${userId}`);
    if (!profile) {
      console.log('Profile not found for user:', userId);
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Fetch all listings for the user
    const [artworks, talents, studios, events, investments, legalServices, products, education] = await Promise.all([
      kv.getByPrefix('artwork:'),
      kv.getByPrefix('talent:'),
      kv.getByPrefix('studio:'),
      kv.getByPrefix('event:'),
      kv.getByPrefix('investment:'),
      kv.getByPrefix('legal_service:'),
      kv.getByPrefix('product:'),
      kv.getByPrefix('education:')
    ]);

    // Filter and process user's listings
    const userListings = {
      artworks: artworks
        .map(item => item?.value)
        .filter(item => item && item.artist_id === userId),
      talents: talents
        .map(item => item?.value)
        .filter(item => item && item.user_id === userId),
      studios: studios
        .map(item => item?.value)
        .filter(item => item && item.owner_id === userId),
      events: events
        .map(item => item?.value)  
        .filter(item => item && item.organizer_id === userId),
      investments: investments
        .map(item => item?.value)
        .filter(item => item && item.investor_id === userId),
      legalServices: legalServices
        .map(item => item?.value)
        .filter(item => item && item.lawyer_id === userId),
      products: products
        .map(item => item?.value)
        .filter(item => item && item.seller_id === userId),
      education: education
        .map(item => item?.value)
        .filter(item => item && item.instructor_id === userId)
    };

    // Calculate total listings
    const totalListings = Object.values(userListings).reduce((sum, listings) => sum + listings.length, 0);
    
    // Update profile total_listings if needed
    if (profile.total_listings !== totalListings) {
      profile.total_listings = totalListings;
      await kv.set(`user_profile:${userId}`, profile);
    }

    // Fetch reviews (mock for now - you can implement actual reviews later)
    const reviews = [];

    console.log('Complete profile data prepared for user:', userId, {
      profileExists: !!profile,
      totalListings,
      artworksCount: userListings.artworks.length,
      talentsCount: userListings.talents.length
    });

    return c.json({
      profile,
      listings: userListings,
      reviews
    });
  } catch (error) {
    console.error('Error fetching complete profile:', error);
    return c.json({ 
      error: 'Failed to fetch complete profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Fix/create user profile
app.post('/make-server-f6985a91/profiles/fix/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if profile already exists
    let profile = await kv.get(`user_profile:${userId}`);
    
    if (!profile) {
      // Create new profile with data from auth metadata
      const full_name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      const profile_type = user.user_metadata?.profile_type || 'Artist';
      
      profile = {
        id: userId,
        username: (user.email?.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, ''),
        full_name,
        email: user.email,
        profile_type,
        bio: '',
        avatar_url: user.user_metadata?.avatar_url || '',
        website: '',
        location: '',
        phone: '',
        followers_count: 0,
        following_count: 0,
        is_verified: false,
        joined_date: new Date().toISOString().split('T')[0],
        overall_rating: 0,
        total_reviews: 0,
        total_listings: 0,
        response_rate: 100,
        response_time: '< 2 hours',
        // Profile type specific fields
        specialties: [],
        venue_capacity: profile_type === 'Venue' ? 0 : undefined,
        venue_amenities: profile_type === 'Venue' ? [] : undefined,
        investment_range: profile_type === 'Investor' ? { min: 0, max: 0 } : undefined,
        investment_focus: profile_type === 'Investor' ? [] : undefined,
        legal_specialization: profile_type === 'Legal' ? [] : undefined,
        bar_admission: profile_type === 'Legal' ? [] : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await kv.set(`user_profile:${userId}`, profile);
      console.log('Profile created for user:', userId);
    }

    return c.json({ 
      message: 'Profile fixed successfully',
      profile 
    });
  } catch (error) {
    console.log('Error fixing profile:', error);
    return c.json({ error: 'Failed to fix profile' }, 500);
  }
});

// Update user profile
app.put('/make-server-f6985a91/profiles/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updateData = await c.req.json();
    
    // Get existing profile
    let existingProfile = await kv.get(`user_profile:${userId}`);
    
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Update profile with new data
    const updatedProfile = {
      ...existingProfile,
      ...updateData,
      id: userId, // Ensure ID cannot be changed
      updated_at: new Date().toISOString()
    };

    await kv.set(`user_profile:${userId}`, updatedProfile);
    
    return c.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });
  } catch (error) {
    console.log('Error updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);

