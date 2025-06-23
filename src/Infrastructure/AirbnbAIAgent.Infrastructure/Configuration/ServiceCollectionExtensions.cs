using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AirbnbAIAgent.Infrastructure.Configuration;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Add logging
        services.AddLogging(builder =>
        {
            builder.AddConsole();
            builder.AddDebug();
        });

        // Add configuration
        services.AddSingleton(configuration);

        // Add HTTP client
        services.AddHttpClient();

        // Add memory cache
        services.AddMemoryCache();

        // Add health checks
        services.AddHealthChecks();

        return services;
    }
}

public class DatabaseSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public int MaxRetryAttempts { get; set; } = 3;
    public TimeSpan RetryDelay { get; set; } = TimeSpan.FromSeconds(1);
}

public class RedisSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public int Database { get; set; } = 0;
    public TimeSpan DefaultExpiration { get; set; } = TimeSpan.FromHours(1);
}

public class AISettings
{
    public string OpenAIApiKey { get; set; } = string.Empty;
    public string ModelName { get; set; } = "gpt-4";
    public double Temperature { get; set; } = 0.7;
    public int MaxTokens { get; set; } = 1000;
}

public class MCPSettings
{
    public string ServerUrl { get; set; } = string.Empty;
    public int Port { get; set; } = 8080;
    public string Protocol { get; set; } = "http";
    public TimeSpan Timeout { get; set; } = TimeSpan.FromSeconds(30);
}
