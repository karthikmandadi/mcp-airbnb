import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as HealthyIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { ServiceStatus } from '../types';

interface ServiceCardProps {
  name: string;
  status: ServiceStatus;
  onRefresh?: () => void;
  loading?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  status,
  onRefresh,
  loading = false,
}) => {
  const getStatusIcon = () => {
    switch (status.status) {
      case 'healthy':
        return <HealthyIcon color="success" />;
      case 'unhealthy':
        return <ErrorIcon color="error" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'loading':
        return <WarningIcon color="warning" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'healthy':
        return 'success';
      case 'unhealthy':
        return 'error';
      case 'error':
        return 'error';
      case 'loading':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatServiceName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="service-card" sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {getStatusIcon()}
            <Typography variant="h6" component="h3" fontWeight={600}>
              {formatServiceName(name)}
            </Typography>
          </Box>
          
          {onRefresh && (
            <Tooltip title="Refresh status">
              <IconButton
                size="small"
                onClick={onRefresh}
                disabled={loading}
                sx={{ 
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': {
                      transform: 'rotate(0deg)',
                    },
                    '100%': {
                      transform: 'rotate(360deg)',
                    },
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box mb={2}>
          <Chip
            label={status.status.toUpperCase()}
            color={getStatusColor() as any}
            size="small"
            variant={status.status === 'healthy' ? 'filled' : 'outlined'}
          />
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Response Time:</strong> {new Date(status.responseTime).toLocaleTimeString()}
          </Typography>
          
          {status.statusCode && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Status Code:</strong> {status.statusCode}
            </Typography>
          )}
          
          {status.error && (
            <Typography variant="body2" color="error" gutterBottom>
              <strong>Error:</strong> {status.error}
            </Typography>
          )}
        </Box>

        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            Last checked: {new Date(status.responseTime).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
