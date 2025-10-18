import {
  Notifications
} from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { pageTitles } from "../../constants/pageTitles";

export default function TopBar() {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Mock notifications data
  const notifications = [
    { id: 1, message: "New transaction added", time: "2 minutes ago" },
    { id: 2, message: "Monthly budget alert", time: "1 hour ago" },
    { id: 3, message: "Account balance updated", time: "3 hours ago" },
  ];

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const getCurrentPageTitle = () => {
    const currentPath = window.location.pathname;
    return pageTitles[currentPath] || "Dashboard";
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        color: 'text.primary',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Page Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {getCurrentPageTitle()}
        </Typography>

        {/* Notifications */}
        <IconButton
          size="large"
          aria-label="show notifications"
          color="inherit"
          onClick={handleNotificationMenuOpen}
          sx={{ mr: 1 }}
        >
          <Badge badgeContent={notifications.length} color="error">
            <Notifications />
          </Badge>
        </IconButton>

      </Toolbar>

      {/* Notifications Popover */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>

        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleNotificationMenuClose}
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                py: 2,
                px: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        )}
      </Menu>

    </AppBar>
  );
}
