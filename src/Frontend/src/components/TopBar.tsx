import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { gatewayService } from '../services/api';

interface TopBarProps {
  onDrawerToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { data: servicesStatus } = useQuery(
    'servicesStatus',
    gatewayService.getServicesStatus,
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      staleTime: 25000,
    }
  );

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Calculate system health based on services
  const getSystemHealth = () => {
    if (!servicesStatus?.services) return 'unknown';
    
    const services = Object.values(servicesStatus.services);
    const healthyServices = services.filter(service => service.status === 'healthy').length;
    const totalServices = services.length;
    
    if (healthyServices === totalServices) return 'healthy';
    if (healthyServices / totalServices >= 0.7) return 'warning';
    return 'critical';
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const systemHealth = getSystemHealth();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 250px)` },
        ml: { sm: '250px' },
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
      elevation={0}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Airbnb AI Agent Management
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* System Health Status */}
          <Chip
            label={`System ${systemHealth.toUpperCase()}`}
            color={getHealthColor(systemHealth) as any}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />

          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileClick}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              A
            </Avatar>
          </IconButton>

          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} sx={{ gap: 2 }}>
              <AccountIcon fontSize="small" />
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ gap: 2 }}>
              <SettingsIcon fontSize="small" />
              Settings
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ gap: 2 }}>
              <LogoutIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
