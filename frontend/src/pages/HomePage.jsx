import { Box, Grid } from "@mui/material";
import { AccountBalance, TrendingUp, Receipt, Savings, TrendingDown } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import ModernCard from "../components/common/ModernCard";

export default function HomePage() {
  const stats = [
    {
      title: "Total Balance",
      value: "$12,345.67",
      icon: <AccountBalance />,
      color: "#667eea",
      trend: 5.2,
      subtitle: "vs last month",
    },
    {
      title: "Monthly Income",
      value: "$5,000.00",
      icon: <TrendingUp />,
      color: "#10b981",
      trend: 12.5,
      subtitle: "vs last month",
    },
    {
      title: "Monthly Expenses",
      value: "$3,200.00",
      icon: <Receipt />,
      color: "#ef4444",
      trend: -3.1,
      subtitle: "vs last month",
    },
    {
      title: "Savings Rate",
      value: "36%",
      icon: <Savings />,
      color: "#8b5cf6",
      trend: 8.7,
      subtitle: "of income",
    },
  ];

  return (
    <Box>
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's your financial overview"
      />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ModernCard
            title="Recent Transactions"
            subtitle="Your latest financial activity"
            icon={<Receipt />}
            color="#667eea"
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: 200,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: 3,
              border: '2px dashed rgba(102, 126, 234, 0.2)',
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Box sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Transaction chart will appear here
                </Box>
              </Box>
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <ModernCard
            title="Quick Actions"
            subtitle="Common tasks"
            icon={<TrendingUp />}
            color="#10b981"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.15)' }
              }}>
                <Box sx={{ fontWeight: 600, mb: 0.5 }}>Add Transaction</Box>
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Record income or expense</Box>
              </Box>
              
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.15)' }
              }}>
                <Box sx={{ fontWeight: 600, mb: 0.5 }}>View Reports</Box>
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Analyze your spending</Box>
              </Box>
              
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.15)' }
              }}>
                <Box sx={{ fontWeight: 600, mb: 0.5 }}>Set Budget</Box>
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Create spending limits</Box>
              </Box>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>
    </Box>
  );
}