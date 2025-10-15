// This file has been integrated into index.tsx and is no longer needed
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

// COLLABORATION ROUTES

// Get all collaborations (for browsing)
app.get('/make-server-f6985a91/collaborations', async (c) => {
  try {
    const allCollaborations = await kv.getByPrefix('collaboration:');
    const collaborationsData = allCollaborations
      .filter(item => item && item.value)
      .map(item => item.value);

    const collaborationsWithRequirements = await Promise.all(
      collaborationsData.map(async (collab: Collaboration) => {
        const requirements = await kv.getByPrefix(`requirement:${collab.id}:`);
        const requirementsData = requirements
          .filter(item => item && item.value)
          .map(item => item.value);
        return { ...collab, requirements: requirementsData };
      })
    );
    
    return c.json({ 
      collaborations: collaborationsWithRequirements.filter(c => c.status === 'active') 
    });
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return c.json({ error: 'Failed to fetch collaborations' }, 500);
  }
});

// Get user's collaborations (for dashboard)
app.get('/make-server-f6985a91/collaborations/user/:userId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    
    // Check if user can access this data (must be their own)
    if (userId !== user.id) {
      return c.json({ error: 'Cannot access another user\'s collaborations' }, 403);
    }

    const allCollaborations = await kv.getByPrefix('collaboration:');
    const collaborationsData = allCollaborations
      .filter(item => item && item.value && item.value.creatorId === userId)
      .map(item => item.value);
    
    const collaborationsWithRequirements = await Promise.all(
      collaborationsData.map(async (collab: Collaboration) => {
        const requirements = await kv.getByPrefix(`requirement:${collab.id}:`);
        const requirementsData = requirements
          .filter(item => item && item.value)
          .map(item => item.value);
        
        const requirementsWithApplications = await Promise.all(
          requirementsData.map(async (req: CollaborationRequirement) => {
            const applications = await kv.getByPrefix(`application:${req.id}:`);
            const applicationsData = applications
              .filter(item => item && item.value)
              .map(item => item.value);
            return { ...req, applications: applicationsData };
          })
        );
        return { ...collab, requirements: requirementsWithApplications };
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
    
    if (authError || !user?.id) {
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
    
    if (authError || !user?.id) {
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
    const applicationsData = existingApplications
      .filter(item => item && item.value)
      .map(item => item.value);
    
    const alreadyApplied = applicationsData.some((app: Application) => 
      app.applicantId === user.id
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
    
    if (authError || !user?.id) {
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
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    
    // Check if user can access this data (must be their own)
    if (userId !== user.id) {
      return c.json({ error: 'Cannot access another user\'s applications' }, 403);
    }

    const allApplications = await kv.getByPrefix('application:');
    const applicationsData = allApplications
      .filter(item => item && item.value && item.value.applicantId === userId)
      .map(item => item.value);

    // Enrich with collaboration and requirement details
    const enrichedApplications = await Promise.all(
      applicationsData.map(async (app: Application) => {
        // Parse requirement ID from application key structure
        const requirementKey = `requirement:${app.requirementId}`;
        const requirementParts = requirementKey.split(':');
        const collaborationId = requirementParts[1];
        const fullRequirementId = requirementParts[2];
        
        const requirement = await kv.get(`requirement:${collaborationId}:${fullRequirementId}`);
        const collaboration = requirement ? await kv.get(`collaboration:${collaborationId}`) : null;
        
        return {
          ...app,
          requirement,
          collaboration
        };
      })
    );

    return c.json({ applications: enrichedApplications.filter(app => app.collaboration) });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return c.json({ error: 'Failed to fetch user applications' }, 500);
  }
});

// USER AND PROFILE ROUTES (existing functionality)

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

// Get user profile
app.get('/make-server-f6985a91/profiles/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const userProfile = await kv.get(`user_profile:${userId}`);
    
    if (!userProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json({ profile: userProfile });
  } catch (error) {
    console.log('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update profile endpoint
app.put('/make-server-f6985a91/profiles/:userId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    
    // Check if user can update this profile (must be their own)
    if (userId !== user.id) {
      return c.json({ error: 'Cannot update another user\'s profile' }, 403);
    }

    const profileUpdates = await c.req.json();
    
    // Get existing profile
    let existingProfile = await kv.get(`user_profile:${userId}`);
    if (!existingProfile) {
      // Auto-fix profile if it doesn't exist
      console.log(`Profile not found for user ${userId}, creating basic profile...`);
      existingProfile = {
        id: user.id,
        username: user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        profile_type: user.user_metadata?.profile_type || 'Artist',
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
        specialties: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    // Merge updates with existing profile, preserving profile-type specific fields
    const updatedProfile = {
      ...existingProfile,
      ...profileUpdates,
      id: userId, // Ensure ID cannot be changed
      updated_at: new Date().toISOString()
    };

    // Ensure profile-type specific fields are properly initialized
    const profileType = updatedProfile.profile_type || 'Artist';
    if (profileType === 'Venue') {
      updatedProfile.venue_capacity = updatedProfile.venue_capacity || 0;
      updatedProfile.venue_amenities = updatedProfile.venue_amenities || [];
    }
    if (profileType === 'Investor') {
      updatedProfile.investment_range = updatedProfile.investment_range || { min: 0, max: 0 };
      updatedProfile.investment_focus = updatedProfile.investment_focus || [];
    }
    if (profileType === 'Legal') {
      updatedProfile.legal_specialization = updatedProfile.legal_specialization || [];
      updatedProfile.bar_admission = updatedProfile.bar_admission || [];
    }
    // Ensure specialties exists for all profiles (used by Artists and Legal)
    updatedProfile.specialties = updatedProfile.specialties || [];

    // Save updated profile
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

// Dashboard stats endpoint
app.get('/make-server-f6985a91/dashboard/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
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

    return c.json({ stats });
  } catch (error) {
    console.log('Error fetching dashboard stats:', error);
    return c.json({ error: 'Failed to fetch dashboard stats' }, 500);
  }
});

// Start server
Deno.serve(app.fetch);

