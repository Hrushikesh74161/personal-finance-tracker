import { Box, Grid, Button, Chip } from "@mui/material";
import { Assessment, TrendingUp, PieChart, BarChart, Download, CalendarToday, FilterList } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import ModernCard from "../components/common/ModernCard";

export default function ReportsPage() {
  const reports = [
    {
      title: "Monthly Spending",
      description: "Track your monthly expenses by category",
      icon: <BarChart />,
      color: "#667eea",
      lastUpdated: "2 days ago",
      status: "ready",
    },
    {
      title: "Income vs Expenses",
      description: "Compare your income against expenses",
      icon: <TrendingUp />,
      color: "#10b981",
      lastUpdated: "1 day ago",
      status: "ready",
    },
    {
      title: "Category Breakdown",
      description: "Visual breakdown of spending by category",
      icon: <PieChart />,
      color: "#f59e0b",
      lastUpdated: "3 days ago",
      status: "ready",
    },
    {
      title: "Financial Summary",
      description: "Comprehensive financial overview",
      icon: <Assessment />,
      color: "#8b5cf6",
      lastUpdated: "1 day ago",
      status: "ready",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return '#10b981';
      case 'processing': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Box>
      <PageHeader 
        title="Reports" 
        subtitle="Analyze your financial data with detailed reports"
        action={() => console.log('Export report')}
        actionIcon={<Download />}
        actionText="Export Report"
      />

      <Grid container spacing={3}>
        {reports.map((report, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ModernCard
              title={report.title}
              subtitle={report.description}
              icon={report.icon}
              color={report.color}
              onClick={() => console.log('View report', report.title)}
            >
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    label={report.status}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(report.status)}20`,
                      color: getStatusColor(report.status),
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                    }}
                  />
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {report.lastUpdated}
                  </Box>
                </Box>
                
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: report.color,
                    color: report.color,
                    '&:hover': {
                      backgroundColor: `${report.color}10`,
                      borderColor: report.color,
                    }
                  }}
                >
                  View Report
                </Button>
              </Box>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <ModernCard
              title="Report Center"
              subtitle="Generate and view detailed financial reports"
              icon={<Assessment />}
              color="#667eea"
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: 300,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: 3,
                border: '2px dashed rgba(102, 126, 234, 0.2)',
                mb: 3,
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <BarChart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Box sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}>
                    Interactive charts and graphs will be displayed here
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Select a report above to view detailed analytics
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Date Range
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Filters
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Export PDF
                </Button>
              </Box>
            </ModernCard>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <ModernCard
              title="Quick Stats"
              subtitle="Key financial metrics"
              icon={<TrendingUp />}
              color="#10b981"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
                    Monthly Income
                  </Box>
                  <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                    $5,000.00
                  </Box>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
                    Monthly Expenses
                  </Box>
                  <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>
                    $3,200.00
                  </Box>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
                    Savings Rate
                  </Box>
                  <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
                    36%
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