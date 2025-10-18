import {
  AccountBalance,
  AccountBalanceWallet,
  Analytics,
  Category,
  Dashboard,
  Menu,
  Receipt,
  Repeat,
  Savings,
  Settings,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { pageRoutes } from "../../constants/pageRoutes";

const menuItems = [
  {
    text: "Dashboard",
    icon: <Dashboard />,
    path: pageRoutes.HOME_PAGE,
  },
  {
    text: "Accounts",
    icon: <AccountBalance />,
    path: pageRoutes.ACCOUNTS_PAGE,
  },
  {
    text: "Transactions",
    icon: <Receipt />,
    path: pageRoutes.TRANSACTIONS_PAGE,
  },
  {
    text: "Budgets",
    icon: <Savings />,
    path: pageRoutes.BUDGET_PAGE,
  },
  {
    text: "Categories",
    icon: <Category />,
    path: pageRoutes.CATEGORIES_PAGE,
  },
  {
    text: "Reports",
    icon: <Analytics />,
    path: pageRoutes.REPORTS_PAGE,
  },
  {
    text: "Regular Payments",
    icon: <Repeat />,
    path: pageRoutes.REGULAR_PAYMENTS_PAGE,
  },
  {
    text: "Settings",
    icon: <Settings />,
    path: pageRoutes.SETTINGS_PAGE,
  },
];

export default function Sidebar({
  open,
  collapsed,
  onClose,
  onToggle,
  isMobile,
  drawerWidth,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActiveRoute = (path) => {
    if (path === pageRoutes.HOME_PAGE) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          maxHeight: 64,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AccountBalanceWallet sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Finance Tracker
            </Typography>
          </Box>
        )}

        {collapsed && (
          <Tooltip title="Expand sidebar" placement="right">
            <IconButton 
              onClick={onToggle} 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                }
              }}
            >
              <AccountBalanceWallet sx={{ fontSize: 24 }} />
            </IconButton>
          </Tooltip>
        )}

        {!collapsed && !isMobile && (
          <Tooltip title="Collapse sidebar" placement="right">
            <IconButton 
              onClick={onToggle} 
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                }
              }}
            >
              <Menu />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.path);

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              {collapsed ? (
                <Tooltip title={item.text} placement="right">
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      borderRadius: 2,
                      background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      color: isActive ? 'white' : 'text.primary',
                      '&:hover': {
                        background: isActive ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)' : 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateX(4px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        color: isActive ? 'white' : 'text.primary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              ) : (
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    '&:hover': {
                      background: isActive ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)' : 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'white' : 'text.primary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Profile Section */}
      <Box sx={{ p: 2 }}>
        {collapsed ? (
          <Tooltip title="User Profile" placement="right">
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                cursor: 'pointer',
              }}
            >
              U
            </Avatar>
          </Tooltip>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>U</Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, truncate: true }}>
                User Name
              </Typography>
              <Typography variant="caption" color="text.secondary">
                user@example.com
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
