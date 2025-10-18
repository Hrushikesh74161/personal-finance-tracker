import { Box, Grid, Switch, FormControlLabel, Divider, Avatar, Typography } from "@mui/material";
import Button from "../components/common/Button";
import { Person, Notifications, Security, Palette, Language, Help, Edit, Logout } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import ModernCard from "../components/common/ModernCard";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Profile Settings",
      icon: <Person />,
      color: "#667eea",
      settings: [
        { label: "Email Notifications", type: "switch", value: true },
        { label: "Profile Visibility", type: "switch", value: false },
      ],
    },
    {
      title: "Notifications",
      icon: <Notifications />,
      color: "#10b981",
      settings: [
        { label: "Transaction Alerts", type: "switch", value: true },
        { label: "Budget Warnings", type: "switch", value: true },
        { label: "Weekly Reports", type: "switch", value: false },
      ],
    },
    {
      title: "Security",
      icon: <Security />,
      color: "#f59e0b",
      settings: [
        { label: "Two-Factor Authentication", type: "switch", value: false },
        { label: "Login Notifications", type: "switch", value: true },
      ],
    },
    {
      title: "Appearance",
      icon: <Palette />,
      color: "#8b5cf6",
      settings: [
        { label: "Dark Mode", type: "switch", value: false },
        { label: "Compact View", type: "switch", value: true },
      ],
    },
  ];

  return (
    <Box>
      <PageHeader 
        title="Settings" 
        subtitle="Customize your experience and manage your account"
      />

      {/* Profile Section */}
      <Box sx={{ mb: 4 }}>
        <ModernCard
          title="Profile Information"
          subtitle="Manage your personal details"
          icon={<Person />}
          color="#667eea"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#667eea', fontSize: '2rem' }}>
              U
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
                User Name
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                user@example.com
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Edit />}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </ModernCard>
      </Box>

      {/* Settings Sections */}
      <Grid container spacing={3}>
        {settingsSections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <ModernCard
              title={section.title}
              icon={section.icon}
              color={section.color}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.settings.map((setting, settingIndex) => (
                  <Box key={settingIndex}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={setting.value}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: section.color,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: section.color,
                            },
                          }}
                        />
                      }
                      label={setting.label}
                      sx={{ 
                        width: '100%', 
                        justifyContent: 'space-between', 
                        m: 0,
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 500,
                        }
                      }}
                    />
                    {settingIndex < section.settings.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      {/* Additional Settings */}
      <Box sx={{ mt: 4 }}>
        <ModernCard
          title="Additional Settings"
          subtitle="More options and support"
          icon={<Language />}
          color="#06b6d4"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<Help />}
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start',
                  py: 1.5,
                }}
              >
                Help & Support
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<Security />}
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start',
                  py: 1.5,
                }}
              >
                Privacy Policy
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start',
                  py: 1.5,
                }}
              >
                Terms of Service
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<Logout />}
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start',
                  py: 1.5,
                  color: '#ef4444',
                  borderColor: '#ef4444',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: '#ef4444',
                  }
                }}
              >
                Sign Out
              </Button>
            </Grid>
          </Grid>
        </ModernCard>
      </Box>

      {/* App Information */}
      <Box sx={{ mt: 4 }}>
        <ModernCard
          title="Application Information"
          subtitle="Version and system details"
          icon={<Palette />}
          color="#6b7280"
        >
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 3,
            mt: 2
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea', mb: 1 }}>
                v1.0.0
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                App Version
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', mb: 1 }}>
                2024
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Release Year
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                React
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Framework
              </Box>
            </Box>
          </Box>
        </ModernCard>
      </Box>
    </Box>
  );
}