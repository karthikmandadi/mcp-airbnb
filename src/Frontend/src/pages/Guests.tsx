import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  People as GuestIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Message as MessageIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  BookmarkBorder as BookmarkIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Send as SendIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { guestService, aiAgentService } from '../services/api';
import { Guest, Booking, GuestCommunicationRequest } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Guests: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openGuestDialog, setOpenGuestDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestMessage, setGuestMessage] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [guestFormData, setGuestFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const queryClient = useQueryClient();

  // Mock data since guest service endpoints might not be fully implemented
  const mockGuests: Guest[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '+1-555-0456',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1-555-0789',
      createdAt: new Date().toISOString(),
    },
  ];

  const mockBookings: Booking[] = [
    {
      id: '1',
      propertyId: 'prop1',
      guestId: '1',
      checkInDate: '2024-12-25',
      checkOutDate: '2024-12-30',
      totalPrice: 1250,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      propertyId: 'prop2',
      guestId: '2',
      checkInDate: '2024-12-20',
      checkOutDate: '2024-12-23',
      totalPrice: 750,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ];

  const mockMessages = [
    {
      id: '1',
      guestId: '1',
      message: 'Hi, I have a question about the check-in process. What time can I arrive?',
      type: 'inquiry',
      timestamp: new Date().toISOString(),
      status: 'pending',
    },
    {
      id: '2',
      guestId: '2',
      message: 'The WiFi password is not working. Can you help?',
      type: 'complaint',
      timestamp: new Date().toISOString(),
      status: 'resolved',
    },
  ];

  // AI Communication mutation
  const aiCommunicationMutation = useMutation(aiAgentService.generateGuestResponse, {
    onSuccess: (data) => {
      setAIResponse(data.suggestedResponse);
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenGuestDialog = (guest?: Guest) => {
    if (guest) {
      setSelectedGuest(guest);
      setGuestFormData({
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
      });
    } else {
      setSelectedGuest(null);
      setGuestFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
    }
    setOpenGuestDialog(true);
  };

  const handleCloseGuestDialog = () => {
    setOpenGuestDialog(false);
    setSelectedGuest(null);
  };

  const handleOpenMessageDialog = (guest: Guest, message?: string) => {
    setSelectedGuest(guest);
    setGuestMessage(message || '');
    setAIResponse('');
    setOpenMessageDialog(true);
  };

  const handleGenerateAIResponse = () => {
    if (!selectedGuest || !guestMessage.trim()) return;

    const request: GuestCommunicationRequest = {
      bookingId: 'mock-booking',
      guestMessage: guestMessage,
      communicationType: 'inquiry',
      context: {
        guestName: `${selectedGuest.firstName} ${selectedGuest.lastName}`,
        guestEmail: selectedGuest.email,
      },
    };

    aiCommunicationMutation.mutate(request);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'inquiry': return <MessageIcon />;
      case 'complaint': return <WarningIcon />;
      default: return <MessageIcon />;
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Guest Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your guests, bookings, and communications with AI assistance
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <GuestIcon />
              </Avatar>
              <Typography variant="h4" fontWeight={600}>
                {mockGuests.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Guests
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <BookmarkIcon />
              </Avatar>
              <Typography variant="h4" fontWeight={600}>
                {mockBookings.filter(b => b.status === 'confirmed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confirmed Bookings
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <MessageIcon />
              </Avatar>
              <Typography variant="h4" fontWeight={600}>
                {mockMessages.filter(m => m.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Messages
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <StarIcon />
              </Avatar>
              <Typography variant="h4" fontWeight={600}>
                4.8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Guests" />
            <Tab label="Active Bookings" />
            <Tab label="Messages" />
            <Tab label="Reviews" />
          </Tabs>
        </Box>

        {/* Guests Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>
              Guest Directory
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenGuestDialog()}
            >
              Add Guest
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Guest</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Bookings</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {guest.firstName[0]}{guest.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {guest.firstName} {guest.lastName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{guest.email}</Typography>
                      <Typography variant="body2" color="text.secondary">{guest.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(guest.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${mockBookings.filter(b => b.guestId === guest.id).length} bookings`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenGuestDialog(guest)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Message">
                        <IconButton size="small" onClick={() => handleOpenMessageDialog(guest)}>
                          <MessageIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Bookings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Active Bookings
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Guest</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Check-in</TableCell>
                  <TableCell>Check-out</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockBookings.map((booking) => {
                  const guest = mockGuests.find(g => g.id === booking.guestId);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {guest ? guest.firstName[0] + guest.lastName[0] : 'G'}
                          </Avatar>
                          <Typography variant="body1">
                            {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>Property #{booking.propertyId}</TableCell>
                      <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                      <TableCell>${booking.totalPrice}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Send Message">
                          <IconButton 
                            size="small"
                            onClick={() => guest && handleOpenMessageDialog(guest)}
                          >
                            <MessageIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Messages Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Guest Messages
          </Typography>

          <List>
            {mockMessages.map((message, index) => {
              const guest = mockGuests.find(g => g.id === message.guestId);
              return (
                <React.Fragment key={message.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: message.type === 'complaint' ? 'error.main' : 'primary.main' }}>
                        {getMessageTypeIcon(message.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
                      secondary={
                        <Box>
                          <Typography variant="body2" paragraph>
                            {message.message}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={message.status}
                              size="small"
                              color={message.status === 'resolved' ? 'success' : 'warning'}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(message.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AIIcon />}
                      onClick={() => guest && handleOpenMessageDialog(guest, message.message)}
                    >
                      AI Reply
                    </Button>
                  </ListItem>
                  {index < mockMessages.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </TabPanel>

        {/* Reviews Tab */} 
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Guest Reviews
          </Typography>
          <Alert severity="info">
            Review management feature coming soon. This will display guest reviews and ratings.
          </Alert>
        </TabPanel>
      </Card>

      {/* Guest Form Dialog */}
      <Dialog open={openGuestDialog} onClose={handleCloseGuestDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedGuest ? 'Edit Guest' : 'Add New Guest'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={guestFormData.firstName}
                onChange={(e) => setGuestFormData({ ...guestFormData, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={guestFormData.lastName}
                onChange={(e) => setGuestFormData({ ...guestFormData, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={guestFormData.email}
                onChange={(e) => setGuestFormData({ ...guestFormData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={guestFormData.phone}
                onChange={(e) => setGuestFormData({ ...guestFormData, phone: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGuestDialog}>Cancel</Button>
          <Button variant="contained">
            {selectedGuest ? 'Update' : 'Create'} Guest
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog with AI */}
      <Dialog open={openMessageDialog} onClose={() => setOpenMessageDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AIIcon color="primary" />
            AI-Assisted Guest Communication
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Guest: {selectedGuest ? `${selectedGuest.firstName} ${selectedGuest.lastName}` : ''}
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Guest Message"
            placeholder="Enter the guest's message..."
            value={guestMessage}
            onChange={(e) => setGuestMessage(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="outlined"
            startIcon={<AIIcon />}
            onClick={handleGenerateAIResponse}
            disabled={aiCommunicationMutation.isLoading || !guestMessage.trim()}
            sx={{ mb: 2 }}
          >
            {aiCommunicationMutation.isLoading ? 'Generating...' : 'Generate AI Response'}
          </Button>

          {aiCommunicationMutation.isLoading && <LinearProgress sx={{ mb: 2 }} />}

          {aiResponse && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                AI Suggested Response:
              </Typography>
              {aiResponse}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<SendIcon />} disabled={!aiResponse}>
            Send Response
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Guests;
