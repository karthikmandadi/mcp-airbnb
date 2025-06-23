using Microsoft.AspNetCore.Mvc;

namespace AirbnbAIAgent.Gateway.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GatewayController : ControllerBase
{
    private readonly ILogger<GatewayController> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public GatewayController(ILogger<GatewayController> logger, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { 
            status = "healthy", 
            timestamp = DateTime.UtcNow,
            version = "1.0.0",
            services = new[]
            {
                "property-service",
                "pricing-service", 
                "guest-service",
                "analytics-service",
                "ai-agent-service"
            }
        });
    }

    [HttpGet("services/status")]
    public async Task<IActionResult> GetServicesStatusAsync()
    {
        var client = _httpClientFactory.CreateClient();
        var services = new Dictionary<string, object>();

        try
        {
            // Check Property Service
            services["property-service"] = await CheckServiceHealthAsync(client, "http://localhost:5144/api/properties");
            
            // Check Pricing Service
            services["pricing-service"] = await CheckServiceHealthAsync(client, "http://localhost:5037/api/pricing");
            
            // Check AI Agent Service
            services["ai-agent-service"] = await CheckServiceHealthAsync(client, "http://localhost:5270/api/aiagent/health");

            return Ok(new { 
                timestamp = DateTime.UtcNow,
                services 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking service status");
            return StatusCode(500, "Error checking service status");
        }
    }

    private static async Task<object> CheckServiceHealthAsync(HttpClient client, string endpoint)
    {
        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
            var response = await client.GetAsync(endpoint, cts.Token);
            
            return new { 
                status = response.IsSuccessStatusCode ? "healthy" : "unhealthy",
                statusCode = (int)response.StatusCode,
                responseTime = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            return new { 
                status = "error",
                error = ex.Message,
                responseTime = DateTime.UtcNow
            };
        }
    }
}
