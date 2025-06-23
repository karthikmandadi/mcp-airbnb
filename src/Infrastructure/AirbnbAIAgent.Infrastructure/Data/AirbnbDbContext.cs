using AirbnbAIAgent.Shared.Models;
using Microsoft.EntityFrameworkCore;

namespace AirbnbAIAgent.Infrastructure.Data;

public class AirbnbDbContext : DbContext
{
    public AirbnbDbContext(DbContextOptions<AirbnbDbContext> options) : base(options)
    {
    }

    public DbSet<Property> Properties { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Guest> Guests { get; set; }
    public DbSet<PricingHistory> PricingHistory { get; set; }
    public DbSet<AIInteraction> AIInteractions { get; set; }
    public DbSet<PropertyAnalytics> PropertyAnalytics { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Property configuration
        modelBuilder.Entity<Property>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
            entity.Property(e => e.BasePrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Amenities).HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            );
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Booking configuration
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            entity.HasOne<Property>()
                .WithMany()
                .HasForeignKey(e => e.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<Guest>()
                .WithMany()
                .HasForeignKey(e => e.GuestId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.PropertyId);
            entity.HasIndex(e => e.GuestId);
            entity.HasIndex(e => e.CheckInDate);
            entity.HasIndex(e => e.Status);
        });

        // Guest configuration
        modelBuilder.Entity<Guest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Pricing History configuration
        modelBuilder.Entity<PricingHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.BasePrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.DynamicAdjustment).HasColumnType("decimal(18,2)");
            entity.Property(e => e.PricingFactors).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, new System.Text.Json.JsonSerializerOptions()),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, new System.Text.Json.JsonSerializerOptions()) ?? new Dictionary<string, decimal>()
            );
            entity.HasOne<Property>()
                .WithMany()
                .HasForeignKey(e => e.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.PropertyId);
            entity.HasIndex(e => e.Date);
        });

        // AI Interaction configuration
        modelBuilder.Entity<AIInteraction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserQuery).HasMaxLength(2000);
            entity.Property(e => e.AIResponse).HasMaxLength(4000);
            entity.Property(e => e.Context).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, new System.Text.Json.JsonSerializerOptions()),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(v, new System.Text.Json.JsonSerializerOptions()) ?? new Dictionary<string, object>()
            );
            entity.Property(e => e.ConfidenceScore).HasColumnType("decimal(3,2)");
            entity.HasIndex(e => e.Timestamp);
            entity.HasIndex(e => e.InteractionType);
        });

        // Property Analytics configuration
        modelBuilder.Entity<PropertyAnalytics>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ViewCount).HasDefaultValue(0);
            entity.Property(e => e.BookingCount).HasDefaultValue(0);
            entity.Property(e => e.AverageRating).HasColumnType("decimal(3,2)");
            entity.Property(e => e.Revenue).HasColumnType("decimal(18,2)");
            entity.Property(e => e.OccupancyRate).HasColumnType("decimal(5,4)");
            entity.Property(e => e.Metrics).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, new System.Text.Json.JsonSerializerOptions()),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(v, new System.Text.Json.JsonSerializerOptions()) ?? new Dictionary<string, object>()
            );
            entity.HasOne<Property>()
                .WithOne()
                .HasForeignKey<PropertyAnalytics>(e => e.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.PropertyId).IsUnique();
            entity.HasIndex(e => e.Date);
        });
    }
}
