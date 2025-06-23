import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Home as PropertyIcon,
  People as GuestIcon,
  AttachMoney as RevenueIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { analyticsService, gatewayService } from '../services/api';

const Dashboard: React.FC = () => {
  const { data: servicesStatus, isLoading: servicesLoading } = useQuery(
    'servicesStatus',
    gatewayService.getServicesStatus,
    {
      refetchInterval: 30000,
      staleTime: 25000,
    }
  );

  // Mock data for dashboard metrics
  const mockMetrics = {
    totalProperties: 42,
    activeBookings: 18,
    totalRevenue: 125420,
    averageOccupancy: 78.5,
    aiInteractions: 156,
    systemHealth: 'healthy' as const,
  };

  const metricCards = [
    {
      title: 'Total Properties',
      value: mockMetrics.totalProperties,
      icon: <PropertyIcon />,
      color: '#FF5A5F',
      change: '+12%',
    },
    {
      title: 'Active Bookings',
      value: mockMetrics.activeBookings,
      icon: <GuestIcon />,
      color: '#00A699',
      change: '+8%',
    },
    {
      title: 'Revenue (30d)',
      value: `$${mockMetrics.totalRevenue.toLocaleString()}`,
      icon: <RevenueIcon />,
      color: '#FC642D',
      change: '+23%',
    },
    {
      title: 'Avg Occupancy',
      value: `${mockMetrics.averageOccupancy}%`,
      icon: <TrendingUpIcon />,
      color: '#484848',
      change: '+5%',
    },
    {
      title: 'AI Interactions',
      value: mockMetrics.aiInteractions,
      icon: <AIIcon />,
      color: '#767676',
      change: '+34%',
    },
  ];

  const getSystemHealthStatus = () => {
    if (!servicesStatus?.services) return { status: 'loading', count: 0, total: 0 };
    
    const services = Object.values(servicesStatus.services);
    const healthyServices = services.filter((service: any) => service.status === 'healthy').length;
    const totalServices = services.length;
    
    let status = 'healthy';
    if (healthyServices / totalServices < 0.7) status = 'critical';
    else if (healthyServices < totalServices) status = 'warning';
    
    return { status, count: healthyServices, total: totalServices };
  };

  const systemHealth = getSystemHealthStatus();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        Dashboard Overview
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Monitor your Airbnb AI Agent system performance and key metrics
      </Typography>

      {/* System Health Banner */}
      <Card sx={{ mb: 3, bgcolor: systemHealth.status === 'healthy' ? 'success.light' : 'warning.light' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" fontWeight={600}>
                System Health: {systemHealth.status.toUpperCase()}
              </Typography>
              <Typography variant="body2">
                {systemHealth.count} of {systemHealth.total} services are healthy
              </Typography>
            </Box>
            <Chip
              label={`${Math.round((systemHealth.count / Math.max(systemHealth.total, 1)) * 100)}% Operational`}
              color={systemHealth.status === 'healthy' ? 'success' : 'warning'}
            />
          </Box>
          {servicesLoading && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricCards.map((metric, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: metric.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {metric.icon}
                  </Avatar>
                  <Chip
                    label={metric.change}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="h4" component="div" fontWeight={600} gutterBottom>
                  {metric.value}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Services Status Grid */}
      <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
        Services Status
      </Typography>
      
      <Grid container spacing={3}>
        {servicesStatus?.services && Object.entries(servicesStatus.services).map(([serviceName, status]) => (
          <Grid item xs={12} sm={6} md={4} key={serviceName}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: (status as any).status === 'healthy' ? 'success.main' : 'error.main',
                      mr: 2,
                    }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    {serviceName.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Typography>
                </Box>
                
                <Chip
                  label={(status as any).status?.toUpperCase() || 'UNKNOWN'}
                  color={(status as any).status === 'healthy' ? 'success' : 'error'}
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="body2" color="text.secondary">
                  Last checked: {new Date((status as any).responseTime).toLocaleTimeString()}
                </Typography>
                
                {(status as any).statusCode && (
                  <Typography variant="body2" color="text.secondary">
                    Status Code: {(status as any).statusCode}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* AI Insights Panel */}
      <Card sx={{ mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            AI Insights & Recommendations
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={600}>
                  92%
                </Typography>
                <Typography variant="body2">
                  Properties optimized by AI recommendations
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={600}>
                  $18.5K
                </Typography>
                <Typography variant="body2">
                  Additional revenue from AI pricing strategies
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={600}>
                  4.8★
                </Typography>
                <Typography variant="body2">
                  Average guest satisfaction with AI responses
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
