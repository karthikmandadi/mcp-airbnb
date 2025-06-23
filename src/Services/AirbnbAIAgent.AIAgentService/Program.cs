using AirbnbAIAgent.AIAgentService.Services;
using AirbnbAIAgent.Infrastructure.Data;
using AirbnbAIAgent.MCP.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add database context - using in-memory database for development
builder.Services.AddDbContext<AirbnbDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString) || builder.Environment.IsDevelopment())
    {
        // Use in-memory database for development/testing
        options.UseInMemoryDatabase("AirbnbAI");
    }
    else
    {
        options.UseNpgsql(connectionString);
    }
});

// Add HTTP client for Gemini API
builder.Services.AddHttpClient<GeminiAIService>();

// Add AI services - using Gemini instead of OpenAI
builder.Services.AddScoped<IAIService, GeminiAIService>();

// Add MCP Server
builder.Services.AddScoped<AirbnbMCPServer>();

// Add logging
builder.Services.AddLogging();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AirbnbDbContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health");

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AirbnbDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        // Try to create database and apply migrations
        context.Database.EnsureCreated();
        logger.LogInformation("Database initialized successfully with PostgreSQL");
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Could not initialize database. This is expected if the database server is not available.");
    }
}

app.Run();
