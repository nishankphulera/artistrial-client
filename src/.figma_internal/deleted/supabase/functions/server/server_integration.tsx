// This file shows how to integrate collaboration routes into the main server
// Add these routes directly to the main index.tsx file

// Add these collaboration routes after the existing routes:

// Get all collaborations (for browsing)
app.get('/make-server-f6985a91/collaborations', async (c) => {
  try {
    const collaborations = await kv.getByPrefix('collaboration:');
    const collaborationsWithRequirements = await Promise.all(
      collaborations.map(async (collab) => {
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
app.get('/make-server-f6985a91/collaborations/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const allCollaborations = await kv.getByPrefix('collaboration:');
    const userCollaborations = allCollaborations.filter((collab) => 
      collab.creatorId === userId
    );
    
    const collaborationsWithRequirements = await Promise.all(
      userCollaborations.map(async (collab) => {
        const requirements = await kv.getByPrefix(`requirement:${collab.id}:`);
        const requirementsWithApplications = await Promise.all(
          requirements.map(async (req) => {
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
app.post('/make-server-f6985a91/collaborations', async (c) => {
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
    const collaboration = {
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
      const requirement = {
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

// At the end of the file, add:
Deno.serve(app.fetch);

