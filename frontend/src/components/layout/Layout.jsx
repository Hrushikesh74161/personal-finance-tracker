import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 64;

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      margin: 0,
      padding: 0,
    }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={handleSidebarClose}
        onToggle={handleSidebarToggle}
        isMobile={isMobile}
        drawerWidth={sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Top Bar */}
        <TopBar
          onMenuClick={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
        />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            padding: 1
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
