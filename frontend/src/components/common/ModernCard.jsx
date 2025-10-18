import { Card, CardContent, Box, Typography } from "@mui/material";

export default function ModernCard({ 
  title, 
  subtitle, 
  icon, 
  color = "primary.main", 
  children,
  onClick,
  sx = {} 
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 4,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px -8px ${color}30`,
          border: `1px solid ${color}40`,
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {(title || icon) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: children ? 2 : 0 }}>
            {icon && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                  color: color,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </Box>
            )}
            <Box sx={{ flexGrow: 1 }}>
              {title && (
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
