import { Box, Grid, LinearProgress, Chip } from "@mui/material";
import { Add, Savings, TrendingUp, Warning, CheckCircle } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import ModernCard from "../components/common/ModernCard";

export default function BudgetPage() {
  const budgets = [
    {
      name: "Food & Dining",
      spent: 450,
      limit: 600,
      percentage: 75,
      status: "warning",
      icon: "🍽️",
    },
    {
      name: "Transportation",
      spent: 200,
      limit: 300,
      percentage: 67,
      status: "good",
      icon: "🚗",
    },
    {
      name: "Entertainment",
      spent: 150,
      limit: 200,
      percentage: 75,
      status: "warning",
      icon: "🎬",
    },
    {
      name: "Shopping",
      spent: 80,
      limit: 400,
      percentage: 20,
      status: "good",
      icon: "🛍️",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#667eea';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />;
      case 'warning': return <Warning sx={{ color: '#f59e0b', fontSize: 20 }} />;
      case 'danger': return <Warning sx={{ color: '#ef4444', fontSize: 20 }} />;
      default: return null;
    }
  };

  return (
    <Box>
      <PageHeader 
        title="Budgets" 
        subtitle="Track your spending against budget limits"
        action={() => console.log('Create budget')}
        actionIcon={<Add />}
        actionText="Create Budget"
      />

      <Grid container spacing={3}>
        {budgets.map((budget, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ModernCard
              title={budget.name}
              subtitle={`$${budget.spent} / $${budget.limit}`}
              icon={<Savings />}
              color={getStatusColor(budget.status)}
              onClick={() => console.log('View budget', budget.name)}
            >
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ fontSize: '2rem' }}>{budget.icon}</Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(budget.status)}
                    <Chip
                      label={budget.status === 'good' ? 'On Track' : budget.status === 'warning' ? 'Warning' : 'Over Budget'}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(budget.status)}20`,
                        color: getStatusColor(budget.status),
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={budget.percentage}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getStatusColor(budget.status),
                        borderRadius: 4,
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {budget.percentage}% used
                  </Box>
                  <Box sx={{ 
                    fontSize: '0.875rem', 
                    color: getStatusColor(budget.status),
                    fontWeight: 600
                  }}>
                    ${budget.limit - budget.spent} left
                  </Box>
                </Box>
              </Box>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Budget Overview"
              subtitle="Monthly spending summary"
              icon={<TrendingUp />}
              color="#667eea"
            >
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 3,
                mt: 2
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', mb: 1 }}>
                    $880
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Total Spent
                  </Box>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', mb: 1 }}>
                    $1,500
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Total Budget
                  </Box>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                    59%
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Budget Used
                  </Box>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', mb: 1 }}>
                    $620
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Remaining
                  </Box>
                </Box>
              </Box>
            </ModernCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Budget Tips"
              subtitle="Helpful insights"
              icon={<Savings />}
              color="#10b981"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                  <Box sx={{ fontWeight: 600, mb: 0.5, color: '#10b981' }}>
                    💡 Great job on Shopping budget!
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    You're only using 20% of your shopping budget this month.
                  </Box>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                }}>
                  <Box sx={{ fontWeight: 600, mb: 0.5, color: '#f59e0b' }}>
                    ⚠️ Watch your Food & Dining spending
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    You're at 75% of your budget with 2 weeks left in the month.
                  </Box>
                </Box>
              </Box>
            </ModernCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}