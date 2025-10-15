import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Types
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

// Get all collaborations (for browsing)
app.get('/collaborations', async (c) => {
  try {
    const collaborations = await kv.getByPrefix('collaboration:');
    const collaborationsWithRequirements = await Promise.all(
      collaborations.map(async (collab: Collaboration) => {
        const requirements = await kv.getByPrefix(`requirement:${collab.id}:`);
        return { ...collab, requirements };
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
app.get('/collaborations/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const allCollaborations = await kv.getByPrefix('collaboration:');
    const userCollaborations = allCollaborations.filter((collab: Collaboration) => 
      collab.creatorId === userId
    );
    
    const collaborationsWithRequirements = await Promise.all(
      userCollaborations.map(async (collab: Collaboration) => {
        const requirements = await kv.getByPrefix(`requirement:${collab.id}:`);
        const requirementsWithApplications = await Promise.all(
          requirements.map(async (req: CollaborationRequirement) => {
            const applications = await kv.getByPrefix(`application:${req.id}:`);
            return { ...req, applications };
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
app.post('/collaborations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
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
app.post('/collaborations/:collaborationId/requirements/:requirementId/apply', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
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
    const alreadyApplied = existingApplications.some((app: Application) => 
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
app.post('/collaborations/:collaborationId/requirements/:requirementId/applications/:applicationId/:action', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
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
app.get('/applications/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const allApplications = await kv.getByPrefix('application:');
    const userApplications = allApplications.filter((app: Application) => 
      app.applicantId === userId
    );

    // Enrich with collaboration and requirement details
    const enrichedApplications = await Promise.all(
      userApplications.map(async (app: Application) => {
        const requirement = await kv.get(`requirement:${app.requirementId.split(':')[1]}:${app.requirementId}`);
        const collaboration = requirement ? await kv.get(`collaboration:${requirement.collaborationId}`) : null;
        
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

export default app;

