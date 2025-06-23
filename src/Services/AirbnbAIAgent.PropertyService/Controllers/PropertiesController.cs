using AirbnbAIAgent.Shared.Models;
using AirbnbAIAgent.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AirbnbAIAgent.PropertyService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly ILogger<PropertiesController> _logger;
    private readonly AirbnbDbContext _context;

    public PropertiesController(ILogger<PropertiesController> logger, AirbnbDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesAsync()
    {
        try
        {
            var properties = await _context.Properties
                .Select(p => new PropertyDto(
                    p.Id,
                    p.Title,
                    p.Description,
                    p.Address,
                    p.BasePrice,
                    p.MaxGuests,
                    p.Bedrooms,
                    p.Bathrooms,
                    p.Amenities,
                    p.Status,
                    p.CreatedAt,
                    p.UpdatedAt
                ))
                .ToListAsync();

            // If no properties exist, seed some sample data
            if (!properties.Any())
            {
                _logger.LogInformation("No properties found in database, seeding sample data...");
                await SeedSampleDataAsync();
                
                // Fetch the newly seeded properties
                properties = await _context.Properties
                    .Select(p => new PropertyDto(
                        p.Id,
                        p.Title,
                        p.Description,
                        p.Address,
                        p.BasePrice,
                        p.MaxGuests,
                        p.Bedrooms,
                        p.Bathrooms,
                        p.Amenities,
                        p.Status,
                        p.CreatedAt,
                        p.UpdatedAt
                    ))
                    .ToListAsync();
            }

            _logger.LogInformation("Returning {Count} properties", properties.Count);
            return Ok(properties);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving properties from database");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyDto>> GetPropertyAsync(Guid id)
    {
        try
        {
            var property = await _context.Properties
                .Where(p => p.Id == id)
                .Select(p => new PropertyDto(
                    p.Id,
                    p.Title,
                    p.Description,
                    p.Address,
                    p.BasePrice,
                    p.MaxGuests,
                    p.Bedrooms,
                    p.Bathrooms,
                    p.Amenities,
                    p.Status,
                    p.CreatedAt,
                    p.UpdatedAt
                ))
                .FirstOrDefaultAsync();

            if (property == null)
            {
                return NotFound();
            }

            return Ok(property);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving property {PropertyId} from database", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<PropertyDto>> CreatePropertyAsync([FromBody] PropertyDto propertyDto)
    {
        try
        {
            var property = new Property
            {
                Id = Guid.NewGuid(),
                Title = propertyDto.Title,
                Description = propertyDto.Description,
                Address = propertyDto.Address,
                BasePrice = propertyDto.BasePrice,
                MaxGuests = propertyDto.MaxGuests,
                Bedrooms = propertyDto.Bedrooms,
                Bathrooms = propertyDto.Bathrooms,
                Amenities = propertyDto.Amenities,
                Status = propertyDto.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            var newPropertyDto = new PropertyDto(
                property.Id,
                property.Title,
                property.Description,
                property.Address,
                property.BasePrice,
                property.MaxGuests,
                property.Bedrooms,
                property.Bathrooms,
                property.Amenities,
                property.Status,
                property.CreatedAt,
                property.UpdatedAt
            );

            _logger.LogInformation("Created new property: {PropertyId}", property.Id);
            return CreatedAtAction(nameof(GetPropertyAsync), new { id = property.Id }, newPropertyDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating property in database");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PropertyDto>> UpdatePropertyAsync(Guid id, [FromBody] PropertyDto propertyDto)
    {
        try
        {
            var property = await _context.Properties.FindAsync(id);
            if (property == null)
            {
                return NotFound();
            }

            property.Title = propertyDto.Title;
            property.Description = propertyDto.Description;
            property.Address = propertyDto.Address;
            property.BasePrice = propertyDto.BasePrice;
            property.MaxGuests = propertyDto.MaxGuests;
            property.Bedrooms = propertyDto.Bedrooms;
            property.Bathrooms = propertyDto.Bathrooms;
            property.Amenities = propertyDto.Amenities;
            property.Status = propertyDto.Status;
            property.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var updatedPropertyDto = new PropertyDto(
                property.Id,
                property.Title,
                property.Description,
                property.Address,
                property.BasePrice,
                property.MaxGuests,
                property.Bedrooms,
                property.Bathrooms,
                property.Amenities,
                property.Status,
                property.CreatedAt,
                property.UpdatedAt
            );

            _logger.LogInformation("Updated property: {PropertyId}", id);
            return Ok(updatedPropertyDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating property {PropertyId} in database", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePropertyAsync(Guid id)
    {
        try
        {
            var property = await _context.Properties.FindAsync(id);
            if (property == null)
            {
                return NotFound();
            }

            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted property: {PropertyId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting property {PropertyId} from database", id);
            return StatusCode(500, "Internal server error");
        }
    }

    private async Task SeedSampleDataAsync()
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Double-check that no properties exist within the transaction
            var existingCount = await _context.Properties.CountAsync();
            if (existingCount > 0)
            {
                _logger.LogInformation("Properties already exist ({Count}), skipping seed", existingCount);
                await transaction.RollbackAsync();
                return;
            }

            var sampleProperties = new[]
            {
                new Property
                {
                    Id = Guid.NewGuid(),
                    Title = "Luxury Downtown Apartment",
                    Description = "Beautiful 2-bedroom apartment in the heart of the city with stunning views and modern amenities",
                    Address = "123 Main St, Downtown",
                    BasePrice = 150.00m,
                    MaxGuests = 4,
                    Bedrooms = 2,
                    Bathrooms = 2,
                    Amenities = new List<string> { "WiFi", "Kitchen", "Washer", "AC", "Parking", "City View" },
                    Status = PropertyStatus.Active,
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    UpdatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Property
                {
                    Id = Guid.NewGuid(),
                    Title = "Cozy Beach House",
                    Description = "Charming beach house with ocean views, perfect for a relaxing getaway",
                    Address = "456 Ocean Blvd, Beachside",
                    BasePrice = 220.00m,
                    MaxGuests = 6,
                    Bedrooms = 3,
                    Bathrooms = 2,
                    Amenities = new List<string> { "WiFi", "Kitchen", "Beach Access", "Hot Tub", "Parking", "Ocean View" },
                    Status = PropertyStatus.Active,
                    CreatedAt = DateTime.UtcNow.AddDays(-45),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Property
                {
                    Id = Guid.NewGuid(),
                    Title = "Mountain Cabin Retreat",
                    Description = "Peaceful cabin in the mountains with fireplace and hiking trails nearby",
                    Address = "789 Pine Ridge Dr, Mountain View",
                    BasePrice = 180.00m,
                    MaxGuests = 8,
                    Bedrooms = 4,
                    Bathrooms = 3,
                    Amenities = new List<string> { "WiFi", "Kitchen", "Fireplace", "Hot Tub", "Parking", "Mountain View", "Hiking" },
                    Status = PropertyStatus.Active,
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await _context.Properties.AddRangeAsync(sampleProperties);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            
            _logger.LogInformation("Successfully seeded {Count} sample properties to database", sampleProperties.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding sample data, rolling back transaction");
            await transaction.RollbackAsync();
            throw;
        }
    }
}
