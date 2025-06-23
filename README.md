# Airbnb AI Agent - Model Context Protocol Integration

A comprehensive .NET 8.0 microservices solution for AI-powered Airbnb property management with Model Context Protocol (MCP) integration.

## 🏗️ Architecture Overview

This solution implements a microservices architecture with the following components:

### Core Services
- **React Dashboard** (`src/Frontend`) - Modern web interface for managing all services
- **API Gateway** (`AirbnbAIAgent.Gateway`) - Central entry point and service orchestration
- **Property Service** (`AirbnbAIAgent.PropertyService`) - Property listings and management
- **Pricing Service** (`AirbnbAIAgent.PricingService`) - Dynamic pricing algorithms and market analysis
- **Guest Service** (`AirbnbAIAgent.GuestService`) - Guest communications and booking management
- **Analytics Service** (`AirbnbAIAgent.AnalyticsService`) - Performance insights and reporting
- **AI Agent Service** (`AirbnbAIAgent.AIAgentService`) - Core AI logic and decision making

### Infrastructure
- **Shared Library** (`AirbnbAIAgent.Shared`) - Common models, DTOs, and utilities
- **Infrastructure Layer** (`AirbnbAIAgent.Infrastructure`) - Database, caching, and configuration
- **MCP Integration** (`AirbnbAIAgent.MCP`) - Model Context Protocol server implementation

## 🚀 Key Features

### AI-Powered Capabilities
- **Dynamic Pricing**: Intelligent pricing recommendations based on market data, seasonality, and demand
- **Property Optimization**: AI-driven insights for property performance improvement
- **Guest Communication**: Automated guest support and communication
- **Market Analysis**: Real-time market trends and competitive analysis

### Model Context Protocol Integration
- **Resource Management**: Expose property data and analytics through MCP resources
- **Tool Definitions**: AI-accessible tools for property search, pricing optimization, and insights generation
- **Standardized Interface**: MCP-compliant server for seamless AI model integration

### Microservices Benefits
- **Scalability**: Independent scaling of each service based on demand
- **Resilience**: Fault isolation and service-level availability
- **Technology Diversity**: Service-specific technology choices
- **Team Autonomy**: Independent development and deployment

## 🛠️ Technology Stack

### Backend
- **.NET 8.0** - Modern cross-platform framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - Data access layer
- **Redis** - Caching and session management
- **Docker** - Containerization
- **OpenAPI/Swagger** - API documentation
- **Serilog** - Structured logging
- **MediatR** - CQRS pattern implementation

### Frontend
- **React 18** - Modern web framework with TypeScript
- **Material-UI (MUI)** - Component library and design system
- **React Query** - Data fetching and state management
- **React Router** - Client-side routing
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API communication

## 📋 Prerequisites

- .NET 8.0 SDK
- Visual Studio Code or Visual Studio 2022
- Docker Desktop (optional, for containerization)
- Redis (for caching)

## 🏃‍♂️ Getting Started

### 1. Clone and Setup
```bash
git clone <repository-url>
cd MCP_AIirbnb
dotnet restore
```

### 2. Build the Solution
```bash
dotnet build
```

### 3. Start the React Dashboard
```bash
cd src/Frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:3000`

### 4. Run Services
Each service can be run independently:

```bash
# API Gateway (Port 5000)
dotnet run --project src/Gateway/AirbnbAIAgent.Gateway

# Property Service (Port 5001) 
dotnet run --project src/Services/AirbnbAIAgent.PropertyService

# Pricing Service (Port 5002)
dotnet run --project src/Services/AirbnbAIAgent.PricingService

# AI Agent Service (Port 5005)
dotnet run --project src/Services/AirbnbAIAgent.AIAgentService
```

### 5. Or Use Docker Compose
```bash
# Start all services including the React dashboard
docker-compose up -d
```

### 6. Access the Application
- **React Dashboard**: `http://localhost:3000`
- **API Gateway**: `http://localhost:5000`
- **Swagger Documentation**: `http://localhost:5000/swagger`

### 7. Test the APIs
- Gateway Health: http://localhost:5000/api/gateway/health
- Properties: http://localhost:5001/api/properties
- Pricing: http://localhost:5002/api/pricing/calculate

## 🔧 Configuration

### Application Settings
Each service has its own `appsettings.json` with service-specific configuration:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Database": {
    "ConnectionString": "Server=localhost;Database=AirbnbAI;Trusted_Connection=true;",
    "DatabaseName": "AirbnbAI"
  },
  "Redis": {
    "ConnectionString": "localhost:6379",
    "Database": 0
  },
  "AI": {
    "OpenAIApiKey": "your-openai-key",
    "ModelName": "gpt-4",
    "Temperature": 0.7
  },
  "MCP": {
    "ServerUrl": "http://localhost:8080",
    "Protocol": "http",
    "Timeout": "00:00:30"
  }
}
```

## 📖 Model Context Protocol (MCP)

### Resources
The MCP server exposes the following resources:

- `airbnb://properties` - Property listings and details
- `airbnb://bookings` - Booking data and history
- `airbnb://analytics` - Performance metrics and insights

### Tools
Available tools for AI model interaction:

- `search_properties` - Search and filter properties
- `optimize_pricing` - Get pricing recommendations
- `generate_property_insights` - AI-powered property analysis

### Usage Example
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_properties",
    "arguments": {
      "location": "downtown",
      "max_price": 200,
      "guests": 4,
      "amenities": ["WiFi", "Kitchen"]
    }
  }
}
```

## 🧪 Testing

### Unit Tests
```bash
dotnet test
```

### Integration Tests
```bash
dotnet test --configuration Release
```

### API Testing
Use the included `.http` files in each service directory for API testing with VS Code REST Client extension.

## 🐳 Docker Support

### Build Images
```bash
docker build -t airbnb-gateway -f src/Gateway/AirbnbAIAgent.Gateway/Dockerfile .
docker build -t airbnb-property -f src/Services/AirbnbAIAgent.PropertyService/Dockerfile .
```

### Run with Docker Compose
```bash
docker-compose up -d
```

## 📊 Monitoring and Observability

- **Health Checks**: Built-in health endpoints for all services
- **Structured Logging**: Serilog with correlation IDs
- **Metrics**: Performance counters and custom metrics
- **Distributed Tracing**: OpenTelemetry integration

## 🔐 Security

- **API Authentication**: JWT token-based authentication
- **Rate Limiting**: Request throttling per service
- **Input Validation**: Comprehensive request validation
- **CORS**: Configurable cross-origin resource sharing

## 🚀 Deployment

### Local Development
Use the VS Code tasks and launch configurations for debugging.

### Production
- Container orchestration with Kubernetes
- CI/CD pipeline with GitHub Actions
- Environment-specific configuration management

## 📚 API Documentation

Each service exposes Swagger/OpenAPI documentation:
- Gateway: http://localhost:5000/swagger
- Property Service: http://localhost:5001/swagger
- Pricing Service: http://localhost:5002/swagger

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [.NET 8.0 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Microservices Architecture Guide](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/)
