using AirbnbAIAgent.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace AirbnbAIAgent.PricingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PricingController : ControllerBase
{
    private readonly ILogger<PricingController> _logger;

    public PricingController(ILogger<PricingController> logger)
    {
        _logger = logger;
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<PricingResponseDto>> CalculatePricingAsync([FromBody] PricingRequestDto request)
    {
        try
        {
            _logger.LogInformation("Calculating pricing for property {PropertyId}", request.PropertyId);

            // Simulate AI-powered pricing calculation
            await Task.Delay(200);

            var basePrice = GetBasePrice(request.PropertyId);
            var dynamicAdjustment = CalculateDynamicAdjustment(request);
            var recommendedPrice = basePrice + dynamicAdjustment;

            var response = new PricingResponseDto(
                RecommendedPrice: recommendedPrice,
                BasePrice: basePrice,
                DynamicAdjustment: dynamicAdjustment,
                PricingFactors: GetPricingFactors(request),
                CalculatedAt: DateTime.UtcNow
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating pricing for property {PropertyId}", request.PropertyId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("factors/{propertyId}")]
    public async Task<ActionResult<Dictionary<string, decimal>>> GetPricingFactorsAsync(Guid propertyId)
    {
        try
        {
            await Task.Delay(100);

            var factors = new Dictionary<string, decimal>
            {
                ["base_rate"] = 100.0m,
                ["seasonal_multiplier"] = 1.2m,
                ["demand_factor"] = 1.1m,
                ["competition_factor"] = 0.95m,
                ["amenity_premium"] = 1.05m
            };

            return Ok(factors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pricing factors for property {PropertyId}", propertyId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("market-analysis/{location}")]
    public async Task<ActionResult<object>> GetMarketAnalysisAsync(string location)
    {
        try
        {
            await Task.Delay(300);

            var analysis = new
            {
                location,
                averagePrice = 185.50m,
                occupancyRate = 0.78m,
                competitorCount = 24,
                seasonalTrends = new Dictionary<string, decimal>
                {
                    ["spring"] = 1.1m,
                    ["summer"] = 1.3m,
                    ["fall"] = 1.0m,
                    ["winter"] = 0.9m
                },
                analyzedAt = DateTime.UtcNow
            };

            return Ok(analysis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing market analysis for location {Location}", location);
            return StatusCode(500, "Internal server error");
        }
    }

    private static decimal GetBasePrice(Guid propertyId)
    {
        // Simulate base price lookup
        return 120.0m + (propertyId.GetHashCode() % 100);
    }

    private static decimal CalculateDynamicAdjustment(PricingRequestDto request)
    {
        var adjustment = 0.0m;

        // Season adjustment
        var month = request.CheckInDate.Month;
        if (month >= 6 && month <= 8) // Summer
            adjustment += 30.0m;
        else if (month >= 12 || month <= 2) // Winter
            adjustment -= 15.0m;

        // Guest count adjustment
        if (request.GuestCount > 4)
            adjustment += 10.0m * (request.GuestCount - 4);

        // Length of stay adjustment
        var nights = (request.CheckOutDate - request.CheckInDate).Days;
        if (nights >= 7)
            adjustment -= 5.0m; // Weekly discount

        // Market factors
        if (request.MarketFactors.ContainsKey("high_demand") && 
            request.MarketFactors["high_demand"].ToString() == "true")
            adjustment += 25.0m;

        return adjustment;
    }

    private static Dictionary<string, decimal> GetPricingFactors(PricingRequestDto request)
    {
        return new Dictionary<string, decimal>
        {
            ["base_rate"] = GetBasePrice(request.PropertyId),
            ["seasonal_adjustment"] = request.CheckInDate.Month >= 6 && request.CheckInDate.Month <= 8 ? 1.25m : 1.0m,
            ["demand_multiplier"] = 1.15m,
            ["guest_count_factor"] = request.GuestCount > 4 ? 1.1m : 1.0m,
            ["length_of_stay_discount"] = (request.CheckOutDate - request.CheckInDate).Days >= 7 ? 0.95m : 1.0m
        };
    }
}
