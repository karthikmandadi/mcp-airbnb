using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace AirbnbAIAgent.Gateway.Controllers;

[ApiController]
[Route("api")]
public class ProxyController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ProxyController> _logger;

    // Service endpoints mapping
    private readonly Dictionary<string, string> _serviceUrls = new()
    {
        { "properties", "http://property-service:5001" },
        { "pricing", "http://pricing-service:5002" },
        { "aiagent", "http://ai-agent-service:5005" },
        { "guests", "http://guest-service:5003" },
        { "analytics", "http://analytics-service:5004" }
    };

    public ProxyController(IHttpClientFactory httpClientFactory, ILogger<ProxyController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpGet("{service}/{**path}")]
    [HttpPost("{service}/{**path}")]
    [HttpPut("{service}/{**path}")]
    [HttpDelete("{service}/{**path}")]
    public async Task<IActionResult> ProxyAsync(string service, string? path = null)
    {
        try
        {
            // Convert service name to lowercase for lookup, and handle common variations
            var serviceLookup = service.ToLowerInvariant() switch
            {
                "properties" or "property" => "properties",
                "pricing" or "prices" => "pricing", 
                "aiagent" or "ai-agent" or "agent" => "aiagent",
                "guests" or "guest" => "guests",
                "analytics" or "analysis" => "analytics",
                _ => service.ToLowerInvariant()
            };

            _logger.LogInformation("Service: '{Service}', ServiceLookup: '{ServiceLookup}'", service, serviceLookup);

            if (!_serviceUrls.TryGetValue(serviceLookup, out var serviceUrl))
            {
                _logger.LogWarning("Service lookup failed. Available services: {Services}", string.Join(", ", _serviceUrls.Keys));
                return NotFound($"Service '{service}' not found");
            }

            var client = _httpClientFactory.CreateClient();
            
            // Use the original service name in the path to maintain the original casing
            var requestPath = string.IsNullOrEmpty(path) ? $"/api/{service}" : $"/api/{service}/{path}";
            
            var targetUrl = $"{serviceUrl}{requestPath}";

            // Add query string if present
            if (Request.QueryString.HasValue)
            {
                targetUrl += Request.QueryString.Value;
            }

            _logger.LogInformation("Proxying {Method} request to {TargetUrl}", Request.Method, targetUrl);

            // Create the request message
            var requestMessage = new HttpRequestMessage(new HttpMethod(Request.Method), targetUrl);

            // Copy headers (excluding host and some others)
            foreach (var header in Request.Headers)
            {
                if (!IsRestrictedHeader(header.Key))
                {
                    requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
                }
            }

            // Copy request body for POST/PUT requests
            if (Request.Method == "POST" || Request.Method == "PUT")
            {
                var requestBody = await new StreamReader(Request.Body).ReadToEndAsync();
                if (!string.IsNullOrEmpty(requestBody))
                {
                    requestMessage.Content = new StringContent(requestBody, Encoding.UTF8, Request.ContentType ?? "application/json");
                }
            }

            // Send the request
            var response = await client.SendAsync(requestMessage);

            // Get response content as string and return as JSON
            var responseContent = await response.Content.ReadAsStringAsync();
            
            return new JsonResult(System.Text.Json.JsonSerializer.Deserialize<object>(responseContent))
            {
                StatusCode = (int)response.StatusCode
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error proxying request to service {Service}", service);
            return StatusCode(503, new { error = "Service unavailable", service = service });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error proxying request to service {Service}", service);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    private static bool IsRestrictedHeader(string headerName)
    {
        var restrictedHeaders = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "Host", "Content-Length", "Transfer-Encoding", "Connection", "Expect"
        };

        return restrictedHeaders.Contains(headerName);
    }
}
