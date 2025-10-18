import { Card, CardContent, Box, Typography } from "@mui/material";

export default function StatCard({ 
  title, 
  value, 
  icon, 
  color = "primary.main", 
  trend, 
  subtitle,
  onClick 
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 4,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px -12px ${color}40`,
          border: `1px solid ${color}60`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: trend > 0 ? 'success.main' : 'error.main',
                fontWeight: 600,
                px: 1,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: trend > 0 ? 'success.main20' : 'error.main20',
              }}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </Typography>
          )}
        </Box>
        
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 0.5, color: color }}>
          {value}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
