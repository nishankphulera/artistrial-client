// Public routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE: '/profile/:userId?',
  COMMUNITY: '/community',
  TALENT_MARKETPLACE: '/talent-marketplace',
  TALENT_DETAIL: '/talent/:id',
  MARKETPLACE: '/marketplace',
  STUDIOS: '/studios',
  INVESTORS: '/investors',
  TICKETS: '/tickets',
  LEGAL_SERVICES: '/legal-services',
  PRODUCT_SERVICES: '/product-services',
  EDUCATION: '/education',
} as const;

// Dashboard routes
export const DASHBOARD_ROUTES = {
  ROOT: '/dashboard',
  ACTIVITY: '/dashboard/activity',
  ANALYTICS: '/dashboard/analytics',
  CHAT: '/dashboard/chat',
  CONNECTIONS: '/dashboard/connections',
  TALENT_MARKETPLACE: '/dashboard/talent-marketplace',
  TALENT_DETAIL: '/dashboard/talent/:id',
  MARKETPLACE: '/dashboard/marketplace',
  STUDIOS: '/dashboard/studios',
  INVESTORS: '/dashboard/investors',
  TICKETS: '/dashboard/tickets',
  LEGAL_SERVICES: '/dashboard/legal-services',
  PRODUCT_SERVICES: '/dashboard/product-services',
  EDUCATION: '/dashboard/education',
  COLLABORATIONS: '/dashboard/collaborations',
  COLLABORATIONS_BROWSE: '/dashboard/collaborations/browse',
  COLLABORATIONS_CREATE: '/dashboard/collaborations/create',
  COLLABORATIONS_APPLICATIONS: '/dashboard/collaborations/applications',
  COLLABORATIONS_FLOW: '/dashboard/collaborations/flow',
  GIGS: '/dashboard/gigs',
  PROFILE: '/dashboard/profile',
  PROFILE_SETTINGS: '/dashboard/profile-settings',
  CART: '/dashboard/cart',
  ORDERS: '/dashboard/orders',
  FORM_EXAMPLES: '/dashboard/form-examples',
  CREATE_IP: '/dashboard/create-ip',
  ONGOING_CREATION: '/dashboard/ongoing-creation',
  ONGOING_CREATION_DETAIL: '/dashboard/ongoing-creation/:id',
  CREATIONS: '/dashboard/creations',
  MY_OGS: '/dashboard/my-ogs',
} as const;

// Create listing routes
export const CREATE_ROUTES = {
  PRODUCT_SERVICES: '/dashboard/create-product-services',
  TALENT: '/dashboard/create-talent',
  ASSET: '/dashboard/create-asset',
  STUDIO: '/dashboard/create-studio',
  INVESTOR: '/dashboard/create-investor',
  EVENT: '/dashboard/create-event',
  LEGAL: '/dashboard/create-legal',
  EDUCATION: '/dashboard/create-education',
} as const;

// Leads management routes
export const LEADS_ROUTES = {
  STREAM: '/dashboard/leads-stream',
  CAPTURED: '/dashboard/captured-leads',
  ANALYTICS: '/dashboard/leads-analytics',
  SETTINGS: '/dashboard/leads-settings',
} as const;

// Business CRM routes
export const BUSINESS_ROUTES = {
  OVERVIEW: '/dashboard/business-overview',
  CLIENTS: '/dashboard/clients',
  CONTACTS: '/dashboard/contacts',
  DEALS: '/dashboard/deals',
  TASKS: '/dashboard/tasks',
  REPORTS: '/dashboard/business-reports',
} as const;

// Legacy routes
export const LEGACY_ROUTES = {
  PROFILE_SETTINGS: '/profile-settings',
  PROFILE_DEBUG: '/profile-debug',
  CREATE_LISTING: '/create-listing',
  COLLABORATIONS: '/collaborations',
  COLLABORATIONS_BROWSE: '/collaborations/browse',
  COLLABORATIONS_CREATE: '/collaborations/create',
  COLLABORATIONS_APPLICATIONS: '/collaborations/applications',
  COLLABORATIONS_FLOW: '/collaborations/flow',
  CART: '/cart',
  ORDERS: '/orders',
} as const;