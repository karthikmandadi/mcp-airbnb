// Service Types
export interface ServiceStatus {
  status: 'healthy' | 'unhealthy' | 'error' | 'loading';
  statusCode?: number;
  error?: string;
  responseTime: string;
}

export interface ServicesStatus {
  timestamp: string;
  services: {
    'property-service': ServiceStatus;
    'pricing-service': ServiceStatus;
    'ai-agent-service': ServiceStatus;
    'guest-service'?: ServiceStatus;
    'analytics-service'?: ServiceStatus;
  };
}

// Property Types
export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  basePrice: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
}

export interface PropertyDto {
  id: string;
  title: string;
  description: string;
  address: string;
  basePrice: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

// Guest Types
export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

// AI Agent Types
export interface AIAgentRequest {
  requestType: string;
  context: any;
  userId?: string;
}

export interface AIAgentResponse {
  response: string;
  actions: Record<string, any>;
  confidenceScore: number;
  interactionId: string;
  timestamp: string;
}

export interface PropertyOptimizationRequest {
  propertyId: string;
  currentData: {
    occupancyRate: number;
    averageRating: number;
    recentBookings: number;
    competitorPrices: number[];
  };
  goals: string[];
}

export interface PropertyOptimizationResponse {
  optimizedTitle: string;
  optimizedDescription: string;
  recommendedAmenities: string[];
  pricingStrategy: string;
  marketingTips: string[];
  confidenceScore: number;
  estimatedImpact: {
    occupancyIncrease: number;
    revenueIncrease: number;
  };
}

// Pricing Types
export interface PricingRequest {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  seasonality?: string;
  localEvents?: string[];
  competitorAnalysis?: boolean;
}

export interface PricingResponse {
  recommendedPrice: number;
  basePrice: number;
  dynamicAdjustment: number;
  pricingFactors: Record<string, number>;
  calculatedAt: string;
}

// Analytics Types
export interface PropertyAnalytics {
  propertyId: string;
  viewCount: number;
  bookingRate: number;
  totalRevenue: number;
  averageStayLength: number;
  occupancyRate: number;
  averageRating: number;
  period: string;
}

export interface AIInteraction {
  id: string;
  userId: string;
  requestType: string;
  request: string;
  response: string;
  confidenceScore: number;
  timestamp: string;
  processingTime: number;
}

// Market Analysis Types
export interface MarketAnalysisRequest {
  location: string;
  propertyType: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface MarketAnalysisResponse {
  averagePrice: number;
  occupancyRate: number;
  competitorCount: number;
  seasonalTrends: Array<{
    month: string;
    averagePrice: number;
    occupancyRate: number;
  }>;
  recommendations: string[];
}

// Guest Communication Types
export interface GuestCommunicationRequest {
  bookingId: string;
  guestMessage: string;
  communicationType: 'inquiry' | 'complaint' | 'request' | 'general';
  context?: any;
}

export interface GuestCommunicationResponse {
  suggestedResponse: string;
  tone: 'professional' | 'friendly' | 'apologetic' | 'informative';
  actionItems: string[];
  escalationRequired: boolean;
  confidenceScore: number;
}

// Dashboard Types
export interface DashboardMetrics {
  totalProperties: number;
  activeBookings: number;
  totalRevenue: number;
  averageOccupancy: number;
  aiInteractions: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export interface ServiceMetrics {
  serviceName: string;
  requests: number;
  averageResponseTime: number;
  errorRate: number;
  uptime: number;
  lastUpdated: string;
}

// Form Types
export interface PropertyFormData {
  title: string;
  description: string;
  address: string;
  basePrice: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  status: 'active' | 'inactive' | 'maintenance';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

// Filter and Search Types
export interface PropertyFilter {
  status?: 'active' | 'inactive' | 'maintenance';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  maxGuests?: number;
  amenities?: string[];
  location?: string;
}

export interface SearchParams {
  query?: string;
  filters?: PropertyFilter;
  sortBy?: 'price' | 'rating' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

// MCP Types
export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface MCPRequest {
  method: string;
  params: any;
}

export interface MCPResponse {
  content?: any;
  isError: boolean;
  error?: string;
}
