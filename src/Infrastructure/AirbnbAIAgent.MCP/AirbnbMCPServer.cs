using System.Text.Json;
using AirbnbAIAgent.Shared.Models;
using AirbnbAIAgent.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AirbnbAIAgent.MCP.Models;

public class AirbnbMCPServer : MCPServer
{
    private readonly AirbnbDbContext _context;
    private readonly ILogger<AirbnbMCPServer> _logger;
    private readonly HttpClient _httpClient;

    public AirbnbMCPServer(AirbnbDbContext context, ILogger<AirbnbMCPServer> logger, HttpClient httpClient)
    {
        _context = context;
        _logger = logger;
        _httpClient = httpClient;
        InitializeResourcesAndTools();
    }

    private void InitializeResourcesAndTools()
    {
        // Initialize MCP Resources
        _resources["airbnb://properties"] = new MCPResource(
            "airbnb://properties",
            "Properties Database",
            "Access to all property listings in the Airbnb system",
            "application/json",
            new Dictionary<string, object>
            {
                ["schema"] = "PropertyDto[]",
                ["capabilities"] = new[] { "read", "search", "filter" }
            }
        );

        _resources["airbnb://analytics"] = new MCPResource(
            "airbnb://analytics",
            "Analytics Data",
            "Real-time analytics and performance metrics",
            "application/json",
            new Dictionary<string, object>
            {
                ["schema"] = "AnalyticsData",
                ["capabilities"] = new[] { "read", "aggregate" }
            }
        );

        _resources["airbnb://market-data"] = new MCPResource(
            "airbnb://market-data",
            "Market Analysis Data",
            "Local market conditions and competitor analysis",
            "application/json",
            new Dictionary<string, object>
            {
                ["schema"] = "MarketData",
                ["capabilities"] = new[] { "read", "analyze" }
            }
        );

        _resources["airbnb://pricing-rules"] = new MCPResource(
            "airbnb://pricing-rules",
            "Pricing Rules Engine",
            "Dynamic pricing rules and algorithms",
            "application/json",
            new Dictionary<string, object>
            {
                ["schema"] = "PricingRules",
                ["capabilities"] = new[] { "read", "modify" }
            }
        );

        // Initialize MCP Tools
        _tools["optimize_property"] = new MCPTool(
            "optimize_property",
            "AI-powered property optimization with recommendations for title, description, pricing, and amenities",
            new Dictionary<string, object>
            {
                ["type"] = "object",
                ["properties"] = new Dictionary<string, object>
                {
                    ["property_id"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["description"] = "The ID of the property to optimize"
                    },
                    ["optimization_goals"] = new Dictionary<string, object>
                    {
                        ["type"] = "array",
                        ["items"] = new Dictionary<string, object> { ["type"] = "string" },
                        ["description"] = "Goals for optimization (e.g., increase_occupancy, improve_rating, optimize_pricing)"
                    },
                    ["market_context"] = new Dictionary<string, object>
                    {
                        ["type"] = "object",
                        ["description"] = "Current market conditions and competitor data"
                    }
                },
                ["required"] = new[] { "property_id", "optimization_goals" }
            }
        );

        _tools["calculate_dynamic_pricing"] = new MCPTool(
            "calculate_dynamic_pricing",
            "Calculate optimal pricing based on market conditions, seasonality, and demand",
            new Dictionary<string, object>
            {
                ["type"] = "object",
                ["properties"] = new Dictionary<string, object>
                {
                    ["property_id"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["description"] = "The property ID"
                    },
                    ["check_in_date"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["format"] = "date",
                        ["description"] = "Check-in date"
                    },
                    ["check_out_date"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["format"] = "date",
                        ["description"] = "Check-out date"
                    },
                    ["guest_count"] = new Dictionary<string, object>
                    {
                        ["type"] = "integer",
                        ["description"] = "Number of guests"
                    },
                    ["include_competitors"] = new Dictionary<string, object>
                    {
                        ["type"] = "boolean",
                        ["description"] = "Include competitor analysis in pricing"
                    }
                },
                ["required"] = new[] { "property_id", "check_in_date", "check_out_date" }
            }
        );

        _tools["analyze_market_conditions"] = new MCPTool(
            "analyze_market_conditions",
            "Analyze local market conditions, competitor pricing, and demand patterns",
            new Dictionary<string, object>
            {
                ["type"] = "object",
                ["properties"] = new Dictionary<string, object>
                {
                    ["location"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["description"] = "Location to analyze (address, city, or coordinates)"
                    },
                    ["property_type"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["enum"] = new[] { "apartment", "house", "condo", "studio" },
                        ["description"] = "Type of property"
                    },
                    ["radius_km"] = new Dictionary<string, object>
                    {
                        ["type"] = "number",
                        ["description"] = "Search radius in kilometers"
                    },
                    ["date_range"] = new Dictionary<string, object>
                    {
                        ["type"] = "object",
                        ["properties"] = new Dictionary<string, object>
                        {
                            ["start"] = new Dictionary<string, object> { ["type"] = "string", ["format"] = "date" },
                            ["end"] = new Dictionary<string, object> { ["type"] = "string", ["format"] = "date" }
                        }
                    }
                },
                ["required"] = new[] { "location" }
            }
        );

        _tools["generate_guest_response"] = new MCPTool(
            "generate_guest_response",
            "Generate AI-powered responses to guest inquiries and messages",
            new Dictionary<string, object>
            {
                ["type"] = "object",
                ["properties"] = new Dictionary<string, object>
                {
                    ["guest_message"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["description"] = "The guest's message or inquiry"
                    },
                    ["context"] = new Dictionary<string, object>
                    {
                        ["type"] = "object",
                        ["properties"] = new Dictionary<string, object>
                        {
                            ["booking_id"] = new Dictionary<string, object> { ["type"] = "string" },
                            ["property_id"] = new Dictionary<string, object> { ["type"] = "string" },
                            ["guest_history"] = new Dictionary<string, object> { ["type"] = "string" },
                            ["message_type"] = new Dictionary<string, object>
                            {
                                ["type"] = "string",
                                ["enum"] = new[] { "inquiry", "complaint", "request", "general" }
                            }
                        }
                    },
                    ["tone"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["enum"] = new[] { "professional", "friendly", "apologetic", "informative" },
                        ["description"] = "Desired tone for the response"
                    }
                },
                ["required"] = new[] { "guest_message" }
            }
        );

        _tools["search_properties"] = new MCPTool(
            "search_properties",
            "Search and filter properties based on various criteria",
            new Dictionary<string, object>
            {
                ["type"] = "object",
                ["properties"] = new Dictionary<string, object>
                {
                    ["filters"] = new Dictionary<string, object>
                    {
                        ["type"] = "object",
                        ["properties"] = new Dictionary<string, object>
                        {
                            ["location"] = new Dictionary<string, object> { ["type"] = "string" },
                            ["min_price"] = new Dictionary<string, object> { ["type"] = "number" },
                            ["max_price"] = new Dictionary<string, object> { ["type"] = "number" },
                            ["bedrooms"] = new Dictionary<string, object> { ["type"] = "integer" },
                            ["max_guests"] = new Dictionary<string, object> { ["type"] = "integer" },
                            ["amenities"] = new Dictionary<string, object>
                            {
                                ["type"] = "array",
                                ["items"] = new Dictionary<string, object> { ["type"] = "string" }
                            },
                            ["status"] = new Dictionary<string, object>
                            {
                                ["type"] = "string",
                                ["enum"] = new[] { "active", "inactive", "maintenance" }
                            }
                        }
                    },
                    ["sort_by"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["enum"] = new[] { "price", "rating", "occupancy", "revenue" }
                    },
                    ["limit"] = new Dictionary<string, object>
                    {
                        ["type"] = "integer",
                        ["minimum"] = 1,
                        ["maximum"] = 100
                    }
                }
            }
        );

        _tools["get_performance_analytics"] = new MCPTool(
            "get_performance_analytics",
            "Retrieve detailed performance analytics for properties or the entire portfolio",
            new Dictionary<string, object>
            {
                ["type"] = "object",
                ["properties"] = new Dictionary<string, object>
                {
                    ["property_id"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["description"] = "Specific property ID (optional, if not provided returns portfolio analytics)"
                    },
                    ["time_period"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["enum"] = new[] { "7d", "30d", "90d", "1y" },
                        ["description"] = "Time period for analytics"
                    },
                    ["metrics"] = new Dictionary<string, object>
                    {
                        ["type"] = "array",
                        ["items"] = new Dictionary<string, object>
                        {
                            ["type"] = "string",
                            ["enum"] = new[] { "occupancy", "revenue", "rating", "bookings", "cancellations" }
                        },
                        ["description"] = "Specific metrics to retrieve"
                    }
                }
            }
        );
    }

