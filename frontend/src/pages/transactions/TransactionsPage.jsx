import { Box, Grid, Chip, Avatar } from "@mui/material";
import { Add, TrendingUp, TrendingDown, Receipt } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ModernCard from "../../components/common/ModernCard";

export default function TransactionsPage() {
  const transactions = [
    {
      id: 1,
      description: "Grocery Store",
      category: "Food & Dining",
      amount: -85.50,
      date: "2024-01-15",
      type: "expense",
      icon: "🛒",
    },
    {
      id: 2,
      description: "Salary Deposit",
      category: "Income",
      amount: 3000.00,
      date: "2024-01-14",
      type: "income",
      icon: "💰",
    },
    {
      id: 3,
      description: "Gas Station",
      category: "Transportation",
      amount: -45.20,
      date: "2024-01-13",
      type: "expense",
      icon: "⛽",
    },
    {
      id: 4,
      description: "Coffee Shop",
      category: "Food & Dining",
      amount: -12.75,
      date: "2024-01-12",
      type: "expense",
      icon: "☕",
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      "Food & Dining": "#f59e0b",
      "Income": "#10b981",
      "Transportation": "#3b82f6",
      "Entertainment": "#8b5cf6",
      "Shopping": "#ef4444",
    };
    return colors[category] || "#6b7280";
  };

  return (
    <Box>
      <PageHeader 
        title="Transactions" 
        subtitle="Track your income and expenses"
        action={() => console.log('Add transaction')}
        actionIcon={<Add />}
        actionText="Add Transaction"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ModernCard
            title="Recent Transactions"
            subtitle="Your latest financial activity"
            icon={<Receipt />}
            color="#667eea"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {transactions.map((transaction) => (
                <Box
                  key={transaction.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      fontSize: '1.2rem',
                    }}
                  >
                    {transaction.icon}
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ fontWeight: 600, mb: 0.5 }}>
                      {transaction.description}
                    </Box>
                    <Chip
                      label={transaction.category}
                      size="small"
                      sx={{
                        backgroundColor: `${getCategoryColor(transaction.category)}20`,
                        color: getCategoryColor(transaction.category),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ textAlign: 'right', mr: 2 }}>
                    <Box sx={{ 
                      fontWeight: 700,
                      color: transaction.type === 'income' ? '#10b981' : '#ef4444',
                      mb: 0.5
                    }}>
                      {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </Box>
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {transaction.date}
                    </Box>
                  </Box>
                  
                  {transaction.type === 'income' ? (
                    <TrendingUp sx={{ color: '#10b981' }} />
                  ) : (
                    <TrendingDown sx={{ color: '#ef4444' }} />
                  )}
                </Box>
              ))}
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <ModernCard
            title="Transaction Summary"
            subtitle="This month overview"
            icon={<TrendingUp />}
            color="#10b981"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}>
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
                  Total Income
                </Box>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                  $3,000.00
                </Box>
              </Box>
              
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}>
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
                  Total Expenses
                </Box>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>
                  $143.45
                </Box>
              </Box>
              
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }}>
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
                  Net Balance
                </Box>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
                  $2,856.55
                </Box>
              </Box>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>
    </Box>
  );
}