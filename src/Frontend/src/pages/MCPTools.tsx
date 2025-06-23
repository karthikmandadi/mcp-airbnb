import React, { useState, useEffect } from 'react';
import { mcpService } from '../services/api';

interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  metadata?: Record<string, any>;
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

interface MCPAnalysisRequest {
  propertyId?: string;
  location?: string;
  propertyType?: string;
  includePropertyOptimization: boolean;
  includePricingAnalysis: boolean;
  includeMarketAnalysis: boolean;
  includeAnalytics: boolean;
  optimizationGoals?: string[];
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  timePeriod?: string;
  metrics?: string[];
}

const MCPTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'tools' | 'analysis' | 'playground'>('resources');
  const [resources, setResources] = useState<MCPResource[]>([]);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [toolArguments, setToolArguments] = useState<Record<string, any>>({});
  const [toolResult, setToolResult] = useState<any>(null);
  const [resourceResult, setResourceResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Analysis form state
  const [analysisRequest, setAnalysisRequest] = useState<MCPAnalysisRequest>({
    includePropertyOptimization: true,
    includePricingAnalysis: true,
    includeMarketAnalysis: true,
    includeAnalytics: true,
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    loadResources();
    loadTools();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await mcpService.getResources();
      
      if (data && data.resources) {
        setResources(data.resources);
      } else {
        // Fallback to mock data
        const mockResources: MCPResource[] = [
          {
            uri: 'airbnb://properties',
            name: 'Properties Database',
            description: 'Access to all property listings in the Airbnb system',
            mimeType: 'application/json',
            metadata: { schema: 'PropertyDto[]', capabilities: ['read', 'search', 'filter'] }
          },
          {
            uri: 'airbnb://analytics',
            name: 'Analytics Data',
            description: 'Real-time analytics and performance metrics',
            mimeType: 'application/json',
            metadata: { schema: 'AnalyticsData', capabilities: ['read', 'aggregate'] }
          },
          {
            uri: 'airbnb://market-data',
            name: 'Market Data',
            description: 'Market trends and competitive analysis data',
            mimeType: 'application/json',
            metadata: { schema: 'MarketData', capabilities: ['read', 'analyze'] }
          }
        ];
        setResources(mockResources);
      }
    } catch (err) {
      setError('MCP service unavailable - using mock data');
      // Mock data fallback
      const mockResources: MCPResource[] = [
        {
          uri: 'airbnb://properties',
          name: 'Properties Database',
          description: 'Access to all property listings in the Airbnb system',
          mimeType: 'application/json',
          metadata: { schema: 'PropertyDto[]', capabilities: ['read', 'search', 'filter'] }
        },
        {
          uri: 'airbnb://analytics',
          name: 'Analytics Data',
          description: 'Real-time analytics and performance metrics',
          mimeType: 'application/json',
          metadata: { schema: 'AnalyticsData', capabilities: ['read', 'aggregate'] }
        },
        {
          uri: 'airbnb://market-data',
          name: 'Market Data',
          description: 'Market trends and competitive analysis data',
          mimeType: 'application/json',
          metadata: { schema: 'MarketData', capabilities: ['read', 'analyze'] }
        }
      ];
      setResources(mockResources);
    } finally {
      setLoading(false);
    }
  };

  const loadTools = async () => {
    try {
      setLoading(true);
      const data = await mcpService.getTools();
      
      if (data && data.tools) {
        setTools(data.tools);
      } else {
        // Mock data fallback
        const mockTools: MCPTool[] = [
          {
            name: 'optimize_property_listing',
            description: 'Optimize property listing for better performance',
            inputSchema: {
              type: 'object',
              properties: {
                property_id: { type: 'string', description: 'The property ID' },
                optimization_goals: { 
                  type: 'array', 
                  items: { type: 'string', enum: ['occupancy', 'revenue', 'rating'] },
                  description: 'Goals for optimization'
                }
              },
              required: ['property_id', 'optimization_goals']
            }
          },
          {
            name: 'calculate_dynamic_pricing',
            description: 'Calculate optimal pricing based on market conditions',
            inputSchema: {
              type: 'object',
              properties: {
                property_id: { type: 'string', description: 'The property ID' },
                check_in_date: { type: 'string', format: 'date', description: 'Check-in date' },
                check_out_date: { type: 'string', format: 'date', description: 'Check-out date' },
                guest_count: { type: 'integer', description: 'Number of guests' },
                include_competitors: { type: 'boolean', description: 'Include competitor analysis' }
              },
              required: ['property_id', 'check_in_date', 'check_out_date']
            }
          },
          {
            name: 'analyze_market_conditions',
            description: 'Analyze local market conditions and demand patterns',
            inputSchema: {
              type: 'object',
              properties: {
                location: { type: 'string', description: 'Location for analysis' },
                property_type: { type: 'string', description: 'Type of property' },
                include_competitors: { type: 'boolean', description: 'Include competitor analysis' },
                analysis_depth: { type: 'string', enum: ['basic', 'detailed', 'comprehensive'] }
              },
              required: ['location']
            }
          },
          {
            name: 'generate_guest_response',
            description: 'Generate AI-powered responses to guest inquiries',
            inputSchema: {
              type: 'object',
              properties: {
                guest_message: { type: 'string', description: 'The guest message' },
                context: { type: 'string', description: 'Additional context' },
                tone: { type: 'string', enum: ['friendly', 'professional', 'casual'] },
                language: { type: 'string', description: 'Response language' }
              },
              required: ['guest_message']
            }
          },
          {
            name: 'search_properties',
            description: 'Search and filter properties based on criteria',
            inputSchema: {
              type: 'object',
              properties: {
                location: { type: 'string', description: 'Location filter' },
                price_range: {
                  type: 'object',
                  properties: {
                    min: { type: 'number' },
                    max: { type: 'number' }
                  }
                },
                property_type: { type: 'string', description: 'Type of property' },
                sort_by: { type: 'string', enum: ['price', 'rating', 'occupancy', 'revenue'] },
                limit: { type: 'integer', minimum: 1, maximum: 100 }
              }
            }
          },
          {
            name: 'get_performance_analytics',
            description: 'Retrieve detailed performance analytics',
            inputSchema: {
              type: 'object',
              properties: {
                property_id: { type: 'string', description: 'Property ID (optional)' },
                time_period: { type: 'string', enum: ['7d', '30d', '90d', '1y'] },
                metrics: {
                  type: 'array',
                  items: { type: 'string', enum: ['occupancy', 'revenue', 'rating', 'bookings', 'cancellations'] }
                }
              }
            }
          }
        ];
        setTools(mockTools);
      }
    } catch (err) {
      setError('MCP service unavailable - using mock data');
      // Mock data fallback
      const mockTools: MCPTool[] = [
        {
          name: 'optimize_property_listing',
          description: 'Optimize property listing for better performance',
          inputSchema: {
            type: 'object',
            properties: {
              property_id: { type: 'string', description: 'The property ID' },
              optimization_goals: { 
                type: 'array', 
                items: { type: 'string', enum: ['occupancy', 'revenue', 'rating'] },
                description: 'Goals for optimization'
              }
            },
            required: ['property_id', 'optimization_goals']
          }
        }
      ];
      setTools(mockTools);
    } finally {
      setLoading(false);
    }
  };

  const callTool = async () => {
    if (!selectedTool) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await mcpService.callTool(selectedTool, toolArguments);
      setToolResult(result);
    } catch (err) {
      // Fallback to mock response
      const mockResponse = {
        success: true,
        data: {
          toolName: selectedTool,
          arguments: toolArguments,
          result: `Mock result for ${selectedTool}`,
          timestamp: new Date().toISOString(),
          executionTime: Math.random() * 1000 + 500
        }
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setToolResult(mockResponse);
      setError('Using mock data - MCP service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const readResource = async (resourceUri: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mcpService.readResource(resourceUri);
      setResourceResult(result);
    } catch (err) {
      // Fallback to mock response
      const mockData = {
        uri: resourceUri,
        data: `Mock data for resource: ${resourceUri}`,
        timestamp: new Date().toISOString(),
        metadata: resources.find(r => r.uri === resourceUri)?.metadata
      };
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setResourceResult(mockData);
      setError('Using mock data - MCP service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const runComprehensiveAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mcpService.runAnalysis(analysisRequest);
      setAnalysisResult(result);
    } catch (err) {
      // Fallback to mock analysis
      const mockAnalysis = {
        analysis_id: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString(),
        results: {
          ...(analysisRequest.includePropertyOptimization && {
            property_optimization: {
              suggestions: [
                'Optimize photos for better appeal',
                'Update description to highlight unique features',
                'Adjust pricing strategy based on market trends'
              ],
              score: 85,
              potential_improvement: '15% increase in bookings'
            }
          }),
          ...(analysisRequest.includePricingAnalysis && {
            pricing_analysis: {
              current_price: 150,
              recommended_price: 175,
              price_change: '+16.7%',
              confidence: 92,
              reasoning: 'Market demand is high, competitors are pricing higher'
            }
          })
        },
        summary: `Completed comprehensive analysis`
      };
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysisResult(mockAnalysis);
      setError('Using mock data - MCP service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const renderToolInputs = () => {
    const tool = tools.find(t => t.name === selectedTool);
    if (!tool) return null;

    const properties = tool.inputSchema.properties || {};
    
    return (
      <div className="space-y-4">
        {Object.entries(properties).map(([key, schema]: [string, any]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {tool.inputSchema.required?.includes(key) && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Required</span>
              )}
            </label>
            {schema.type === 'string' && schema.enum ? (
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={toolArguments[key] || ''}
                onChange={(e) => setToolArguments(prev => ({ ...prev, [key]: e.target.value }))}
              >
                <option value="">Select {key}</option>
                {schema.enum.map((option: string) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : schema.type === 'boolean' ? (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={toolArguments[key] || false}
                  onChange={(e) => setToolArguments(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="mr-2"
                />
                {schema.description}
              </label>
            ) : schema.type === 'array' ? (
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${key} (comma-separated)`}
                rows={3}
                value={Array.isArray(toolArguments[key]) ? toolArguments[key].join(', ') : ''}
                onChange={(e) => {
                  const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                  setToolArguments(prev => ({ ...prev, [key]: values }));
                }}
              />
            ) : (
              <input
                type={schema.type === 'integer' ? 'number' : schema.format === 'date' ? 'date' : 'text'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={schema.description}
                value={toolArguments[key] || ''}
                onChange={(e) => setToolArguments(prev => ({ 
                  ...prev, 
                  [key]: schema.type === 'integer' ? parseInt(e.target.value) : e.target.value 
                }))}
              />
            )}
            <p className="text-sm text-gray-500 mt-1">{schema.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MCP Tools</h1>
              <p className="text-gray-600 mt-2">
                Model Context Protocol tools and resources for the Airbnb AI Agent
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                🤖 MCP Active
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'resources', label: '📄 Resources', tab: 'resources' as const },
                { id: 'tools', label: '🔧 Tools', tab: 'tools' as const },
                { id: 'analysis', label: '📊 Analysis', tab: 'analysis' as const },
                { id: 'playground', label: '🎮 Playground', tab: 'playground' as const }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === item.tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <div key={resource.uri} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.name}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">URI:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">{resource.uri}</code>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Type:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {resource.mimeType}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => readResource(resource.uri)}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Read Resource'}
                  </button>
                </div>
              ))}
            </div>

            {resourceResult && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Resource Data</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(resourceResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <div key={tool.name} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tool.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  
                  <button 
                    onClick={() => setSelectedTool(tool.name)}
                    className={`w-full px-4 py-2 rounded ${
                      selectedTool === tool.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {selectedTool === tool.name ? 'Selected' : 'Select Tool'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Comprehensive MCP Analysis</h3>
              <p className="text-gray-600 mb-6">
                Run a comprehensive analysis using multiple MCP tools
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter property ID"
                    value={analysisRequest.propertyId || ''}
                    onChange={(e) => setAnalysisRequest(prev => ({ ...prev, propertyId: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location"
                    value={analysisRequest.location || ''}
                    onChange={(e) => setAnalysisRequest(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Analysis Components</label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={analysisRequest.includePropertyOptimization}
                      onChange={(e) => setAnalysisRequest(prev => ({ 
                        ...prev, 
                        includePropertyOptimization: e.target.checked 
                      }))}
                      className="mr-2"
                    />
                    Property Optimization
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={analysisRequest.includePricingAnalysis}
                      onChange={(e) => setAnalysisRequest(prev => ({ 
                        ...prev, 
                        includePricingAnalysis: e.target.checked 
                      }))}
                      className="mr-2"
                    />
                    Pricing Analysis
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={analysisRequest.includeMarketAnalysis}
                      onChange={(e) => setAnalysisRequest(prev => ({ 
                        ...prev, 
                        includeMarketAnalysis: e.target.checked 
                      }))}
                      className="mr-2"
                    />
                    Market Analysis
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={analysisRequest.includeAnalytics}
                      onChange={(e) => setAnalysisRequest(prev => ({ 
                        ...prev, 
                        includeAnalytics: e.target.checked 
                      }))}
                      className="mr-2"
                    />
                    Performance Analytics
                  </label>
                </div>
              </div>

              <button 
                onClick={runComprehensiveAnalysis}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '🔄 Running Analysis...' : '▶️ Run Comprehensive Analysis'}
              </button>
            </div>

            {analysisResult && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
                <p className="text-gray-600 mb-4">
                  Analysis ID: {analysisResult.analysis_id} | Completed: {new Date(analysisResult.timestamp).toLocaleString()}
                </p>
                
                <div className="space-y-4">
                  {Object.entries(analysisResult.results).map(([key, data]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 capitalize">
                        {key.replace(/_/g, ' ')}
                      </h4>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Playground Tab */}
        {activeTab === 'playground' && (
          <div className="space-y-6">
            {selectedTool ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">
                  Tool: {selectedTool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <p className="text-gray-600 mb-6">
                  {tools.find(t => t.name === selectedTool)?.description}
                </p>
                
                {renderToolInputs()}
                
                <button 
                  onClick={callTool}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mt-4"
                >
                  {loading ? '⏳ Calling Tool...' : '▶️ Call Tool'}
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-lg font-semibold mb-2">Select a Tool</h3>
                <p className="text-gray-600">
                  Choose a tool from the Tools tab to test it here
                </p>
              </div>
            )}

            {toolResult && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Tool Result</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(toolResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MCPTools;
