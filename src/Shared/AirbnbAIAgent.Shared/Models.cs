namespace AirbnbAIAgent.Shared.Models;

// Entity Models
public class Property
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public int MaxGuests { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public List<string> Amenities { get; set; } = new();
    public PropertyStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class Booking
{
    public Guid Id { get; set; }
    public Guid PropertyId { get; set; }
    public Guid GuestId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public decimal TotalPrice { get; set; }
    public BookingStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class Guest
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class PricingHistory
{
    public Guid Id { get; set; }
    public Guid PropertyId { get; set; }
    public DateTime Date { get; set; }
    public decimal Price { get; set; }
    public decimal BasePrice { get; set; }
    public decimal DynamicAdjustment { get; set; }
    public Dictionary<string, decimal> PricingFactors { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class AIInteraction
{
    public Guid Id { get; set; }
    public string InteractionType { get; set; } = string.Empty;
    public string UserQuery { get; set; } = string.Empty;
    public string AIResponse { get; set; } = string.Empty;
    public Dictionary<string, object> Context { get; set; } = new();
    public decimal ConfidenceScore { get; set; }
    public DateTime Timestamp { get; set; }
}

public class PropertyAnalytics
{
    public Guid Id { get; set; }
    public Guid PropertyId { get; set; }
    public DateTime Date { get; set; }
    public int ViewCount { get; set; }
    public int BookingCount { get; set; }
    public decimal AverageRating { get; set; }
    public decimal Revenue { get; set; }
    public decimal OccupancyRate { get; set; }
    public Dictionary<string, object> Metrics { get; set; } = new();
}

// Enums
public enum PropertyStatus
{
    Draft,
    Active,
    Inactive,
    Maintenance,
    Booked
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    CheckedIn,
    CheckedOut,
    Cancelled
}

public enum AIInteractionType
{
    PropertyOptimization,
    PricingStrategy,
    GuestCommunication,
    MarketAnalysis,
    General
}

// DTOs
public record PropertyDto(
    Guid Id,
    string Title,
    string Description,
    string Address,
    decimal BasePrice,
    int MaxGuests,
    int Bedrooms,
    int Bathrooms,
    List<string> Amenities,
    PropertyStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record BookingDto(
    Guid Id,
    Guid PropertyId,
    Guid GuestId,
    DateTime CheckInDate,
    DateTime CheckOutDate,
    decimal TotalPrice,
    BookingStatus Status,
    DateTime CreatedAt
);

public record GuestDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    DateTime CreatedAt
);

public record PricingRequestDto(
    Guid PropertyId,
    DateTime CheckInDate,
    DateTime CheckOutDate,
    int GuestCount,
    Dictionary<string, object> MarketFactors
);

public record PricingResponseDto(
    decimal RecommendedPrice,
    decimal BasePrice,
    decimal DynamicAdjustment,
    Dictionary<string, decimal> PricingFactors,
    DateTime CalculatedAt
);

public record AIAgentRequestDto(
    string RequestType,
    Dictionary<string, object> Context,
    string UserQuery,
    DateTime Timestamp
);

public record AIAgentResponseDto(
    string Response,
    Dictionary<string, object> Actions,
    decimal ConfidenceScore,
    DateTime ProcessedAt
);

public record PropertyOptimizationRequestDto(
    Guid PropertyId,
    string? CurrentTitle,
    string? CurrentDescription,
    List<string>? CurrentAmenities,
    Dictionary<string, object>? MarketData
);

public record PropertyOptimizationResponseDto(
    string OptimizedTitle,
    string OptimizedDescription,
    List<string> RecommendedAmenities,
    Dictionary<string, string> OptimizationReasons,
    decimal ConfidenceScore
);

public record GuestCommunicationRequestDto(
    Guid BookingId,
    string GuestMessage,
    string CommunicationType,
    Dictionary<string, object>? Context
);

public record GuestCommunicationResponseDto(
    string AIResponse,
    string Tone,
    List<string> SuggestedActions,
    decimal ConfidenceScore
);

public record MarketAnalysisRequestDto(
    string Location,
    DateTime StartDate,
    DateTime EndDate,
    PropertyType PropertyType,
    Dictionary<string, object>? Filters
);

public record MarketAnalysisResponseDto(
    decimal AveragePrice,
    decimal OccupancyRate,
    Dictionary<string, decimal> PricingTrends,
    List<string> MarketInsights,
    DateTime AnalyzedAt
);

public enum PropertyType
{
    Apartment,
    House,
    Villa,
    Studio,
    Condo,
    Other
}
