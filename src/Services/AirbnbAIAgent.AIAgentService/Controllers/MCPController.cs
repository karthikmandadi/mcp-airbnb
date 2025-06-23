using AirbnbAIAgent.MCP.Models;
using AirbnbAIAgent.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AirbnbAIAgent.AIAgentService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MCPController : ControllerBase
{
    private readonly AirbnbMCPServer _mcpServer;
    private readonly ILogger<MCPController> _logger;

    public MCPController(AirbnbMCPServer mcpServer, ILogger<MCPController> logger)
    {
        _mcpServer = mcpServer;
        _logger = logger;
    }

    [HttpGet("resources")]
    public async Task<ActionResult<object>> GetResourcesAsync()
    {
        try
        {
            var request = new MCPRequest(
                Guid.NewGuid().ToString(),
                "resources/list",
                new Dictionary<string, object>(),
                DateTime.UtcNow
            );
            
            var response = await _mcpServer.HandleRequestAsync(request);
            
            if (response.Error != null)
            {
                return BadRequest(response.Error);
            }
            
            return Ok(response.Result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing MCP resources");
            return StatusCode(500, new { error = "Failed to retrieve MCP resources" });
        }
    }

    [HttpGet("tools")]
    public async Task<ActionResult<object>> GetToolsAsync()
    {
        try
        {
            var request = new MCPRequest(
                Guid.NewGuid().ToString(),
                "tools/list",
                new Dictionary<string, object>(),
                DateTime.UtcNow
            );
            
            var response = await _mcpServer.HandleRequestAsync(request);
            
            if (response.Error != null)
            {
                return BadRequest(response.Error);
            }
            
            return Ok(response.Result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing MCP tools");
            return StatusCode(500, new { error = "Failed to retrieve MCP tools" });
        }
    }

    [HttpGet("resources/{resourceId}")]
    public async Task<ActionResult<object>> GetResourceAsync(string resourceId)
    {
        try
        {
            var request = new MCPRequest(
                Guid.NewGuid().ToString(),
                "resources/read",
                new Dictionary<string, object>
                {
                    ["uri"] = resourceId
                },
                DateTime.UtcNow
            );

            var response = await _mcpServer.HandleRequestAsync(request);
            
            if (response.Error != null)
            {
                return BadRequest(response.Error);
            }

            return Ok(response.Result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading MCP resource: {ResourceId}", resourceId);
            return StatusCode(500, new { error = "Failed to read MCP resource" });
        }
    }

    [HttpPost("tools/{toolName}")]
    public async Task<ActionResult<object>> CallToolAsync(string toolName, [FromBody] Dictionary<string, object> arguments)
    {
        try
        {
            // Serialize and deserialize arguments to get JsonElement
            var argsJson = JsonSerializer.Serialize(arguments ?? new Dictionary<string, object>());
            var argsElement = JsonSerializer.Deserialize<JsonElement>(argsJson);
            
            var request = new MCPRequest(
                Guid.NewGuid().ToString(),
                "tools/call",
                new Dictionary<string, object>
                {
                    ["name"] = toolName,
                    ["arguments"] = argsElement
                },
                DateTime.UtcNow
            );

            var response = await _mcpServer.HandleRequestAsync(request);
            
            if (response.Error != null)
            {
                return BadRequest(response.Error);
            }

            return Ok(response.Result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling MCP tool: {ToolName}", toolName);
            return StatusCode(500, new { error = "Failed to call MCP tool" });
        }
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<object>> AnalyzeWithMCPAsync([FromBody] MCPAnalysisRequest request)
    {
        try
        {
            var results = new Dictionary<string, object>();

            // Use multiple MCP tools for comprehensive analysis
            if (request.IncludePropertyOptimization && !string.IsNullOrEmpty(request.PropertyId))
            {
                var optRequest = new MCPRequest(
                    Guid.NewGuid().ToString(),
                    "tools/call",
                    new Dictionary<string, object>
                    {
                        ["name"] = "optimize_property_listing",
                        ["arguments"] = new Dictionary<string, object>
                        {
                            ["property_id"] = request.PropertyId,
                            ["optimization_goals"] = request.OptimizationGoals ?? new[] { "occupancy", "revenue" }
                        }
                    },
                    DateTime.UtcNow
                );
                var optResponse = await _mcpServer.HandleRequestAsync(optRequest);
                if (optResponse.Result != null)
                    results["property_optimization"] = optResponse.Result;
            }

            if (request.IncludePricingAnalysis && !string.IsNullOrEmpty(request.PropertyId))
            {
                var pricingRequest = new MCPRequest(
                    Guid.NewGuid().ToString(),
                    "tools/call",
                    new Dictionary<string, object>
                    {
                        ["name"] = "calculate_dynamic_pricing",
                        ["arguments"] = new Dictionary<string, object>
                        {
                            ["property_id"] = request.PropertyId,
                            ["check_in_date"] = request.CheckInDate ?? DateTime.Now.AddDays(7).ToString("yyyy-MM-dd"),
                            ["check_out_date"] = request.CheckOutDate ?? DateTime.Now.AddDays(14).ToString("yyyy-MM-dd"),
                            ["guest_count"] = request.GuestCount ?? 2,
                            ["include_competitors"] = true
                        }
                    },
                    DateTime.UtcNow
                );
                var pricingResponse = await _mcpServer.HandleRequestAsync(pricingRequest);
                if (pricingResponse.Result != null)
                    results["pricing_analysis"] = pricingResponse.Result;
            }

            if (request.IncludeMarketAnalysis)
            {
                var marketRequest = new MCPRequest(
                    Guid.NewGuid().ToString(),
                    "tools/call",
                    new Dictionary<string, object>
                    {
                        ["name"] = "analyze_market_conditions",
                        ["arguments"] = new Dictionary<string, object>
                        {
                            ["location"] = request.Location ?? "San Francisco, CA",
                            ["property_type"] = request.PropertyType ?? "apartment",
                            ["include_competitors"] = true,
                            ["analysis_depth"] = "comprehensive"
                        }
                    },
                    DateTime.UtcNow
                );
                var marketResponse = await _mcpServer.HandleRequestAsync(marketRequest);
                if (marketResponse.Result != null)
                    results["market_analysis"] = marketResponse.Result;
            }

            if (request.IncludeAnalytics)
            {
                var analyticsRequest = new MCPRequest(
                    Guid.NewGuid().ToString(),
                    "tools/call",
                    new Dictionary<string, object>
                    {
                        ["name"] = "get_performance_analytics",
                        ["arguments"] = new Dictionary<string, object>
                        {
                            ["property_id"] = request.PropertyId,
                            ["time_period"] = request.TimePeriod ?? "30d",
                            ["metrics"] = request.Metrics ?? new[] { "occupancy", "revenue", "rating" }
                        }
                    },
                    DateTime.UtcNow
                );
                var analyticsResponse = await _mcpServer.HandleRequestAsync(analyticsRequest);
                if (analyticsResponse.Result != null)
                    results["analytics"] = analyticsResponse.Result;
            }

            return Ok(new
            {
                analysis_id = Guid.NewGuid(),
                timestamp = DateTime.UtcNow,
                results = results,
                summary = $"Completed MCP analysis with {results.Count} components"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing MCP analysis");
            return StatusCode(500, new { error = "Failed to perform MCP analysis" });
        }
    }
}

public class MCPAnalysisRequest
{
    public string? PropertyId { get; set; }
    public string? Location { get; set; }
    public string? PropertyType { get; set; }
    public bool IncludePropertyOptimization { get; set; } = true;
    public bool IncludePricingAnalysis { get; set; } = true;
    public bool IncludeMarketAnalysis { get; set; } = true;
    public bool IncludeAnalytics { get; set; } = true;
    public string[]? OptimizationGoals { get; set; }
    public string? CheckInDate { get; set; }
    public string? CheckOutDate { get; set; }
    public int? GuestCount { get; set; }
    public string? TimePeriod { get; set; }
    public string[]? Metrics { get; set; }
}
