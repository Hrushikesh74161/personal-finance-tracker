import { Box, Typography } from "@mui/material";
import Button from "./Button";

export default function PageHeader({ title, subtitle, action, actionIcon, actionText }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && (
          <Button
            startIcon={actionIcon}
            onClick={action}
            sx={{ 
              borderRadius: 3,
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
              '&:hover': {
                boxShadow: '0 6px 20px 0 rgba(0, 118, 255, 0.5)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {actionText}
          </Button>
        )}
      </Box>
    </Box>
  );
}
