using AirbnbAIAgent.Shared.Models;
using AirbnbAIAgent.AIAgentService.Services;
using AirbnbAIAgent.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AirbnbAIAgent.AIAgentService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIAgentController : ControllerBase
{
    private readonly ILogger<AIAgentController> _logger;
    private readonly IAIService _aiService;
    private readonly AirbnbDbContext _context;

    public AIAgentController(
        ILogger<AIAgentController> logger, 
        IAIService aiService,
        AirbnbDbContext context)
    {
        _logger = logger;
        _aiService = aiService;
        _context = context;
    }

    [HttpPost("process")]
    public async Task<ActionResult<AIAgentResponseDto>> ProcessRequestAsync([FromBody] AIAgentRequestDto request)
    {
        try
        {
            _logger.LogInformation("Processing AI agent request: {RequestType}", request.RequestType);

            string response;
            var actions = new Dictionary<string, object>();
            decimal confidenceScore = 0.8m;

            switch (request.RequestType.ToLower())
            {
                case "property_optimization":
                    var optRequest = System.Text.Json.JsonSerializer.Deserialize<PropertyOptimizationRequestDto>(
                        System.Text.Json.JsonSerializer.Serialize(request.Context));
                    
                    if (optRequest != null)
                    {
                        var optimization = await _aiService.OptimizePropertyAsync(optRequest);
                        response = "Property optimization completed successfully";
                        actions = new Dictionary<string, object>
                        {
                            ["optimization"] = optimization,
                            ["type"] = "property_optimization"
                        };
                        confidenceScore = optimization.ConfidenceScore;
                    }
                    else
                    {
                        response = "Invalid property optimization request format";
                        confidenceScore = 0.1m;
                    }
                    break;

                case "pricing_strategy":
                    var pricingRequest = System.Text.Json.JsonSerializer.Deserialize<PricingRequestDto>(
                        System.Text.Json.JsonSerializer.Serialize(request.Context));
                    
                    if (pricingRequest != null)
                    {
                        var pricing = await _aiService.GeneratePricingStrategyAsync(pricingRequest);
                        response = $"Recommended price: ${pricing.RecommendedPrice:F2}";
                        actions = new Dictionary<string, object>
                        {
                            ["pricing"] = pricing,
                            ["type"] = "pricing_strategy"
                        };
                        confidenceScore = 0.9m;
                    }
                    else
                    {
                        response = "Invalid pricing request format";
                        confidenceScore = 0.1m;
                    }
                    break;

                case "guest_communication":
                    var commRequest = System.Text.Json.JsonSerializer.Deserialize<GuestCommunicationRequestDto>(
                        System.Text.Json.JsonSerializer.Serialize(request.Context));
                    
                    if (commRequest != null)
                    {
                        var communication = await _aiService.GenerateGuestResponseAsync(commRequest);
                        response = communication.AIResponse;
                        actions = new Dictionary<string, object>
                        {
                            ["communication"] = communication,
                            ["type"] = "guest_communication"
                        };
                        confidenceScore = communication.ConfidenceScore;
                    }
                    else
                    {
                        response = "Invalid guest communication request format";
                        confidenceScore = 0.1m;
                    }
                    break;

                case "market_analysis":
                    var marketRequest = System.Text.Json.JsonSerializer.Deserialize<MarketAnalysisRequestDto>(
                        System.Text.Json.JsonSerializer.Serialize(request.Context));
                    
                    if (marketRequest != null)
                    {
                        var analysis = await _aiService.AnalyzeMarketAsync(marketRequest);
                        response = $"Market analysis completed. Average price: ${analysis.AveragePrice:F2}, Occupancy rate: {analysis.OccupancyRate:P1}";
                        actions = new Dictionary<string, object>
                        {
                            ["analysis"] = analysis,
                            ["type"] = "market_analysis"
                        };
                        confidenceScore = 0.85m;
                    }
                    else
                    {
                        response = "Invalid market analysis request format";
                        confidenceScore = 0.1m;
                    }
                    break;

                default:
                    response = await _aiService.GenerateGeneralResponseAsync(request.UserQuery, request.Context);
                    actions = new Dictionary<string, object>
                    {
                        ["type"] = "general",
                        ["query"] = request.UserQuery
                    };
                    confidenceScore = 0.75m;
                    break;
            }

            // Store AI interaction in database
            var interaction = new AIInteraction
            {
                Id = Guid.NewGuid(),
                InteractionType = request.RequestType,
                UserQuery = request.UserQuery,
                AIResponse = response,
                Context = request.Context,
                ConfidenceScore = confidenceScore,
                Timestamp = DateTime.UtcNow
            };

            _context.AIInteractions.Add(interaction);
            await _context.SaveChangesAsync();

            var aiResponse = new AIAgentResponseDto(
                Response: response,
                Actions: actions,
                ConfidenceScore: confidenceScore,
                ProcessedAt: DateTime.UtcNow
            );

            return Ok(aiResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing AI agent request");
            return StatusCode(500, new AIAgentResponseDto(
                Response: "I encountered an error processing your request. Please try again.",
                Actions: new Dictionary<string, object> { ["error"] = true },
                ConfidenceScore: 0m,
                ProcessedAt: DateTime.UtcNow
            ));
        }
    }

    [HttpPost("optimize-property")]
    public async Task<ActionResult<PropertyOptimizationResponseDto>> OptimizePropertyAsync([FromBody] PropertyOptimizationRequestDto request)
    {
        try
        {
            _logger.LogInformation("Optimizing property: {PropertyId}", request.PropertyId);
            var result = await _aiService.OptimizePropertyAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error optimizing property: {PropertyId}", request.PropertyId);
            return StatusCode(500, "Error optimizing property");
        }
    }

    [HttpPost("pricing-strategy")]
    public async Task<ActionResult<PricingResponseDto>> GeneratePricingStrategyAsync([FromBody] PricingRequestDto request)
    {
        try
        {
            _logger.LogInformation("Generating pricing strategy for property: {PropertyId}", request.PropertyId);
            var result = await _aiService.GeneratePricingStrategyAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating pricing strategy for property: {PropertyId}", request.PropertyId);
            return StatusCode(500, "Error generating pricing strategy");
        }
    }

    [HttpPost("guest-communication")]
    public async Task<ActionResult<GuestCommunicationResponseDto>> GenerateGuestResponseAsync([FromBody] GuestCommunicationRequestDto request)
    {
        try
        {
            _logger.LogInformation("Generating guest response for booking: {BookingId}", request.BookingId);
            var result = await _aiService.GenerateGuestResponseAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating guest response for booking: {BookingId}", request.BookingId);
            return StatusCode(500, "Error generating guest response");
        }
    }

    [HttpPost("market-analysis")]
    public async Task<ActionResult<MarketAnalysisResponseDto>> AnalyzeMarketAsync([FromBody] MarketAnalysisRequestDto request)
    {
        try
        {
            _logger.LogInformation("Analyzing market for location: {Location}", request.Location);
            var result = await _aiService.AnalyzeMarketAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing market for location: {Location}", request.Location);
            return StatusCode(500, "Error analyzing market");
        }
    }

    [HttpGet("interactions")]
    public async Task<ActionResult<List<AIInteraction>>> GetRecentInteractionsAsync([FromQuery] int limit = 10)
    {
        try
        {
            var interactions = await _context.AIInteractions
                .OrderByDescending(i => i.Timestamp)
                .Take(limit)
                .ToListAsync();

            return Ok(interactions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving AI interactions");
            return StatusCode(500, "Error retrieving interactions");
        }
    }

    [HttpGet("analytics")]
    public async Task<ActionResult<object>> GetAIAnalyticsAsync()
    {
        try
        {
            var totalInteractions = await _context.AIInteractions.CountAsync();
            var averageConfidence = await _context.AIInteractions.AverageAsync(i => i.ConfidenceScore);
            var interactionsByType = await _context.AIInteractions
                .GroupBy(i => i.InteractionType)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToListAsync();

            var analytics = new
            {
                TotalInteractions = totalInteractions,
                AverageConfidenceScore = averageConfidence,
                InteractionsByType = interactionsByType,
                AnalyzedAt = DateTime.UtcNow
            };

            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving AI analytics");
            return StatusCode(500, "Error retrieving analytics");
        }
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { 
            status = "healthy", 
            timestamp = DateTime.UtcNow,
            version = "2.0",
            features = new[] { "openai", "database", "analytics" }
        });
    }
}
