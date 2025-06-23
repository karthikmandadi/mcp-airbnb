# Airbnb AI Agent React Dashboard

A modern React dashboard for managing the Airbnb AI Agent microservices system.

## Features

- **Service Management**: Monitor and manage all microservices
- **Property Management**: CRUD operations for properties with AI optimization
- **AI-Powered Insights**: Real-time AI recommendations and analytics
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Service health monitoring with live updates
- **Model Context Protocol**: Integrated MCP tools and resources

## Services Integration

The dashboard connects to these microservices:

- **Gateway Service** (Port 5000) - Service orchestration
- **Property Service** (Port 5002) - Property management
- **AI Agent Service** (Port 5001) - AI processing and recommendations
- **Pricing Service** (Port 5003) - Dynamic pricing calculations
- **Guest Service** (Port 5004) - Guest management
- **Analytics Service** (Port 5005) - Data insights

## Technology Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for components and theming
- **React Query** for API state management
- **React Router** for navigation
- **Axios** for HTTP requests
- **Vite** for development and building

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Dashboard Features

### 📊 Dashboard Overview
- System health monitoring
- Key performance metrics
- Service status grid
- AI insights panel

### 🏠 Property Management
- View all properties in a beautiful grid
- Add, edit, and delete properties
- AI-powered property optimization
- Property analytics and insights

### 🤖 AI Agent Integration
- Property optimization recommendations
- Dynamic pricing strategies
- Guest communication assistance
- Market analysis insights

### 📈 Real-time Monitoring
- Service health checks
- Performance metrics
- Error tracking
- Response time monitoring

## API Integration

The dashboard communicates with the backend services through a unified API client that handles:

- Authentication
- Error handling
- Request/response transformation
- Retry logic
- Loading states

## Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENABLE_MOCK_DATA=false
```

## Deployment

The React app can be deployed to any static hosting service:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure your web server** to serve the SPA correctly

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **Create new page components** in `src/pages/`
2. **Add API service methods** in `src/services/api.ts`
3. **Define TypeScript types** in `src/types/`
4. **Update routing** in `src/App.tsx`
5. **Add navigation items** in `src/components/Sidebar.tsx`

## Key Components

### Sidebar Navigation
- Dashboard overview
- Property management
- AI agent tools
- Service health monitoring
- Settings and configuration

### TopBar
- System health indicator
- Notifications
- User profile menu
- Quick actions

### Service Cards
- Real-time service status
- Performance metrics
- Health indicators
- Manual refresh options

## Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Guest communication interface
- [ ] Booking management system
- [ ] Revenue optimization tools
- [ ] Mobile app companion
- [ ] Advanced MCP tool integration
- [ ] Real-time notifications
- [ ] Multi-tenant support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Airbnb AI Agent system and follows the same licensing terms.
