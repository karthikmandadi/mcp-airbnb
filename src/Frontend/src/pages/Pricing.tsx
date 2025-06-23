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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import {
  AttachMoney as PricingIcon,
  TrendingUp as TrendIcon,
  Assessment as AnalyticsIcon,
  Calculate as CalculateIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as GuestIcon,
  DateRange as DateIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import { pricingService, propertyService } from '../services/api';
import { Property, PricingRequest } from '../types';

const Pricing: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [pricingRequest, setPricingRequest] = useState({
    checkInDate: '',
    checkOutDate: '',
    guestCount: 2,
    seasonality: 'normal' as 'low' | 'normal' | 'high',
    localEvents: [] as string[],
    competitorAnalysis: true,
  });
  const [eventInput, setEventInput] = useState('');

  // Fetch properties
  const { data: properties = [] } = useQuery(
    'properties',
    () => propertyService.getProperties(),
    { staleTime: 60000 }
  );

  // Pricing calculation mutation
  const calculatePricingMutation = useMutation(pricingService.calculatePricing);

  // Market analysis query
  const { data: marketAnalysis, refetch: refetchMarketAnalysis } = useQuery(
    ['marketAnalysis', selectedProperty],
    () => {
      const property = properties.find((p: Property) => p.id === selectedProperty);
      return property ? pricingService.getMarketAnalysis(property.address) : null;
    },
    { enabled: !!selectedProperty, staleTime: 300000 }
  );

  const handleCalculatePricing = () => {
    if (!selectedProperty || !pricingRequest.checkInDate || !pricingRequest.checkOutDate) {
      alert('Please select a property and enter dates');
      return;
    }

    const request: PricingRequest = {
      propertyId: selectedProperty,
      checkInDate: pricingRequest.checkInDate,
      checkOutDate: pricingRequest.checkOutDate,
      guestCount: pricingRequest.guestCount,
      seasonality: pricingRequest.seasonality,
      localEvents: pricingRequest.localEvents,
      competitorAnalysis: pricingRequest.competitorAnalysis,
    };

    calculatePricingMutation.mutate(request);
  };

  const handleAddEvent = () => {
    if (eventInput.trim() && !pricingRequest.localEvents.includes(eventInput.trim())) {
      setPricingRequest({
        ...pricingRequest,
        localEvents: [...pricingRequest.localEvents, eventInput.trim()],
      });
      setEventInput('');
    }
  };

  const handleRemoveEvent = (event: string) => {
    setPricingRequest({
      ...pricingRequest,
      localEvents: pricingRequest.localEvents.filter(e => e !== event),
    });
  };

  const selectedPropertyData = properties.find((p: Property) => p.id === selectedProperty);
  const pricingResult = calculatePricingMutation.data;

  // Mock pricing factors for demonstration
  const pricingFactors = [
    { factor: 'Base Price', impact: 'Neutral', weight: '40%', description: 'Your standard nightly rate' },
    { factor: 'Seasonality', impact: pricingRequest.seasonality === 'high' ? 'Positive' : pricingRequest.seasonality === 'low' ? 'Negative' : 'Neutral', weight: '25%', description: 'Seasonal demand adjustments' },
    { factor: 'Local Events', impact: pricingRequest.localEvents.length > 0 ? 'Positive' : 'Neutral', weight: '15%', description: 'Impact of nearby events' },
    { factor: 'Competitor Analysis', impact: 'Positive', weight: '20%', description: 'Market positioning vs competitors' },
  ];

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Dynamic Pricing Engine
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Optimize your pricing strategy with AI-powered market analysis
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Pricing Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} display="flex" alignItems="center">
                <CalculateIcon sx={{ mr: 1 }} />
                Pricing Calculator
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-in Date"
                    value={pricingRequest.checkInDate}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, checkInDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-out Date"
                    value={pricingRequest.checkOutDate}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, checkOutDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Guests"
                    value={pricingRequest.guestCount}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, guestCount: Number(e.target.value) })}
                    inputProps={{ min: 1, max: 20 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Seasonality</InputLabel>
                    <Select
                      value={pricingRequest.seasonality}
                      label="Seasonality"
                      onChange={(e) => setPricingRequest({ ...pricingRequest, seasonality: e.target.value as any })}
                    >
                      <MenuItem value="low">Low Season</MenuItem>
                      <MenuItem value="normal">Normal Season</MenuItem>
                      <MenuItem value="high">High Season</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" gap={1} mb={2}>
                    <TextField
                      fullWidth
                      label="Local Events"
                      placeholder="Add local events that might affect pricing"
                      value={eventInput}
                      onChange={(e) => setEventInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddEvent()}
                    />
                    <Button variant="outlined" onClick={handleAddEvent}>
                      Add
                    </Button>
                  </Box>

                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {pricingRequest.localEvents.map((event, index) => (
                      <Chip
                        key={index}
                        label={event}
                        onDelete={() => handleRemoveEvent(event)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>

              {calculatePricingMutation.isLoading && <LinearProgress sx={{ mt: 2 }} />}

              <Button
                variant="contained"
                size="large"
                startIcon={<CalculateIcon />}
                onClick={handleCalculatePricing}
                disabled={calculatePricingMutation.isLoading || !selectedProperty}
                sx={{ mt: 2, width: '100%' }}
              >
                {calculatePricingMutation.isLoading ? 'Calculating...' : 'Calculate Optimal Price'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing Results */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} display="flex" alignItems="center">
                <PricingIcon sx={{ mr: 1 }} />
                Pricing Recommendation
              </Typography>

              {pricingResult ? (
                <Box>
                  <Box textAlign="center" mb={3}>
                    <Typography variant="h3" color="primary" fontWeight={600}>
                      ${pricingResult.recommendedPrice}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      per night
                    </Typography>
                    <Chip
                      label={`${Math.round(((pricingResult.recommendedPrice - pricingResult.basePrice) / pricingResult.basePrice) * 100)}% vs base price`}
                      color={pricingResult.recommendedPrice > pricingResult.basePrice ? 'success' : 'error'}
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Price Breakdown
                    </Typography>
                    <Typography variant="body2">
                      Base Price: ${pricingResult.basePrice}
                    </Typography>
                    <Typography variant="body2">
                      Dynamic Adjustment: {pricingResult.dynamicAdjustment > 0 ? '+' : ''}${pricingResult.dynamicAdjustment}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Calculated at: {new Date(pricingResult.calculatedAt).toLocaleString()}
                  </Typography>
                </Box>
              ) : selectedPropertyData ? (
                <Box textAlign="center" py={4}>
                  <Avatar sx={{ bgcolor: 'primary.light', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                    <PricingIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    Ready to Calculate
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current base price: ${selectedPropertyData.basePrice}/night
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter dates and preferences to get AI-powered pricing recommendations
                  </Typography>
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">
                    Select a property to see pricing recommendations
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pricing Factors Analysis */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600} display="flex" alignItems="center">
            <AnalyticsIcon sx={{ mr: 1 }} />
            Pricing Factors Analysis
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Factor</strong></TableCell>
                  <TableCell><strong>Impact</strong></TableCell>
                  <TableCell><strong>Weight</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pricingFactors.map((factor, index) => (
                  <TableRow key={index}>
                    <TableCell>{factor.factor}</TableCell>
                    <TableCell>
                      <Chip
                        label={factor.impact}
                        color={
                          factor.impact === 'Positive' ? 'success' :
                          factor.impact === 'Negative' ? 'error' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{factor.weight}</TableCell>
                    <TableCell>{factor.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Market Analysis */}
      {marketAnalysis && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600} display="flex" alignItems="center">
              <TrendIcon sx={{ mr: 1 }} />
              Market Analysis
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} bgcolor="primary.light" borderRadius={2}>
                  <Typography variant="h4" fontWeight={600}>
                    ${marketAnalysis.averagePrice}
                  </Typography>
                  <Typography variant="body2">
                    Average Market Price
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={2}>
                  <Typography variant="h4" fontWeight={600}>
                    {marketAnalysis.occupancyRate}%
                  </Typography>
                  <Typography variant="body2">
                    Market Occupancy Rate
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} bgcolor="info.light" borderRadius={2}>
                  <Typography variant="h4" fontWeight={600}>
                    {marketAnalysis.competitorCount}
                  </Typography>
                  <Typography variant="body2">
                    Nearby Competitors
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={2}>
                  <Typography variant="h4" fontWeight={600}>
                    {marketAnalysis.seasonalTrends?.length || 0}
                  </Typography>
                  <Typography variant="body2">
                    Seasonal Trends
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {marketAnalysis.recommendations && marketAnalysis.recommendations.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Market Recommendations
                </Typography>
                {marketAnalysis.recommendations.map((recommendation: string, index: number) => (
                  <Alert key={index} severity="info" sx={{ mb: 1 }}>
                    {recommendation}
                  </Alert>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Pricing;
