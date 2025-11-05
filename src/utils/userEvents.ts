/**
 * Utility functions for creating user events in the system
 */

export interface CreateEventParams {
  user_id: number | string;
  title: string;
  description?: string;
  event_type: 'listing' | 'meeting' | 'deadline' | 'payment' | 'session' | 'collaboration' | 'update' | 'creation';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'upcoming' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  start_date?: string; // YYYY-MM-DD format
  start_time?: string; // HH:MM format
  end_date?: string;
  end_time?: string;
  all_day?: boolean;
  related_entity_type?: 'asset' | 'talent' | 'product_service' | 'legal' | 'education' | 'studio' | 'ticket' | 'collaboration';
  related_entity_id?: number;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  is_online?: boolean;
  online_link?: string;
  participants?: any[];
  invoice_number?: string;
  invoice_id?: number;
  amount?: number;
  currency?: string;
  reminder_enabled?: boolean;
  reminder_minutes_before?: number;
  metadata?: Record<string, any>;
  tags?: string[];
}

/**
 * Create a user event record
 */
export const createUserEvent = async (params: CreateEventParams): Promise<boolean> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No access token found, skipping event creation');
      return false;
    }

    // Set default start_date to today if not provided
    const startDate = params.start_date || new Date().toISOString().split('T')[0];
    
    const eventData = {
      user_id: typeof params.user_id === 'string' ? parseInt(params.user_id) : params.user_id,
      title: params.title,
      description: params.description || '',
      event_type: params.event_type,
      priority: params.priority || 'medium',
      status: params.status || 'upcoming',
      start_date: startDate,
      start_time: params.start_time || null,
      end_date: params.end_date || null,
      end_time: params.end_time || null,
      all_day: params.all_day || false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      related_entity_type: params.related_entity_type || null,
      related_entity_id: params.related_entity_id || null,
      location: params.location || null,
      address: params.address || null,
      city: params.city || null,
      state: params.state || null,
      country: params.country || null,
      is_online: params.is_online || false,
      online_link: params.online_link || null,
      participants: params.participants || [],
      invoice_number: params.invoice_number || null,
      invoice_id: params.invoice_id || null,
      amount: params.amount || null,
      currency: params.currency || 'USD',
      reminder_enabled: params.reminder_enabled !== false,
      reminder_minutes_before: params.reminder_minutes_before || 60,
      metadata: params.metadata || {},
      tags: params.tags || []
    };

    const response = await fetch('http://localhost:5001/api/user-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create user event:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error creating user event:', error);
    return false;
  }
};

/**
 * Create an event when a listing is created
 */
export const createListingCreationEvent = async (
  user_id: number | string,
  entity_type: 'asset' | 'talent' | 'product_service' | 'legal' | 'education',
  entity_id: number,
  title: string,
  description?: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  return createUserEvent({
    user_id,
    title: `${entity_type.charAt(0).toUpperCase() + entity_type.slice(1).replace('_', ' ')} Listing Created: ${title}`,
    description: description || `New ${entity_type.replace('_', ' ')} listing created`,
    event_type: 'creation',
    related_entity_type: entity_type,
    related_entity_id: entity_id,
    priority: 'medium',
    status: 'upcoming',
    tags: ['listing', entity_type, 'creation'],
    metadata: {
      action: 'listing_created',
      entity_type,
      entity_id,
      ...metadata
    }
  });
};

/**
 * Create an event when a listing is updated
 */
export const createListingUpdateEvent = async (
  user_id: number | string,
  entity_type: 'asset' | 'talent' | 'product_service' | 'legal' | 'education',
  entity_id: number,
  title: string,
  description?: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  return createUserEvent({
    user_id,
    title: `${entity_type.charAt(0).toUpperCase() + entity_type.slice(1).replace('_', ' ')} Listing Updated: ${title}`,
    description: description || `${entity_type.replace('_', ' ')} listing updated`,
    event_type: 'update',
    related_entity_type: entity_type,
    related_entity_id: entity_id,
    priority: 'low',
    status: 'completed',
    tags: ['listing', entity_type, 'update'],
    metadata: {
      action: 'listing_updated',
      entity_type,
      entity_id,
      ...metadata
    }
  });
};

/**
 * Create an event for a studio booking
 */
export const createStudioBookingEvent = async (
  user_id: number | string,
  studio_id: number,
  studio_name: string,
  booking_date: string,
  start_time?: string,
  end_time?: string,
  location?: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  return createUserEvent({
    user_id,
    title: `Studio Booking: ${studio_name}`,
    description: `Photography/video session at ${studio_name}`,
    event_type: 'session',
    related_entity_type: 'studio',
    related_entity_id: studio_id,
    priority: 'high',
    status: 'upcoming',
    start_date: booking_date,
    start_time: start_time || null,
    end_time: end_time || null,
    location: location || null,
    tags: ['studio', 'booking', 'session'],
    metadata: {
      action: 'studio_booking',
      studio_id,
      ...metadata
    }
  });
};

/**
 * Create an event for a collaboration deadline
 */
export const createCollaborationDeadlineEvent = async (
  user_id: number | string,
  collaboration_id: number,
  collaboration_title: string,
  deadline_date: string,
  description?: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  return createUserEvent({
    user_id,
    title: `Collaboration Deadline: ${collaboration_title}`,
    description: description || `Deadline for collaboration project`,
    event_type: 'deadline',
    related_entity_type: 'collaboration',
    related_entity_id: collaboration_id,
    priority: 'high',
    status: 'upcoming',
    start_date: deadline_date,
    reminder_enabled: true,
    reminder_minutes_before: 1440, // 24 hours before
    tags: ['collaboration', 'deadline'],
    metadata: {
      action: 'collaboration_deadline',
      collaboration_id,
      ...metadata
    }
  });
};

/**
 * Create an event for a payment due
 */
export const createPaymentDueEvent = async (
  user_id: number | string,
  invoice_number: string,
  amount: number,
  due_date: string,
  description?: string,
  invoice_id?: number,
  metadata?: Record<string, any>
): Promise<boolean> => {
  return createUserEvent({
    user_id,
    title: `Payment Due: Invoice #${invoice_number}`,
    description: description || `Payment due for invoice #${invoice_number}`,
    event_type: 'payment',
    priority: 'urgent',
    status: 'upcoming',
    start_date: due_date,
    invoice_number,
    invoice_id,
    amount,
    currency: 'USD',
    reminder_enabled: true,
    reminder_minutes_before: 2880, // 48 hours before
    tags: ['payment', 'invoice', 'due'],
    metadata: {
      action: 'payment_due',
      invoice_number,
      invoice_id,
      ...metadata
    }
  });
};

/**
 * Create an event for a meeting/appointment
 */
export const createMeetingEvent = async (
  user_id: number | string,
  title: string,
  meeting_date: string,
  start_time: string,
  end_time?: string,
  location?: string,
  description?: string,
  participants?: any[],
  metadata?: Record<string, any>
): Promise<boolean> => {
  return createUserEvent({
    user_id,
    title,
    description: description || 'Scheduled meeting',
    event_type: 'meeting',
    priority: 'high',
    status: 'upcoming',
    start_date: meeting_date,
    start_time,
    end_time: end_time || null,
    location: location || null,
    participants: participants || [],
    reminder_enabled: true,
    reminder_minutes_before: 60, // 1 hour before
    tags: ['meeting', 'appointment'],
    metadata: {
      action: 'meeting_scheduled',
      ...metadata
    }
  });
};

