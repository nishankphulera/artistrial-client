import * as kv from './kv_store.tsx';

// Generate realistic data for the Artistrial platform
export async function seedAllMarketplaceData() {
  console.log('Starting comprehensive data seeding for all marketplace sections...');

  // Generate user IDs and consistent user data
  const users = [
    { id: 'user_001', name: 'Sarah Johnson', email: 'sarah.johnson@artistrial.com', username: 'sarahjohnson' },
    { id: 'user_002', name: 'Marcus Chen', email: 'marcus.chen@artistrial.com', username: 'marcuschen' },
    { id: 'user_003', name: 'Emily Rodriguez', email: 'emily.rodriguez@artistrial.com', username: 'emilyrodriguez' },
    { id: 'user_004', name: 'David Kim', email: 'david.kim@artistrial.com', username: 'davidkim' },
    { id: 'user_005', name: 'Jessica White', email: 'jessica.white@artistrial.com', username: 'jessicawhite' },
    { id: 'user_006', name: 'Alex Rivera', email: 'alex.rivera@artistrial.com', username: 'alexrivera' },
    { id: 'user_007', name: 'Michael Thompson', email: 'michael.thompson@artistrial.com', username: 'michaelthompson' },
    { id: 'user_008', name: 'Lisa Park', email: 'lisa.park@artistrial.com', username: 'lisapark' },
    { id: 'user_009', name: 'Tom Bradley', email: 'tom.bradley@artistrial.com', username: 'tombradley' },
    { id: 'user_010', name: 'Rachel Martinez', email: 'rachel.martinez@artistrial.com', username: 'rachelmartinez' },
    { id: 'user_011', name: 'James Wilson', email: 'james.wilson@artistrial.com', username: 'jameswilson' },
    { id: 'user_012', name: 'Amanda Foster', email: 'amanda.foster@artistrial.com', username: 'amandafoster' },
    { id: 'user_013', name: 'Ryan Cooper', email: 'ryan.cooper@artistrial.com', username: 'ryancooper' },
    { id: 'user_014', name: 'Sophia Taylor', email: 'sophia.taylor@artistrial.com', username: 'sophiataylor' },
    { id: 'user_015', name: 'Noah Davis', email: 'noah.davis@artistrial.com', username: 'noahdavis' },
    { id: 'user_016', name: 'Maya Patel', email: 'maya.patel@artistrial.com', username: 'mayapatel' },
    { id: 'user_017', name: 'Carlos Mendoza', email: 'carlos.mendoza@artistrial.com', username: 'carlosmendoza' },
    { id: 'user_018', name: 'Zoe Anderson', email: 'zoe.anderson@artistrial.com', username: 'zoeanderson' },
    { id: 'user_019', name: 'Tyler Brooks', email: 'tyler.brooks@artistrial.com', username: 'tylerbrooks' },
    { id: 'user_020', name: 'Nicole Singh', email: 'nicole.singh@artistrial.com', username: 'nicolesingh' }
  ];

  // Create user profiles for all users
  for (const user of users) {
    const profile = {
      id: user.id,
      username: user.username,
      full_name: user.name,
      email: user.email,
      bio: `Professional artist and creative with years of experience in the industry.`,
      avatar_url: '',
      website: `https://${user.username}.portfolio.com`,
      location: ['New York', 'Los Angeles', 'Chicago', 'Austin', 'Nashville', 'San Francisco'][Math.floor(Math.random() * 6)],
      phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      followers_count: Math.floor(Math.random() * 500) + 50,
      following_count: Math.floor(Math.random() * 200) + 20,
      is_verified: Math.random() > 0.7,
      joined_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      overall_rating: Math.random() * 1.5 + 3.5, // 3.5 to 5.0
      total_reviews: Math.floor(Math.random() * 50) + 5,
      total_listings: 0, // Will be calculated
      response_rate: Math.floor(Math.random() * 20) + 80, // 80-100%
      response_time: ['< 1 hour', '< 2 hours', '< 4 hours', '< 1 day'][Math.floor(Math.random() * 4)]
    };
    await kv.set(`user_profile:${user.id}`, profile);
  }

  // 1. TALENT MARKETPLACE DATA
  const talentData = [
    { user: users[0], profession: 'Portrait Photographer', category: 'photographer', subcategory: 'portrait', hourlyRate: 85, skills: ['Portrait Photography', 'Studio Lighting', 'Adobe Lightroom', 'Professional Headshots'], experience: '8 years', availability: 'Available', portfolio: [] },
    { user: users[1], profession: 'Video Editing Specialist', category: 'video', subcategory: 'editing', hourlyRate: 75, skills: ['After Effects', 'Premiere Pro', 'Motion Graphics', 'Color Grading'], experience: '6 years', availability: 'Busy', portfolio: [] },
    { user: users[2], profession: 'Character Designer', category: 'artist', subcategory: 'character', hourlyRate: 60, skills: ['Character Design', 'Digital Illustration', 'Procreate', 'Concept Art'], experience: '5 years', availability: 'Available', portfolio: [] },
    { user: users[3], profession: 'Music Recording Engineer', category: 'music', subcategory: 'recording', hourlyRate: 95, skills: ['Pro Tools', 'Logic Pro', 'Live Recording', 'Studio Setup'], experience: '12 years', availability: 'Available', portfolio: [] },
    { user: users[4], profession: 'Wedding Photographer', category: 'photographer', subcategory: 'wedding', hourlyRate: 120, skills: ['Wedding Photography', 'Ceremony Coverage', 'Reception Photography', 'Bridal Portraits'], experience: '7 years', availability: 'Available', portfolio: [] },
    { user: users[5], profession: 'Logo Designer', category: 'designer', subcategory: 'logo', hourlyRate: 55, skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Typography'], experience: '4 years', availability: 'Available', portfolio: [] },
    { user: users[6], profession: 'Commercial Voice Artist', category: 'voice', subcategory: 'commercial', hourlyRate: 70, skills: ['Commercial VO', 'Radio Ads', 'TV Commercials', 'Audio Editing'], experience: '10 years', availability: 'Available', portfolio: [] },
    { user: users[7], profession: 'Copywriter', category: 'writer', subcategory: 'copy', hourlyRate: 65, skills: ['Copywriting', 'Ad Copy', 'Marketing Content', 'Email Campaigns'], experience: '6 years', availability: 'Busy', portfolio: [] },
    { user: users[8], profession: 'Fashion Photographer', category: 'photographer', subcategory: 'fashion', hourlyRate: 150, skills: ['Fashion Photography', 'Editorial Shoots', 'Model Photography', 'Studio Lighting'], experience: '9 years', availability: 'Available', portfolio: [] },
    { user: users[9], profession: 'Corporate Video Producer', category: 'video', subcategory: 'corporate', hourlyRate: 110, skills: ['Corporate Video', 'Training Videos', 'Company Profiles', 'Video Production'], experience: '8 years', availability: 'Available', portfolio: [] }
  ];

  for (let i = 0; i < talentData.length; i++) {
    const talent = talentData[i];
    const talentListing = {
      id: `talent_${i + 1}`,
      user_id: talent.user.id,
      name: talent.user.name,
      profession: talent.profession,
      location: users.find(u => u.id === talent.user.id) ? 
        await kv.get(`user_profile:${talent.user.id}`) : { location: 'New York, NY' },
      rating: 3.5 + Math.random() * 1.5,
      hourlyRate: talent.hourlyRate,
      skills: talent.skills,
      experience: talent.experience,
      avatar: '',
      availability: talent.availability,
      portfolio: talent.portfolio,
      bio: `Professional ${talent.profession.toLowerCase()} with ${talent.experience} of experience in ${talent.skills.join(', ')}.`,
      total_reviews: Math.floor(Math.random() * 40) + 10,
      category: talent.category,
      subcategory: talent.subcategory,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Fix location
    const profile = await kv.get(`user_profile:${talent.user.id}`);
    talentListing.location = profile ? profile.location : 'New York, NY';
    
    await kv.set(`talent:${talentListing.id}`, talentListing);
  }

  // 2. STUDIO MARKETPLACE DATA
  const studioData = [
    { user: users[10], name: 'Sunrise Creative Studio', type: 'Photography Studio', hourlyRate: 150, capacity: 8, equipment: ['Professional Camera Equipment', 'Studio Lighting', 'Backdrop Systems', 'Props'] },
    { user: users[11], name: 'Downtown Recording Hub', type: 'Recording Studio', hourlyRate: 200, capacity: 6, equipment: ['Pro Tools Setup', 'Professional Microphones', 'Mixing Console', 'Sound Booth'] },
    { user: users[12], name: 'Creative Space Collective', type: 'Art Studio', hourlyRate: 80, capacity: 12, equipment: ['Easels', 'Art Supplies', 'Natural Lighting', 'Work Tables'] },
    { user: users[13], name: 'Video Production Central', type: 'Video Studio', hourlyRate: 250, capacity: 10, equipment: ['4K Camera Setup', 'Green Screen', 'Professional Lighting', 'Editing Suite'] },
    { user: users[14], name: 'The Workshop', type: 'Multi-Purpose Studio', hourlyRate: 120, capacity: 15, equipment: ['Flexible Setup', 'A/V Equipment', 'Presentation Tools', 'Breakout Areas'] }
  ];

  for (let i = 0; i < studioData.length; i++) {
    const studio = studioData[i];
    const profile = await kv.get(`user_profile:${studio.user.id}`);
    const studioListing = {
      id: `studio_${i + 1}`,
      owner_id: studio.user.id,
      name: studio.name,
      type: studio.type,
      location: profile ? profile.location : 'New York, NY',
      hourlyRate: studio.hourlyRate,
      capacity: studio.capacity,
      equipment: studio.equipment,
      amenities: ['WiFi', 'Parking', 'Climate Control', 'Security'],
      rating: 4.0 + Math.random() * 1.0,
      total_reviews: Math.floor(Math.random() * 30) + 5,
      availability: 'Available',
      images: [],
      description: `Professional ${studio.type.toLowerCase()} available for rent. Equipped with ${studio.equipment.join(', ')}.`,
      rules: ['No smoking', 'Clean up after use', 'Respect equipment'],
      created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };
    await kv.set(`studio:${studioListing.id}`, studioListing);
  }

  // 3. EVENTS MARKETPLACE DATA
  const eventData = [
    { user: users[15], title: 'Art Gallery Opening Night', type: 'Exhibition', price: 25, category: 'Art Show' },
    { user: users[16], title: 'Photography Workshop: Portrait Techniques', type: 'Workshop', price: 85, category: 'Education' },
    { user: users[17], title: 'Music Industry Networking Mixer', type: 'Networking', price: 15, category: 'Networking' },
    { user: users[18], title: 'Digital Art Masterclass', type: 'Workshop', price: 120, category: 'Education' },
    { user: users[19], title: 'Film Screening & Discussion', type: 'Screening', price: 20, category: 'Film' }
  ];

  for (let i = 0; i < eventData.length; i++) {
    const event = eventData[i];
    const profile = await kv.get(`user_profile:${event.user.id}`);
    const eventListing = {
      id: `event_${i + 1}`,
      organizer_id: event.user.id,
      title: event.title,
      type: event.type,
      category: event.category,
      location: profile ? profile.location : 'New York, NY',
      venue: 'Creative Arts Center',
      date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      time: ['6:00 PM', '7:00 PM', '8:00 PM'][Math.floor(Math.random() * 3)],
      duration: ['2 hours', '3 hours', '4 hours'][Math.floor(Math.random() * 3)],
      price: event.price,
      capacity: 50 + Math.floor(Math.random() * 100),
      attendees: Math.floor(Math.random() * 30),
      description: `Join us for an exciting ${event.type.toLowerCase()} featuring industry professionals and networking opportunities.`,
      requirements: [],
      tags: [event.category.toLowerCase(), event.type.toLowerCase()],
      images: [],
      created_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };
    await kv.set(`event:${eventListing.id}`, eventListing);
  }

  // 4. INVESTMENT MARKETPLACE DATA
  const investmentData = [
    { user: users[10], title: 'Digital Art NFT Collection Launch', type: 'NFT Project', fundingGoal: 50000, category: 'Digital Art' },
    { user: users[11], title: 'Independent Film Production', type: 'Film Project', fundingGoal: 250000, category: 'Film' },
    { user: users[12], title: 'Photography Equipment Rental Business', type: 'Business', fundingGoal: 75000, category: 'Photography' },
    { user: users[13], title: 'Music Album Production', type: 'Music Project', fundingGoal: 30000, category: 'Music' },
    { user: users[14], title: 'Art Gallery Expansion', type: 'Real Estate', fundingGoal: 150000, category: 'Gallery' }
  ];

  for (let i = 0; i < investmentData.length; i++) {
    const investment = investmentData[i];
    const profile = await kv.get(`user_profile:${investment.user.id}`);
    const currentFunding = Math.floor(investment.fundingGoal * (Math.random() * 0.7 + 0.1)); // 10-80% funded
    const investmentListing = {
      id: `investment_${i + 1}`,
      user_id: investment.user.id,
      title: investment.title,
      type: investment.type,
      category: investment.category,
      fundingGoal: investment.fundingGoal,
      currentFunding: currentFunding,
      investors: Math.floor(currentFunding / 1000),
      equity: Math.floor(Math.random() * 20) + 5, // 5-25% equity
      roi_projection: Math.floor(Math.random() * 30) + 10, // 10-40% ROI
      timeline: ['6 months', '12 months', '18 months', '24 months'][Math.floor(Math.random() * 4)],
      risk_level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      description: `Exciting investment opportunity in ${investment.category.toLowerCase()}. Join us in revolutionizing the creative industry.`,
      business_plan: `Detailed business plan available upon request.`,
      location: profile ? profile.location : 'New York, NY',
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };
    await kv.set(`investment:${investmentListing.id}`, investmentListing);
  }

  // 5. LEGAL SERVICES MARKETPLACE DATA
  const legalData = [
    { user: users[15], name: 'Creative Rights Law Firm', specialization: 'Intellectual Property', hourlyRate: 350 },
    { user: users[16], name: 'Entertainment Legal Services', specialization: 'Entertainment Law', hourlyRate: 400 },
    { user: users[17], name: 'Digital Media Legal Group', specialization: 'Digital Rights', hourlyRate: 300 },
    { user: users[18], name: 'Art Contract Specialists', specialization: 'Contract Law', hourlyRate: 275 },
    { user: users[19], name: 'Music Industry Legal Advisors', specialization: 'Music Law', hourlyRate: 325 }
  ];

  for (let i = 0; i < legalData.length; i++) {
    const legal = legalData[i];
    const profile = await kv.get(`user_profile:${legal.user.id}`);
    const legalListing = {
      id: `legal_${i + 1}`,
      provider_id: legal.user.id,
      firm_name: legal.name,
      specialization: legal.specialization,
      hourlyRate: legal.hourlyRate,
      location: profile ? profile.location : 'New York, NY',
      services: ['Contract Review', 'Legal Consultation', 'Dispute Resolution', 'Documentation'],
      experience: Math.floor(Math.random() * 15) + 5 + ' years',
      rating: 4.2 + Math.random() * 0.8,
      total_reviews: Math.floor(Math.random() * 25) + 10,
      bar_admission: ['New York', 'California', 'Illinois'][Math.floor(Math.random() * 3)],
      languages: ['English', 'Spanish', 'French'][Math.floor(Math.random() * 3)],
      availability: 'Available',
      description: `Professional legal services specializing in ${legal.specialization.toLowerCase()} for creative professionals.`,
      credentials: ['JD from Harvard Law School', 'Licensed Attorney', 'Member of Bar Association'],
      created_at: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };
    await kv.set(`legal_service:${legalListing.id}`, legalListing);
  }

  // 6. ARTWORK DATA (Enhanced)
  const artworkData = [
    { user: users[0], title: 'Digital Landscape Series #1', category: 'Digital Art', mediaType: 'image', price: 450 },
    { user: users[1], title: 'Abstract Composition in Blue', category: 'Digital Art', mediaType: 'image', price: 320 },
    { user: users[2], title: 'Character Design Portfolio', category: 'Character Design', mediaType: 'image', price: 275 },
    { user: users[3], title: 'Urban Photography Collection', category: 'Photography', mediaType: 'image', price: 180 },
    { user: users[4], title: 'Wedding Portfolio Highlights', category: 'Photography', mediaType: 'image', price: 95 },
    { user: users[5], title: 'Brand Identity Package', category: 'Graphic Design', mediaType: 'image', price: 850 },
    { user: users[6], title: 'Commercial Voice Reel', category: 'Audio', mediaType: 'audio', price: 200 },
    { user: users[7], title: 'Marketing Copy Samples', category: 'Writing', mediaType: 'document', price: 150 },
    { user: users[8], title: 'Fashion Editorial Series', category: 'Photography', mediaType: 'image', price: 650 },
    { user: users[9], title: 'Corporate Video Reel', category: 'Video', mediaType: 'video', price: 400 }
  ];

  for (let i = 0; i < artworkData.length; i++) {
    const artwork = artworkData[i];
    const artworkListing = {
      id: `artwork_${i + 1}`,
      title: artwork.title,
      artist_name: artwork.user.name,
      artist_id: artwork.user.id,
      description: `Professional ${artwork.category.toLowerCase()} piece showcasing high-quality creative work.`,
      price: artwork.price,
      image_url: '',
      media_type: artwork.mediaType,
      category: artwork.category,
      is_for_sale: true,
      views_count: Math.floor(Math.random() * 500) + 50,
      likes_count: Math.floor(Math.random() * 100) + 10,
      tags: [artwork.category.toLowerCase().replace(' ', '-')],
      dimensions: artwork.mediaType === 'image' ? '1920x1080' : '',
      file_size: artwork.mediaType === 'image' ? '2.5MB' : '',
      created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };
    await kv.set(`artwork:${artworkListing.id}`, artworkListing);
  }

  // 7. REVIEWS DATA
  const reviewData = [
    { reviewed_user_id: users[0].id, reviewer_name: 'Client A', rating: 5, comment: 'Excellent portrait photographer! Very professional and delivered stunning results.' },
    { reviewed_user_id: users[1].id, reviewer_name: 'Client B', rating: 4, comment: 'Great video editing skills. Fast turnaround and creative solutions.' },
    { reviewed_user_id: users[2].id, reviewer_name: 'Client C', rating: 5, comment: 'Amazing character designs! Exactly what we were looking for.' },
    { reviewed_user_id: users[3].id, reviewer_name: 'Client D', rating: 4, comment: 'Professional recording engineer with top-notch equipment.' },
    { reviewed_user_id: users[4].id, reviewer_name: 'Client E', rating: 5, comment: 'Perfect wedding photographer. Captured every special moment beautifully.' }
  ];

  for (let i = 0; i < reviewData.length; i++) {
    const review = reviewData[i];
    const reviewListing = {
      id: `review_${i + 1}`,
      reviewed_user_id: review.reviewed_user_id,
      reviewer_name: review.reviewer_name,
      rating: review.rating,
      comment: review.comment,
      module: 'talent',
      listing_id: `talent_${i + 1}`,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    await kv.set(`review:${reviewListing.id}`, reviewListing);
  }

  console.log('Comprehensive data seeding completed successfully!');
  return {
    users: users.length,
    talents: talentData.length,
    studios: studioData.length,
    events: eventData.length,
    investments: investmentData.length,
    legalServices: legalData.length,
    artworks: artworkData.length,
    reviews: reviewData.length
  };
}

