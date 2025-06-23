import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import AIAgent from './pages/AIAgent';
import Pricing from './pages/Pricing';
import Guests from './pages/Guests';
import MCPTools from './pages/MCPTools';
import MCPToolsSimple from './pages/MCPToolsSimple';

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar onDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 250px)` },
          minHeight: '100vh',
          backgroundColor: '#f7f7f7',
        }}
      >
        <Toolbar />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/ai-agent" element={<AIAgent />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/analytics" element={<div>Analytics (Coming Soon)</div>} />
          <Route path="/health" element={<div>Services Health (Coming Soon)</div>} />
          <Route path="/mcp" element={<MCPTools />} />
          <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
