using Microsoft.EntityFrameworkCore;

namespace AirbnbAIAgent.Infrastructure.Data;

/// <summary>
/// Alias for AirbnbDbContext for backward compatibility
/// </summary>
public class ApplicationDbContext : AirbnbDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(new DbContextOptionsBuilder<AirbnbDbContext>()
               .UseNpgsql(GetConnectionString(options))
               .Options)
    {
    }

    private static string GetConnectionString(DbContextOptions<ApplicationDbContext> options)
    {
        var extension = options.FindExtension<Microsoft.EntityFrameworkCore.Infrastructure.RelationalOptionsExtension>();
        return extension?.ConnectionString ?? throw new InvalidOperationException("No connection string found");
    }
}
