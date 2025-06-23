import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
} from '@mui/material';
import {
  SmartToy as AIIcon,
  TrendingUp as OptimizeIcon,
  AttachMoney as PricingIcon,
  Chat as CommunicationIcon,
  Analytics as AnalyticsIcon,
  AutoFixHigh as MagicIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import { aiAgentService, propertyService } from '../services/api';
import { Property, PropertyOptimizationRequest, PricingRequest, GuestCommunicationRequest, MarketAnalysisRequest } from '../types';

const AIAgent: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('property-optimization');
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [communicationMessage, setCommunicationMessage] = useState('');
  const [pricingDates, setPricingDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
  });
  const [marketLocation, setMarketLocation] = useState('');

  // Fetch properties for selection
  const { data: properties = [] } = useQuery(
    'properties',
    () => propertyService.getProperties(),
    { staleTime: 60000 }
  );

  // AI Mutations
  const optimizePropertyMutation = useMutation(aiAgentService.optimizeProperty, {
    onSuccess: (data) => {
      setCurrentResult(data);
      setOpenResultDialog(true);
    },
  });

  const pricingStrategyMutation = useMutation(aiAgentService.generatePricingStrategy, {
    onSuccess: (data) => {
      setCurrentResult(data);
      setOpenResultDialog(true);
    },
  });

  const guestCommunicationMutation = useMutation(aiAgentService.generateGuestResponse, {
    onSuccess: (data) => {
      setCurrentResult(data);
      setOpenResultDialog(true);
    },
  });

  const marketAnalysisMutation = useMutation(aiAgentService.analyzeMarket, {
    onSuccess: (data) => {
      setCurrentResult(data);
      setOpenResultDialog(true);
    },
  });

  const aiTools = [
    {
      id: 'property-optimization',
      name: 'Property Optimization',
      description: 'AI-powered recommendations to improve your property listing',
      icon: <OptimizeIcon />,
      color: '#4CAF50',
      action: () => handlePropertyOptimization(),
    },
    {
      id: 'pricing-strategy',
      name: 'Dynamic Pricing',
      description: 'Generate optimal pricing strategies based on market data',
      icon: <PricingIcon />,
      color: '#FF9800',
      action: () => handlePricingStrategy(),
    },
    {
      id: 'guest-communication',
      name: 'Guest Communication',
      description: 'AI-assisted responses for guest inquiries and messages',
      icon: <CommunicationIcon />,
      color: '#2196F3',
      action: () => handleGuestCommunication(),
    },
    {
      id: 'market-analysis',
      name: 'Market Analysis',
      description: 'Comprehensive analysis of local market conditions',
      icon: <AnalyticsIcon />,
      color: '#9C27B0',
      action: () => handleMarketAnalysis(),
    },
  ];

  const handlePropertyOptimization = () => {
    if (!selectedProperty) {
      alert('Please select a property first');
      return;
    }

    const request: PropertyOptimizationRequest = {
      propertyId: selectedProperty,
      currentData: {
        occupancyRate: 75,
        averageRating: 4.5,
        recentBookings: 8,
        competitorPrices: [120, 150, 180, 95, 200],
      },
      goals: ['increase_occupancy', 'improve_rating', 'optimize_pricing'],
    };

    optimizePropertyMutation.mutate(request);
  };

  const handlePricingStrategy = () => {
    if (!selectedProperty || !pricingDates.checkIn || !pricingDates.checkOut) {
      alert('Please select a property and enter dates');
      return;
    }

    const request: PricingRequest = {
      propertyId: selectedProperty,
      checkInDate: pricingDates.checkIn,
      checkOutDate: pricingDates.checkOut,
      guestCount: pricingDates.guests,
      seasonality: 'high',
      localEvents: ['Conference', 'Festival'],
      competitorAnalysis: true,
    };

    pricingStrategyMutation.mutate(request);
  };

  const handleGuestCommunication = () => {
    if (!communicationMessage.trim()) {
      alert('Please enter a guest message');
      return;
    }

    const request: GuestCommunicationRequest = {
      bookingId: selectedProperty || 'demo-booking',
      guestMessage: communicationMessage,
      communicationType: 'inquiry',
      context: {
        property: selectedProperty,
        guestHistory: 'first-time',
      },
    };

    guestCommunicationMutation.mutate(request);
  };

  const handleMarketAnalysis = () => {
    if (!marketLocation.trim()) {
      alert('Please enter a location');
      return;
    }

    const request: MarketAnalysisRequest = {
      location: marketLocation,
      propertyType: 'apartment',
      dateRange: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    marketAnalysisMutation.mutate(request);
  };

  const getCurrentTool = () => aiTools.find(tool => tool.id === selectedTool);
  const isLoading = optimizePropertyMutation.isLoading || 
                   pricingStrategyMutation.isLoading || 
                   guestCommunicationMutation.isLoading || 
                   marketAnalysisMutation.isLoading;

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          AI Agent Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Leverage AI-powered tools to optimize your Airbnb business
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* AI Tools Selection */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                AI Tools
              </Typography>
              <List>
                {aiTools.map((tool) => (
                  <ListItem
                    key={tool.id}
                    button
                    selected={selectedTool === tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: tool.color, width: 32, height: 32 }}>
                        {tool.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={tool.name}
                      secondary={tool.description}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Tool Interface */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: getCurrentTool()?.color, mr: 2 }}>
                  {getCurrentTool()?.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {getCurrentTool()?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getCurrentTool()?.description}
                  </Typography>
                </Box>
              </Box>

              {isLoading && <LinearProgress sx={{ mb: 2 }} />}

              {/* Property Selection (for most tools) */}
              {(selectedTool === 'property-optimization' || selectedTool === 'pricing-strategy') && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select Property</InputLabel>
                  <Select
                    value={selectedProperty}
                    label="Select Property"
                    onChange={(e) => setSelectedProperty(e.target.value)}
                  >
                    {properties.map((property: Property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.title} - ${property.basePrice}/night
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Tool-specific inputs */}
              {selectedTool === 'pricing-strategy' && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Check-in Date"
                      value={pricingDates.checkIn}
                      onChange={(e) => setPricingDates({ ...pricingDates, checkIn: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Check-out Date"
                      value={pricingDates.checkOut}
                      onChange={(e) => setPricingDates({ ...pricingDates, checkOut: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Number of Guests"
                      value={pricingDates.guests}
                      onChange={(e) => setPricingDates({ ...pricingDates, guests: Number(e.target.value) })}
                    />
                  </Grid>
                </Grid>
              )}

              {selectedTool === 'guest-communication' && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Guest Message"
                  placeholder="Enter the guest's message to generate an AI-powered response..."
                  value={communicationMessage}
                  onChange={(e) => setCommunicationMessage(e.target.value)}
                  sx={{ mb: 3 }}
                />
              )}

              {selectedTool === 'market-analysis' && (
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="Enter location (e.g., San Francisco, CA)"
                  value={marketLocation}
                  onChange={(e) => setMarketLocation(e.target.value)}
                  sx={{ mb: 3 }}
                />
              )}

              {/* Action Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<MagicIcon />}
                onClick={getCurrentTool()?.action}
                disabled={isLoading}
                sx={{ minWidth: 200 }}
              >
                {isLoading ? 'Processing...' : `Run ${getCurrentTool()?.name}`}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Results Dialog */}
      <Dialog
        open={openResultDialog}
        onClose={() => setOpenResultDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SuccessIcon color="success" />
            AI Analysis Results
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {currentResult && (
            <Box>
              {/* Property Optimization Results */}
              {selectedTool === 'property-optimization' && currentResult.optimizedTitle && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Optimized Title
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {currentResult.optimizedTitle}
                  </Alert>

                  <Typography variant="h6" gutterBottom>
                    Optimized Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {currentResult.optimizedDescription}
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Recommended Amenities
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {currentResult.recommendedAmenities?.map((amenity: string, index: number) => (
                      <Chip key={index} label={amenity} variant="outlined" />
                    ))}
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Estimated Impact
                  </Typography>
                  <Typography variant="body2">
                    Occupancy Increase: +{currentResult.estimatedImpact?.occupancyIncrease}%
                  </Typography>
                  <Typography variant="body2">
                    Revenue Increase: +{currentResult.estimatedImpact?.revenueIncrease}%
                  </Typography>
                </Box>
              )}

              {/* Pricing Strategy Results */}
              {selectedTool === 'pricing-strategy' && currentResult.recommendedPrice && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Recommended Price
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    ${currentResult.recommendedPrice}/night
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Pricing Factors
                  </Typography>
                  {Object.entries(currentResult.pricingFactors || {}).map(([factor, value]) => (
                    <Typography key={factor} variant="body2">
                      {factor}: {value as string}
                    </Typography>
                  ))}
                </Box>
              )}

              {/* Guest Communication Results */}
              {selectedTool === 'guest-communication' && currentResult.suggestedResponse && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Suggested Response
                  </Typography>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {currentResult.suggestedResponse}
                  </Alert>

                  <Typography variant="h6" gutterBottom>
                    Confidence Score: {Math.round((currentResult.confidenceScore || 0) * 100)}%
                  </Typography>
                </Box>
              )}

              {/* Market Analysis Results */}
              {selectedTool === 'market-analysis' && currentResult.averagePrice && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Market Analysis for {marketLocation}
                  </Typography>
                  <Typography variant="body1">
                    Average Price: ${currentResult.averagePrice}/night
                  </Typography>
                  <Typography variant="body1">
                    Occupancy Rate: {currentResult.occupancyRate}%
                  </Typography>
                  <Typography variant="body1">
                    Competitor Count: {currentResult.competitorCount}
                  </Typography>
                </Box>
              )}

              {/* Confidence Score */}
              {currentResult.confidenceScore && (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    AI Confidence Score: {Math.round(currentResult.confidenceScore * 100)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={currentResult.confidenceScore * 100}
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpenResultDialog(false)}>
            Close
          </Button>
          <Button variant="contained">
            Apply Recommendations
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIAgent;
