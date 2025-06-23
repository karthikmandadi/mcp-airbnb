using AirbnbAIAgent.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add database context with PostgreSQL
builder.Services.AddDbContext<AirbnbDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection") ?? 
        "Host=localhost;Database=AirbnbAI;Username=airbnb;Password=airbnb123"));

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
        // Check if we can connect to the database
        await context.Database.CanConnectAsync();
        logger.LogInformation("Successfully connected to PostgreSQL database");
        
        // Ensure database and tables are created
        await context.Database.EnsureCreatedAsync();
        logger.LogInformation("Database schema ensured to exist");
        
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to initialize database connection to PostgreSQL");
        // Don't throw here - let the service start and handle DB connection errors gracefully
    }
}

app.Run();