    public override async Task<MCPResponse> HandleRequestAsync(MCPRequest request)
    {
        try
        {
            return request.Method switch
            {
                "resources/list" => await ListResourcesAsync(request),
                "resources/read" => await ReadResourceAsync(request),
                "tools/list" => await ListToolsAsync(request),
                "tools/call" => await CallToolAsync(request),
                _ => new MCPResponse(
                    request.Id,
                    null,
                    new MCPError(-32601, $"Method not found: {request.Method}"),
                    DateTime.UtcNow
                )
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling MCP request: {Method}", request.Method);
            return new MCPResponse(
                request.Id,
                null,
                new MCPError(-32603, "Internal error", ex.Message),
                DateTime.UtcNow
            );
        }
    }

    protected override async Task<MCPResponse> ReadResourceContentAsync(MCPRequest request, MCPResource resource)
    {
        var content = resource.Uri switch
        {
            "airbnb://properties" => await GetPropertiesResourceAsync(request),
            "airbnb://analytics" => await GetAnalyticsResourceAsync(request),
            "airbnb://market-data" => await GetMarketDataResourceAsync(request),
            "airbnb://pricing-rules" => await GetPricingRulesResourceAsync(request),
            _ => throw new InvalidOperationException($"Unknown resource: {resource.Uri}")
        };

        return new MCPResponse(
            request.Id,
            new { content },
            null,
            DateTime.UtcNow
        );
    }

    protected override async Task<MCPResponse> CallToolAsync(MCPRequest request)
    {
        if (!request.Params.TryGetValue("name", out var nameObj) || nameObj is not string toolName)
        {
            return new MCPResponse(
                request.Id,
                null,
                new MCPError(-32602, "Invalid tool name parameter"),
                DateTime.UtcNow
            );
        }

        if (!request.Params.TryGetValue("arguments", out var argsObj) || argsObj is not JsonElement argsElement)
        {
            return new MCPResponse(
                request.Id,
                null,
                new MCPError(-32602, "Invalid arguments parameter"),
                DateTime.UtcNow
            );
        }

        var args = JsonSerializer.Deserialize<Dictionary<string, object>>(argsElement.GetRawText()) ?? new();

        var result = toolName switch
        {
            "optimize_property" => await OptimizePropertyAsync(args),
            "calculate_dynamic_pricing" => await CalculateDynamicPricingAsync(args),
            "analyze_market_conditions" => await AnalyzeMarketConditionsAsync(args),
            "generate_guest_response" => await GenerateGuestResponseAsync(args),
            "search_properties" => await SearchPropertiesAsync(args),
            "get_performance_analytics" => await GetPerformanceAnalyticsAsync(args),
            _ => throw new InvalidOperationException($"Unknown tool: {toolName}")
        };

        return new MCPResponse(
            request.Id,
            result,
            null,
            DateTime.UtcNow
        );
    }

    private async Task<object> GetPropertiesResourceAsync(MCPRequest request)
    {
        var properties = await _context.Properties.ToListAsync();
        return new
        {
            properties = properties.Select(p => new
            {
                id = p.Id,
                title = p.Title,
                description = p.Description,
                address = p.Address,
                basePrice = p.BasePrice,
                maxGuests = p.MaxGuests,
                bedrooms = p.Bedrooms,
                bathrooms = p.Bathrooms,
                amenities = p.Amenities,
                status = p.Status.ToString(),
                createdAt = p.CreatedAt,
                updatedAt = p.UpdatedAt
            }),
            totalCount = properties.Count,
            lastUpdated = DateTime.UtcNow
        };
    }

    private async Task<object> GetAnalyticsResourceAsync(MCPRequest request)
    {
        // Mock analytics data - in production this would come from analytics service
        return new
        {
            overview = new
            {
                totalProperties = await _context.Properties.CountAsync(),
                occupancyRate = 76.5,
                averageRevenue = 2450.00,
                averageRating = 4.7
            },
            trends = new object[]
            {
                new { date = DateTime.Today.AddDays(-30), occupancy = 65, revenue = 2100 },
                new { date = DateTime.Today.AddDays(-23), occupancy = 72, revenue = 2300 },
                new { date = DateTime.Today.AddDays(-16), occupancy = 78, revenue = 2500 },
                new { date = DateTime.Today.AddDays(-9), occupancy = 82, revenue = 2700 },
                new { date = DateTime.Today.AddDays(-2), occupancy = 76, revenue = 2450 }
            },
            topPerformers = await GetTopPerformingPropertiesAsync()
        };
    }

    private async Task<object> GetMarketDataResourceAsync(MCPRequest request)
    {
        // Mock market data - in production this would integrate with external APIs
        return new
        {
            marketConditions = new
            {
                averagePrice = 175.00,
                occupancyRate = 74.2,
                competitorCount = 24,
                demandLevel = "High"
            },
            competitorAnalysis = new object[]
            {
                new { propertyType = "Apartment", averagePrice = 165, count = 12 },
                new { propertyType = "House", averagePrice = 220, count = 8 },
                new { propertyType = "Condo", averagePrice = 185, count = 4 }
            },
            seasonalTrends = new object[]
            {
                new { month = "Jan", demand = 0.8, priceMultiplier = 0.9 },
                new { month = "Feb", demand = 0.85, priceMultiplier = 0.95 },
                new { month = "Mar", demand = 1.0, priceMultiplier = 1.0 },
                new { month = "Apr", demand = 1.2, priceMultiplier = 1.15 }
            }
        };
    }

    private Task<object> GetPricingRulesResourceAsync(MCPRequest request)
    {
        return Task.FromResult<object>(new
        {
            rules = new object[]
            {
                new
                {
                    name = "Seasonal Adjustment",
                    description = "Adjust pricing based on seasonal demand",
                    conditions = new { season = "high" },
                    multiplier = 1.25,
                    active = true
                },
                new
                {
                    name = "Weekend Premium",
                    description = "Add premium for weekend bookings",
                    conditions = new { dayOfWeek = new[] { "Friday", "Saturday" } },
                    adjustment = 35.00,
                    active = true
                },
                new
                {
                    name = "Local Events",
                    description = "Surge pricing for local events",
                    conditions = new { hasLocalEvents = true },
                    multiplier = 1.5,
                    active = true
                }
            },
            baseRules = new
            {
                minimumPrice = 50.00,
                maximumDiscount = 0.3,
                advanceBookingDiscount = 0.1
            }
        });
    }

    private async Task<object> OptimizePropertyAsync(Dictionary<string, object> args)
    {
        var propertyId = args.GetValueOrDefault("property_id")?.ToString();
        var goals = args.GetValueOrDefault("optimization_goals") as object[] ?? Array.Empty<object>();

        if (string.IsNullOrEmpty(propertyId))
            throw new ArgumentException("property_id is required");

        var property = await _context.Properties.FindAsync(propertyId);
        if (property == null)
            throw new ArgumentException("Property not found");

        // AI optimization logic - in production this would use actual AI/ML models
        return new
        {
            optimizedTitle = $"Stunning {property.Bedrooms}-Bedroom Retreat with Premium Amenities",
            optimizedDescription = $"Experience luxury in this beautifully appointed {property.Bedrooms}-bedroom property. " +
                                 $"Perfect for up to {property.MaxGuests} guests, featuring modern amenities and prime location. " +
                                 $"Enjoy {string.Join(", ", property.Amenities)} and more.",
            recommendedAmenities = new string[] { "High-Speed WiFi", "Smart TV", "Coffee Machine", "Premium Bedding", "Contactless Check-in" },
            pricingStrategy = new
            {
                basePrice = property.BasePrice,
                recommendedBasePrice = Math.Round(property.BasePrice * 1.15m, 2),
                dynamicPricingEnabled = true,
                seasonalAdjustments = true
            },
            marketingTips = new string[]
            {
                "Highlight unique features in your title",
                "Use high-quality photos showcasing natural light",
                "Emphasize nearby attractions and transportation",
                "Respond to inquiries within 1 hour"
            },
            confidenceScore = 0.87,
            estimatedImpact = new
            {
                occupancyIncrease = 23,
                revenueIncrease = 18
            }
        };
    }

    private async Task<object> CalculateDynamicPricingAsync(Dictionary<string, object> args)
    {
        var propertyId = args.GetValueOrDefault("property_id")?.ToString();
        var checkInDate = DateTime.Parse(args.GetValueOrDefault("check_in_date")?.ToString() ?? DateTime.Today.ToString());
        var checkOutDate = DateTime.Parse(args.GetValueOrDefault("check_out_date")?.ToString() ?? DateTime.Today.AddDays(1).ToString());
        var guestCount = Convert.ToInt32(args.GetValueOrDefault("guest_count") ?? 2);

        if (string.IsNullOrEmpty(propertyId))
            throw new ArgumentException("property_id is required");

        var property = await _context.Properties.FindAsync(propertyId);
        if (property == null)
            throw new ArgumentException("Property not found");

        var nights = (checkOutDate - checkInDate).Days;
        var basePrice = property.BasePrice;

        // Dynamic pricing algorithm
        var seasonalMultiplier = GetSeasonalMultiplier(checkInDate);
        var demandMultiplier = GetDemandMultiplier(checkInDate, checkOutDate);
        var guestMultiplier = guestCount > property.MaxGuests / 2 ? 1.1m : 1.0m;

        var dynamicPrice = Math.Round(basePrice * seasonalMultiplier * demandMultiplier * guestMultiplier, 2);
        var totalPrice = dynamicPrice * nights;

        return new
        {
            propertyId,
            basePrice,
            dynamicPrice,
            totalPrice,
            nights,
            factors = new
            {
                seasonal = seasonalMultiplier,
                demand = demandMultiplier,
                guestCount = guestMultiplier
            },
            breakdown = new
            {
                baseAmount = basePrice * nights,
                seasonalAdjustment = Math.Round((seasonalMultiplier - 1) * basePrice * nights, 2),
                demandAdjustment = Math.Round((demandMultiplier - 1) * basePrice * nights, 2),
                guestAdjustment = Math.Round((guestMultiplier - 1) * basePrice * nights, 2)
            },
            calculatedAt = DateTime.UtcNow
        };
    }

    private Task<object> AnalyzeMarketConditionsAsync(Dictionary<string, object> args)
    {
        var location = args.GetValueOrDefault("location")?.ToString() ?? "";
        var propertyType = args.GetValueOrDefault("property_type")?.ToString() ?? "apartment";
        var radiusKm = Convert.ToDouble(args.GetValueOrDefault("radius_km") ?? 5.0);

        // Mock market analysis - in production this would integrate with real market data APIs
        return Task.FromResult<object>(new
        {
            location,
            propertyType,
            radiusKm,
            marketMetrics = new
            {
                averagePrice = 175.00m,
                medianPrice = 165.00m,
                occupancyRate = 76.5,
                competitorCount = 18,
                averageRating = 4.6
            },
            priceDistribution = new[]
            {
                new { range = "$100-150", count = 6, percentage = 33.3 },
                new { range = "$150-200", count = 8, percentage = 44.4 },
                new { range = "$200-250", count = 3, percentage = 16.7 },
                new { range = "$250+", count = 1, percentage = 5.6 }
            },
            recommendations = new[]
            {
                $"Your property should be priced between $160-185 for competitive positioning in {location}",
                "Focus on unique amenities to justify premium pricing",
                "Weekend rates can be 20-30% higher due to strong leisure demand",
                "Consider minimum stay requirements during peak periods"
            },
            competitiveAdvantages = new[]
            {
                "Location convenience",
                "Unique property features",
                "Superior guest experience",
                "Competitive pricing strategy"
            }
        });
    }

    private Task<object> GenerateGuestResponseAsync(Dictionary<string, object> args)
    {
        var guestMessage = args.GetValueOrDefault("guest_message")?.ToString() ?? "";
        var context = args.GetValueOrDefault("context") as Dictionary<string, object> ?? new();
        var tone = args.GetValueOrDefault("tone")?.ToString() ?? "friendly";

        // AI response generation - in production this would use NLP/AI models
        var responses = new Dictionary<string, string[]>
        {
            ["friendly"] = new[]
            {
                "Thank you for reaching out! I'm happy to help with your inquiry.",
                "Hi there! Thanks for your message. I'd be delighted to assist you.",
                "Hello! Thank you for contacting us. I'm here to help make your stay amazing."
            },
            ["professional"] = new[]
            {
                "Thank you for your inquiry. I will be happy to assist you.",
                "I appreciate you contacting us. Please allow me to address your question.",
                "Thank you for reaching out. I will provide you with the information you need."
            },
            ["apologetic"] = new[]
            {
                "I sincerely apologize for any inconvenience. Let me help resolve this for you.",
                "I'm so sorry to hear about this issue. I want to make this right immediately.",
                "My apologies for the trouble you've experienced. I'm here to help fix this."
            }
        };

        var greeting = responses[tone][new Random().Next(responses[tone].Length)];
        
        return Task.FromResult<object>(new
        {
            suggestedResponse = $"{greeting} {GenerateContextualResponse(guestMessage, context)}",
            tone,
            confidenceScore = 0.91,
            alternativeResponses = responses[tone],
            suggestedActions = new[]
            {
                "Send property guide",
                "Provide check-in instructions", 
                "Share local recommendations"
            },
            escalationRequired = ContainsComplaint(guestMessage)
        });
    }

    private async Task<object> SearchPropertiesAsync(Dictionary<string, object> args)
    {
        var query = _context.Properties.AsQueryable();
        
        if (args.TryGetValue("filters", out var filtersObj) && filtersObj is JsonElement filtersElement)
        {
            var filters = JsonSerializer.Deserialize<Dictionary<string, object>>(filtersElement.GetRawText()) ?? new();
            
            if (filters.TryGetValue("min_price", out var minPrice))
                query = query.Where(p => p.BasePrice >= Convert.ToDecimal(minPrice));
                
            if (filters.TryGetValue("max_price", out var maxPrice))
                query = query.Where(p => p.BasePrice <= Convert.ToDecimal(maxPrice));
                
            if (filters.TryGetValue("bedrooms", out var bedrooms))
                query = query.Where(p => p.Bedrooms == Convert.ToInt32(bedrooms));
                
            if (filters.TryGetValue("max_guests", out var maxGuests))
                query = query.Where(p => p.MaxGuests >= Convert.ToInt32(maxGuests));
        }

        var limit = Convert.ToInt32(args.GetValueOrDefault("limit") ?? 20);
        var properties = await query.Take(limit).ToListAsync();

        return new
        {
            properties = properties.Select(p => new
            {
                id = p.Id,
                title = p.Title,
                address = p.Address,
                basePrice = p.BasePrice,
                bedrooms = p.Bedrooms,
                maxGuests = p.MaxGuests,
                status = p.Status.ToString(),
                amenities = p.Amenities
            }),
            totalCount = await query.CountAsync(),
            filters = args.GetValueOrDefault("filters"),
            searchPerformed = DateTime.UtcNow
        };
    }

    private async Task<object> GetPerformanceAnalyticsAsync(Dictionary<string, object> args)
    {
        var propertyId = args.GetValueOrDefault("property_id")?.ToString();
        var timePeriod = args.GetValueOrDefault("time_period")?.ToString() ?? "30d";
        
        if (!string.IsNullOrEmpty(propertyId))
        {
            return await GetPropertyAnalyticsAsync(propertyId, timePeriod);
        }
        
        return await GetPortfolioAnalyticsAsync(timePeriod);
    }

    private async Task<object> GetPropertyAnalyticsAsync(string propertyId, string timePeriod)
    {
        var property = await _context.Properties.FindAsync(propertyId);
        if (property == null)
            throw new ArgumentException("Property not found");

        // Mock analytics data - in production this would come from booking/analytics service
        return new
        {
            propertyId,
            timePeriod,
            performance = new
            {
                occupancyRate = 78.5,
                averageDailyRate = property.BasePrice * 1.12m,
                revenue = 3200.00m,
                bookingCount = 8,
                averageStayLength = 3.2,
                guestRating = 4.7
            },
            trends = GenerateTrendData(timePeriod),
            recommendations = new[]
            {
                "Consider raising rates during peak demand periods",
                "Optimize check-in/out processes to improve guest satisfaction",
                "Add premium amenities to justify higher pricing"
            }
        };
    }

    private async Task<object> GetPortfolioAnalyticsAsync(string timePeriod)
    {
        var propertyCount = await _context.Properties.CountAsync();
        
        return new
        {
            portfolio = new
            {
                totalProperties = propertyCount,
                averageOccupancy = 76.2,
                totalRevenue = 28500.00m,
                averageRevenue = propertyCount > 0 ? 28500.00m / propertyCount : 0,
                averageRating = 4.6
            },
            timePeriod,
            topPerformers = await GetTopPerformingPropertiesAsync(),
            insights = new[]
            {
                "Portfolio occupancy is 12% above market average",
                "Weekend rates can be optimized further",
                "Guest satisfaction scores are excellent across all properties"
            }
        };
    }

    private async Task<object[]> GetTopPerformingPropertiesAsync()
    {
        var properties = await _context.Properties.Take(3).ToListAsync();
        return properties.Select((p, index) => new
        {
            id = p.Id,
            title = p.Title,
            occupancyRate = 85.0 - (index * 5),
            revenue = 4500.00m - (index * 500),
            rating = 4.8 - (index * 0.1)
        }).ToArray();
    }

    private static decimal GetSeasonalMultiplier(DateTime date)
    {
        return date.Month switch
        {
            12 or 1 or 2 => 0.85m, // Winter
            3 or 4 or 5 => 1.15m,  // Spring
            6 or 7 or 8 => 1.35m,  // Summer
            _ => 1.0m              // Fall
        };
    }

    private static decimal GetDemandMultiplier(DateTime checkIn, DateTime checkOut)
    {
        var isWeekend = checkIn.DayOfWeek == DayOfWeek.Friday || checkIn.DayOfWeek == DayOfWeek.Saturday;
        return isWeekend ? 1.2m : 1.0m;
    }

    private static string GenerateContextualResponse(string message, Dictionary<string, object> context)
    {
        var lowerMessage = message.ToLower();
        
        if (lowerMessage.Contains("check") && lowerMessage.Contains("in"))
            return "Check-in is available from 3:00 PM. I'll send you detailed instructions 24 hours before your arrival.";
            
        if (lowerMessage.Contains("wifi") || lowerMessage.Contains("password"))
            return "The WiFi network is 'AirbnbGuest' and the password is 'Welcome2024'. You'll also find this information in your welcome packet.";
            
        if (lowerMessage.Contains("parking"))
            return "Free parking is available on-site. You'll receive parking instructions with your check-in details.";
            
        if (lowerMessage.Contains("late") || lowerMessage.Contains("arrival"))
            return "Late arrivals are welcome! Please let me know your estimated arrival time so I can ensure smooth check-in.";
            
        return "I'll be happy to help with any questions about your stay. Please let me know if you need any specific information.";
    }

    private static bool ContainsComplaint(string message)
    {
        var complainWords = new[] { "complaint", "issue", "problem", "broken", "dirty", "unhappy", "disappointed" };
        return complainWords.Any(word => message.ToLower().Contains(word));
    }

    private static object[] GenerateTrendData(string timePeriod)
    {
        var days = timePeriod switch
        {
            "7d" => 7,
            "30d" => 30,
            "90d" => 90,
            "1y" => 365,
            _ => 30
        };

        return Enumerable.Range(0, Math.Min(days / 7, 12))
            .Select(i => new
            {
                date = DateTime.Today.AddDays(-days + (i * 7)),
                occupancy = 65 + (i % 3) * 8 + new Random().Next(-5, 6),
                revenue = 800 + (i % 4) * 200 + new Random().Next(-100, 101)
            })
            .ToArray();
    }
}
