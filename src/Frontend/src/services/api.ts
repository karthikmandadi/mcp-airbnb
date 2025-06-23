import axios from 'axios';
import {
  ServicesStatus,
  Property,
  PropertyDto,
  Booking,
  Guest,
  AIAgentRequest,
  AIAgentResponse,
  PropertyOptimizationRequest,
  PropertyOptimizationResponse,
  PricingRequest,
  PricingResponse,
  MarketAnalysisRequest,
  MarketAnalysisResponse,
  GuestCommunicationRequest,
  GuestCommunicationResponse,
  AIInteraction,
  PropertyAnalytics,
  DashboardMetrics,
  ServiceMetrics,
  SearchParams,
  PaginatedResponse,
} from '../types';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5010';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth or logging
api.interceptors.request.use(
  (config) => {
    // Add auth headers if needed
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Gateway Service API (Mock for now)
export const gatewayService = {
  getHealth: async () => {
    // Mock health response
    return { status: 'healthy', timestamp: new Date().toISOString() };
  },

  getServicesStatus: async (): Promise<ServicesStatus> => {
    // Mock services status
    return {
      timestamp: new Date().toISOString(),
      services: {
        'property-service': {
          status: 'healthy',
          statusCode: 200,
          responseTime: new Date().toISOString(),
        },
        'pricing-service': {
          status: 'healthy',
          statusCode: 200,
          responseTime: new Date().toISOString(),
        },
        'ai-agent-service': {
          status: 'healthy',
          statusCode: 200,
          responseTime: new Date().toISOString(),
        },
        'guest-service': {
          status: 'healthy',
          statusCode: 200,
          responseTime: new Date().toISOString(),
        },
        'analytics-service': {
          status: 'healthy',
          statusCode: 200,
          responseTime: new Date().toISOString(),
        },
      },
    };
  },
};

// Property Service API
export const propertyService = {
  getProperties: async (params?: SearchParams): Promise<Property[]> => {
    const response = await api.get('/api/Properties', { params });
    return response.data;
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get(`/api/Properties/${id}`);
    return response.data;
  },

  createProperty: async (property: Omit<PropertyDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> => {
    const response = await api.post('/api/Properties', property);
    return response.data;
  },

  updateProperty: async (id: string, property: Partial<PropertyDto>): Promise<Property> => {
    const response = await api.put(`/api/Properties/${id}`, property);
    return response.data;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/api/Properties/${id}`);
  },

  getPropertyAnalytics: async (id: string): Promise<PropertyAnalytics> => {
    const response = await api.get(`/api/Properties/${id}/analytics`);
    return response.data;
  },
};

// AI Agent Service API (Mock for now)
export const aiAgentService = {
  processRequest: async (request: AIAgentRequest): Promise<AIAgentResponse> => {
    // Mock AI response
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    return {
      response: 'AI agent processed your request successfully.',
      actions: {},
      confidenceScore: 0.95,
      interactionId: 'mock-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
  },

  optimizeProperty: async (request: PropertyOptimizationRequest): Promise<PropertyOptimizationResponse> => {
    // Mock property optimization
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      optimizedTitle: 'Luxury Waterfront Retreat with Stunning Ocean Views',
      optimizedDescription: 'Experience the ultimate getaway in this beautifully renovated oceanfront property. Features modern amenities, private beach access, and breathtaking sunset views. Perfect for families and groups seeking a memorable vacation experience.',
      recommendedAmenities: ['Ocean View', 'Private Beach', 'Hot Tub', 'WiFi', 'Parking', 'Kitchen', 'Air Conditioning'],
      pricingStrategy: 'Implement dynamic pricing with 15% premium during peak season and local events',
      marketingTips: [
        'Highlight the ocean view in your title and photos',
        'Emphasize privacy and exclusivity',
        'Mention nearby attractions and activities',
        'Optimize for weekend getaways and family vacations'
      ],
      confidenceScore: 0.92,
      estimatedImpact: {
        occupancyIncrease: 23,
        revenueIncrease: 18,
      },
    };
  },

  generatePricingStrategy: async (request: PricingRequest): Promise<PricingResponse> => {
    // Mock pricing strategy
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      recommendedPrice: request.guestCount > 4 ? 245 : 185,
      basePrice: 150,
      dynamicAdjustment: request.guestCount > 4 ? 95 : 35,
      pricingFactors: {
        'Base Rate': 150,
        'Seasonal Adjustment': 20,
        'Guest Count Premium': request.guestCount > 4 ? 25 : 10,
        'Local Events': 15,
        'Demand Surge': 10,
      },
      calculatedAt: new Date().toISOString(),
    };
  },

  generateGuestResponse: async (request: GuestCommunicationRequest): Promise<GuestCommunicationResponse> => {
    // Mock guest communication
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      suggestedResponse: 'Thank you for your message! Check-in is available from 3:00 PM onwards. We recommend arriving between 3:00 PM and 8:00 PM for the smoothest experience. Our property manager will send you detailed check-in instructions 24 hours before your arrival. Is there anything specific you\'d like to know about the property or the area?',
      tone: 'friendly',
      actionItems: ['Send check-in instructions', 'Provide local area guide'],
      escalationRequired: false,
      confidenceScore: 0.89,
    };
  },

  analyzeMarket: async (request: MarketAnalysisRequest): Promise<MarketAnalysisResponse> => {
    // Mock market analysis
    await new Promise(resolve => setTimeout(resolve, 1800));
    return {
      averagePrice: 175,
      occupancyRate: 76,
      competitorCount: 12,
      seasonalTrends: [
        { month: 'Jan', averagePrice: 145, occupancyRate: 65 },
        { month: 'Feb', averagePrice: 155, occupancyRate: 70 },
        { month: 'Mar', averagePrice: 175, occupancyRate: 78 },
        { month: 'Apr', averagePrice: 195, occupancyRate: 85 },
      ],
      recommendations: [
        'Consider increasing your base rate by 10-15% to match market average',
        'Focus on weekend bookings when demand is highest',
        'Add premium amenities to justify higher pricing',
        'Optimize for business travelers during weekdays',
      ],
    };
  },

  getInteractions: async (limit: number = 10): Promise<AIInteraction[]> => {
    // Mock interactions
    return Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      id: `interaction-${i}`,
      userId: 'user-123',
      requestType: ['optimization', 'pricing', 'communication'][i % 3],
      request: 'Sample AI request',
      response: 'Sample AI response',
      confidenceScore: 0.8 + (i * 0.05),
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      processingTime: 1200 + (i * 100),
    }));
  },

  getAnalytics: async () => {
    return {
      totalInteractions: 156,
      averageConfidence: 0.87,
      popularRequests: ['property optimization', 'pricing strategy', 'guest communication'],
    };
  },

  getHealth: async () => {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  },
};

// Pricing Service API (Mock for now)
export const pricingService = {
  calculatePricing: async (request: PricingRequest): Promise<PricingResponse> => {
    // Mock pricing calculation
    await new Promise(resolve => setTimeout(resolve, 1000));
    const basePrice = 150;
    const seasonalMultiplier = request.seasonality === 'high' ? 1.3 : request.seasonality === 'low' ? 0.8 : 1.0;
    const eventBonus = request.localEvents && request.localEvents.length > 0 ? 25 : 0;
    const guestMultiplier = request.guestCount > 4 ? 1.2 : 1.0;
    
    const recommendedPrice = Math.round(basePrice * seasonalMultiplier * guestMultiplier + eventBonus);
    
    return {
      recommendedPrice,
      basePrice,
      dynamicAdjustment: recommendedPrice - basePrice,
      pricingFactors: {
        'Base Price': basePrice,
        'Seasonal Multiplier': seasonalMultiplier,
        'Guest Count': guestMultiplier,
        'Local Events': eventBonus,
      },
      calculatedAt: new Date().toISOString(),
    };
  },

  getPricingFactors: async (propertyId: string): Promise<Record<string, number>> => {
    // Mock pricing factors
    return {
      'Location Score': 0.85,
      'Property Size': 0.92,
      'Amenities Score': 0.78,
      'Market Demand': 0.88,
      'Seasonal Factor': 0.95,
    };
  },

  getMarketAnalysis: async (location: string) => {
    // Mock market analysis
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      averagePrice: 175,
      occupancyRate: 76,
      competitorCount: 12,
      seasonalTrends: [
        { month: 'Jan', averagePrice: 145, occupancyRate: 65 },
        { month: 'Feb', averagePrice: 155, occupancyRate: 70 },
        { month: 'Mar', averagePrice: 175, occupancyRate: 78 },
        { month: 'Apr', averagePrice: 195, occupancyRate: 85 },
      ],
      recommendations: [
        `Market analysis for ${location} shows strong demand`,
        'Consider premium pricing during peak season',
        'Focus on amenities that differentiate your property',
      ],
    };
  },
};

// Guest Service API (Mock for now)
export const guestService = {
  getGuests: async (): Promise<Guest[]> => {
    // Mock guests data
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0456',
        createdAt: new Date().toISOString(),
      },
    ];
  },

  getGuest: async (id: string): Promise<Guest> => {
    // Mock guest data
    return {
      id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      createdAt: new Date().toISOString(),
    };
  },

  createGuest: async (guest: Omit<Guest, 'id' | 'createdAt'>): Promise<Guest> => {
    // Mock guest creation
    return {
      ...guest,
      id: 'new-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
  },

  updateGuest: async (id: string, guest: Partial<Guest>): Promise<Guest> => {
    // Mock guest update
    return {
      id,
      firstName: guest.firstName || 'John',
      lastName: guest.lastName || 'Doe',
      email: guest.email || 'john.doe@email.com',
      phone: guest.phone || '+1-555-0123',
      createdAt: new Date().toISOString(),
    };
  },

  deleteGuest: async (id: string): Promise<void> => {
    // Mock guest deletion
    await new Promise(resolve => setTimeout(resolve, 300));
  },
};

// Booking Service API (placeholder - to be implemented)
export const bookingService = {
  getBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/api/bookings');
    return response.data;
  },

  getBooking: async (id: string): Promise<Booking> => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    const response = await api.post('/api/bookings', booking);
    return response.data;
  },

  updateBooking: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    const response = await api.put(`/api/bookings/${id}`, booking);
    return response.data;
  },

  cancelBooking: async (id: string): Promise<void> => {
    await api.delete(`/api/bookings/${id}`);
  },
};

// Analytics Service API (placeholder - to be implemented)
export const analyticsService = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  },

  getServiceMetrics: async (): Promise<ServiceMetrics[]> => {
    const response = await api.get('/api/analytics/services');
    return response.data;
  },

  getPropertyPerformance: async (propertyId: string, period: string = '30d') => {
    const response = await api.get(`/api/analytics/properties/${propertyId}/performance?period=${period}`);
    return response.data;
  },

  getRevenueAnalytics: async (period: string = '30d') => {
    const response = await api.get(`/api/analytics/revenue?period=${period}`);
    return response.data;
  },

  getOccupancyAnalytics: async (period: string = '30d') => {
    const response = await api.get(`/api/analytics/occupancy?period=${period}`);
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  formatError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  isNetworkError: (error: any): boolean => {
    return error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED';
  },

  retry: async <T>(fn: () => Promise<T>, retries: number = 3, delay: number = 1000): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return apiUtils.retry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  },
};

// MCP Service
export const mcpService = {
  async getResources() {
    try {
      const response = await fetch(`http://localhost:5270/api/mcp/resources`);
      if (!response.ok) {
        throw new Error('Failed to fetch MCP resources');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock MCP resources due to backend unavailability:', error);
      // Fallback to mock data
      return {
        resources: [
          {
            uri: "airbnb://properties",
            name: "Properties Database",
            description: "Access to all property listings in the Airbnb system"
          },
          {
            uri: "airbnb://analytics", 
            name: "Analytics Data",
            description: "Real-time analytics and performance metrics"
          }
        ]
      };
    }
  },

  async getTools() {
    try {
      const response = await fetch(`http://localhost:5270/api/mcp/tools`);
      if (!response.ok) {
        throw new Error('Failed to fetch MCP tools');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock MCP tools due to backend unavailability:', error);
      // Fallback to mock data
      return {
        tools: [
          {
            name: "optimize_property",
            description: "AI-powered property optimization",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "calculate_dynamic_pricing",
            description: "Calculate optimal pricing",
            inputSchema: { type: "object", properties: {} }
          }
        ]
      };
    }
  },

  async readResource(resourceUri: string) {
    try {
      const response = await fetch(`http://localhost:5270/api/mcp/resources/read?resourceUri=${encodeURIComponent(resourceUri)}`);
      if (!response.ok) {
        throw new Error('Failed to read MCP resource');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock resource data due to backend unavailability:', error);
      return { content: { message: "Mock resource data" } };
    }
  },

  async callTool(toolName: string, toolArguments: Record<string, any>) {
    try {
      const response = await fetch(`http://localhost:5270/api/mcp/tools/${toolName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolArguments),
      });
      if (!response.ok) {
        throw new Error('Failed to call MCP tool');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock tool response due to backend unavailability:', error);
      return { result: "Mock tool execution completed successfully" };
    }
  },

  async runAnalysis(request: any) {
    try {
      const response = await fetch(`http://localhost:5270/api/mcp/analysis/comprehensive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error('Failed to run MCP analysis');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock analysis due to backend unavailability:', error);
      return { 
        analysis: "Mock comprehensive analysis completed",
        insights: ["Mock insight 1", "Mock insight 2"]
      };
    }
  },
};

// Export default api instance for custom requests
export default api;
