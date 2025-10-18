import { Box, Grid } from "@mui/material";
import { Add, AccountBalance, CreditCard, Savings } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import ModernCard from "../components/common/ModernCard";

export default function AccountsPage() {
  const accounts = [
    {
      name: "Checking Account",
      type: "Bank Account",
      balance: "$2,450.00",
      icon: <AccountBalance />,
      color: "#667eea",
      lastTransaction: "2 hours ago",
    },
    {
      name: "Savings Account",
      type: "Savings",
      balance: "$8,750.00",
      icon: <Savings />,
      color: "#10b981",
      lastTransaction: "1 day ago",
    },
    {
      name: "Credit Card",
      type: "Credit",
      balance: "-$1,200.00",
      icon: <CreditCard />,
      color: "#ef4444",
      lastTransaction: "3 hours ago",
    },
  ];

  return (
    <Box>
      <PageHeader 
        title="Accounts" 
        subtitle="Manage your financial accounts"
        action={() => console.log('Add account')}
        actionIcon={<Add />}
        actionText="Add Account"
      />

      <Grid container spacing={3}>
        {accounts.map((account, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ModernCard
              title={account.name}
              subtitle={account.type}
              icon={account.icon}
              color={account.color}
              onClick={() => console.log('View account', account.name)}
            >
              <Box sx={{ mt: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Current Balance
                  </Box>
                  <Box sx={{ 
                    fontSize: '0.75rem', 
                    color: 'text.secondary',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}>
                    {account.lastTransaction}
                  </Box>
                </Box>
                
                <Box sx={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700, 
                  color: account.color,
                  mb: 2
                }}>
                  {account.balance}
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  '& > *': {
                    flex: 1,
                    fontSize: '0.75rem',
                    py: 0.5,
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.05)'
                    }
                  }
                }}>
                  <Box sx={{ color: 'text.secondary' }}>View</Box>
                  <Box sx={{ color: 'text.secondary' }}>Edit</Box>
                  <Box sx={{ color: 'text.secondary' }}>History</Box>
                </Box>
              </Box>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <ModernCard
          title="Account Management"
          subtitle="Overview and insights"
          icon={<AccountBalance />}
          color="#667eea"
        >
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 3,
            mt: 2
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', mb: 1 }}>
                {accounts.length}
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Total Accounts
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', mb: 1 }}>
                $10,000
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Net Worth
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444', mb: 1 }}>
                $1,200
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Total Debt
              </Box>
            </Box>
          </Box>
        </ModernCard>
      </Box>
    </Box>
  );
}