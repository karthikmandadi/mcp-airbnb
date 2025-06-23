import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Avatar,
  CardMedia,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  SmartToy as AIIcon,
  TrendingUp as OptimizeIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { propertyService, aiAgentService } from '../services/api';
import { Property, PropertyFormData } from '../types';

const Properties: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    address: '',
    basePrice: 0,
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    status: 'active',
  });

  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, error } = useQuery(
    'properties',
    () => propertyService.getProperties(),
    {
      staleTime: 60000, // 1 minute
    }
  );

  const createPropertyMutation = useMutation(propertyService.createProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries('properties');
      handleCloseDialog();
    },
  });

  const updatePropertyMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<PropertyFormData> }) =>
      propertyService.updateProperty(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('properties');
        handleCloseDialog();
      },
    }
  );

  const deletePropertyMutation = useMutation(propertyService.deleteProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries('properties');
    },
  });

  const optimizePropertyMutation = useMutation(aiAgentService.optimizeProperty);

  const handleOpenDialog = (property?: Property) => {
    if (property) {
      setSelectedProperty(property);
      setFormData({
        title: property.title,
        description: property.description,
        address: property.address,
        basePrice: property.basePrice,
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenities: property.amenities,
        status: property.status,
      });
    } else {
      setSelectedProperty(null);
      setFormData({
        title: '',
        description: '',
        address: '',
        basePrice: 0,
        maxGuests: 1,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProperty(null);
  };

  const handleSubmit = () => {
    if (selectedProperty) {
      updatePropertyMutation.mutate({ id: selectedProperty.id, data: formData });
    } else {
      createPropertyMutation.mutate(formData);
    }
  };

  const handleOptimizeProperty = (property: Property) => {
    const optimizationRequest = {
      propertyId: property.id,
      currentData: {
        occupancyRate: 75, // Mock data
        averageRating: 4.5,
        recentBookings: 8,
        competitorPrices: [120, 150, 180],
      },
      goals: ['increase_occupancy', 'improve_rating', 'optimize_pricing'],
    };

    optimizePropertyMutation.mutate(optimizationRequest);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  // Mock property images
  const getPropertyImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
    ];
    return images[index % images.length];
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading properties...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error" gutterBottom>
          Error loading properties
        </Typography>
        <Button variant="outlined" onClick={() => queryClient.invalidateQueries('properties')}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            Property Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your Airbnb properties with AI-powered insights
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Property
        </Button>
      </Box>

      <Grid container spacing={3}>
        {properties.map((property, index) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <Card className="property-card">
              <CardMedia
                component="img"
                height="200"
                image={getPropertyImage(index)}
                alt={property.title}
              />
              
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                  <Typography variant="h6" component="h3" fontWeight={600}>
                    {property.title}
                  </Typography>
                  <Chip
                    label={property.status}
                    color={getStatusColor(property.status) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {property.address}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {property.bedrooms} bed • {property.bathrooms} bath • {property.maxGuests} guests
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    ${property.basePrice}/night
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                      ★
                    </Avatar>
                    <Typography variant="body2">4.8</Typography>
                  </Box>
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Property">
                    <IconButton size="small" onClick={() => handleOpenDialog(property)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Property">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deletePropertyMutation.mutate(property.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<OptimizeIcon />}
                  onClick={() => handleOptimizeProperty(property)}
                  disabled={optimizePropertyMutation.isLoading}
                >
                  AI Optimize
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Property Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProperty ? 'Edit Property' : 'Add New Property'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Base Price per Night"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Guests"
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Bedrooms"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Bathrooms"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createPropertyMutation.isLoading || updatePropertyMutation.isLoading}
          >
            {selectedProperty ? 'Update' : 'Create'} Property
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Optimization Result */}
      {optimizePropertyMutation.data && (
        <Dialog
          open={!!optimizePropertyMutation.data}
          onClose={() => optimizePropertyMutation.reset()}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <AIIcon color="primary" />
              AI Property Optimization Results
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              Optimized Title: {optimizePropertyMutation.data.optimizedTitle}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {optimizePropertyMutation.data.optimizedDescription}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Recommended Amenities:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              {optimizePropertyMutation.data.recommendedAmenities.map((amenity, index) => (
                <Chip key={index} label={amenity} variant="outlined" />
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Estimated Impact:
            </Typography>
            <Typography variant="body2">
              Occupancy Increase: +{optimizePropertyMutation.data.estimatedImpact.occupancyIncrease}%
            </Typography>
            <Typography variant="body2">
              Revenue Increase: +{optimizePropertyMutation.data.estimatedImpact.revenueIncrease}%
            </Typography>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => optimizePropertyMutation.reset()}>
              Close
            </Button>
            <Button variant="contained">
              Apply Recommendations
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Properties;
