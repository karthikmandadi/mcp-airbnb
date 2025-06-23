using AirbnbAIAgent.MCP.Models;
using AirbnbAIAgent.Shared.Models;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace AirbnbAIAgent.AIAgentService.Services;

public class PropertyMCPServer : MCPServer
{
    private readonly ILogger<PropertyMCPServer> _logger;
    private readonly IPropertyService _propertyService;

    public PropertyMCPServer(ILogger<PropertyMCPServer> logger, IPropertyService propertyService)
    {
        _logger = logger;
        _propertyService = propertyService;
        
        RegisterResources();
        RegisterTools();
    }

    private void RegisterResources()
    {
        _resources["airbnb://properties"] = new MCPResource(
            "airbnb://properties",
            "Property Listings",
            "All active property listings in the system",
            "application/json"
        );

        _resources["airbnb://bookings"] = new MCPResource(
            "airbnb://bookings",
            "Booking Data",
            "Historical and current booking information",
            "application/json"
        );

        _resources["airbnb://analytics"] = new MCPResource(
            "airbnb://analytics",
            "Analytics Data",
            "Property performance and market analytics",
            "application/json"
        );
    }

    private void RegisterTools()
    {
        _tools["search_properties"] = new MCPTool(
            "search_properties",
            "Search and filter properties based on criteria",
            new Dictionary<string, object>
            {
                ["type"] = "object",
                ["properties"] = new Dictionary<string, object>
                {
                    ["location"] = new { type = "string", description = "Location filter" },
                    ["max_price"] = new { type = "number", description = "Maximum price filter" },
                    ["min_price"] = new { type = "number", description = "Minimum price filter" },
                    ["guests"] = new { type = "integer", description = "Number of guests" },
                    ["amenities"] = new { type = "array", items = new { type = "string" } }
                }
            }
        );

        _tools["optimize_pricing"] = new MCPTool(
            "optimize_pricing",
            "Get pricing recommendations for a property",
            new Dictionary<string, object>
            {
                ["type"] = "object",
                ["properties"] = new Dictionary<string, object>
                {
                    ["property_id"] = new { type = "string", description = "Property ID" },
                    ["check_in"] = new { type = "string", format = "date", description = "Check-in date" },
                    ["check_out"] = new { type = "string", format = "date", description = "Check-out date" },
                    ["guest_count"] = new { type = "integer", description = "Number of guests" }
                },
                ["required"] = new[] { "property_id", "check_in", "check_out" }
            }
        );

        _tools["generate_property_insights"] = new MCPTool(
            "generate_property_insights",
            "Generate AI-powered insights for property performance",
            new Dictionary<string, object>
            {
                ["type"] = "object",
                ["properties"] = new Dictionary<string, object>
                {
                    ["property_id"] = new { type = "string", description = "Property ID" },
                    ["time_range"] = new Dictionary<string, object>
                    {
                        ["type"] = "string",
                        ["enum"] = new[] { "week", "month", "quarter", "year" }
                    }
                },
                ["required"] = new[] { "property_id" }
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
            "airbnb://properties" => await _propertyService.GetAllPropertiesAsync(),
            "airbnb://bookings" => await _propertyService.GetAllBookingsAsync(),
            "airbnb://analytics" => await _propertyService.GetAnalyticsDataAsync(),
            _ => throw new InvalidOperationException($"Unknown resource: {resource.Uri}")
        };

        return new MCPResponse(
            request.Id,
            new { contents = new[] { new { uri = resource.Uri, mimeType = "application/json", text = JsonSerializer.Serialize(content) } } },
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

        var arguments = JsonSerializer.Deserialize<Dictionary<string, object>>(argsElement.GetRawText()) ?? new();

        var result = toolName switch
        {
            "search_properties" => await SearchPropertiesAsync(arguments),
            "optimize_pricing" => await OptimizePricingAsync(arguments),
            "generate_property_insights" => await GeneratePropertyInsightsAsync(arguments),
            _ => throw new InvalidOperationException($"Unknown tool: {toolName}")
        };

        return new MCPResponse(
            request.Id,
            new { content = new[] { new { type = "text", text = JsonSerializer.Serialize(result) } } },
            null,
            DateTime.UtcNow
        );
    }

    private async Task<object> SearchPropertiesAsync(Dictionary<string, object> arguments)
    {
        // Implementation for property search
        var properties = await _propertyService.SearchPropertiesAsync(arguments);
        return new { properties, count = properties.Count };
    }

    private async Task<object> OptimizePricingAsync(Dictionary<string, object> arguments)
    {
        // Implementation for pricing optimization
        if (!arguments.TryGetValue("property_id", out var propertyIdObj))
            throw new ArgumentException("property_id is required");

        var propertyId = Guid.Parse(propertyIdObj.ToString()!);
        var pricingData = await _propertyService.GetPricingRecommendationAsync(propertyId, arguments);
        
        return pricingData;
    }

    private async Task<object> GeneratePropertyInsightsAsync(Dictionary<string, object> arguments)
    {
        // Implementation for generating insights
        if (!arguments.TryGetValue("property_id", out var propertyIdObj))
            throw new ArgumentException("property_id is required");

        var propertyId = Guid.Parse(propertyIdObj.ToString()!);
        var insights = await _propertyService.GenerateInsightsAsync(propertyId, arguments);
        
        return insights;
    }
}

public interface IPropertyService
{
    Task<List<PropertyDto>> GetAllPropertiesAsync();
    Task<List<BookingDto>> GetAllBookingsAsync();
    Task<object> GetAnalyticsDataAsync();
    Task<List<PropertyDto>> SearchPropertiesAsync(Dictionary<string, object> criteria);
    Task<PricingResponseDto> GetPricingRecommendationAsync(Guid propertyId, Dictionary<string, object> parameters);
    Task<object> GenerateInsightsAsync(Guid propertyId, Dictionary<string, object> parameters);
}
