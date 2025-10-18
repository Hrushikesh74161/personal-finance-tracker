import { Box, Grid, Chip, Switch, Avatar } from "@mui/material";
import { Add, Repeat, CreditCard, Home, Phone, Wifi, CalendarToday } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import ModernCard from "../components/common/ModernCard";

export default function RegularPaymentsPage() {
  const regularPayments = [
    {
      name: "Rent Payment",
      amount: 1200,
      frequency: "Monthly",
      nextDue: "2024-02-01",
      icon: <Home />,
      color: "#667eea",
      active: true,
      emoji: "🏠",
      category: "Housing",
    },
    {
      name: "Credit Card Payment",
      amount: 150,
      frequency: "Monthly",
      nextDue: "2024-01-25",
      icon: <CreditCard />,
      color: "#f59e0b",
      active: true,
      emoji: "💳",
      category: "Debt",
    },
    {
      name: "Phone Bill",
      amount: 85,
      frequency: "Monthly",
      nextDue: "2024-01-20",
      icon: <Phone />,
      color: "#3b82f6",
      active: true,
      emoji: "📱",
      category: "Utilities",
    },
    {
      name: "Internet Bill",
      amount: 65,
      frequency: "Monthly",
      nextDue: "2024-01-18",
      icon: <Wifi />,
      color: "#10b981",
      active: false,
      emoji: "🌐",
      category: "Utilities",
    },
  ];

  const getDaysUntilDue = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box>
      <PageHeader 
        title="Regular Payments" 
        subtitle="Manage your recurring payments and subscriptions"
        action={() => console.log('Add payment')}
        actionIcon={<Add />}
        actionText="Add Payment"
      />

      <Grid container spacing={3}>
        {regularPayments.map((payment, index) => {
          const daysUntilDue = getDaysUntilDue(payment.nextDue);
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ModernCard
                title={payment.name}
                subtitle={payment.category}
                icon={payment.icon}
                color={payment.color}
                onClick={() => console.log('View payment', payment.name)}
                sx={{ opacity: payment.active ? 1 : 0.7 }}
              >
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: `${payment.color}20`,
                        color: payment.color,
                        fontSize: '1.5rem',
                      }}
                    >
                      {payment.emoji}
                    </Avatar>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={payment.active}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: payment.color,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: payment.color,
                          },
                        }}
                      />
                      <Chip
                        label={payment.active ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          backgroundColor: payment.active ? `${payment.color}20` : 'rgba(0,0,0,0.1)',
                          color: payment.active ? payment.color : 'text.secondary',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 700, 
                      color: payment.color,
                      mb: 1
                    }}>
                      ${payment.amount}
                    </Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {payment.frequency}
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: daysUntilDue <= 3 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.02)',
                    border: daysUntilDue <= 3 ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                  }}>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      Next due: {payment.nextDue}
                    </Box>
                    <Box sx={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      color: daysUntilDue <= 3 ? '#ef4444' : 'text.secondary',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: daysUntilDue <= 3 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
                    }}>
                      {daysUntilDue <= 0 ? 'Overdue' : `${daysUntilDue} days`}
                    </Box>
                  </Box>
                </Box>
              </ModernCard>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Payment Summary"
              subtitle="Monthly recurring payments overview"
              icon={<Repeat />}
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
                    {regularPayments.filter(p => p.active).length}
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Active Payments
                  </Box>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', mb: 1 }}>
                    ${regularPayments.filter(p => p.active).reduce((sum, p) => sum + p.amount, 0)}
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Monthly Total
                  </Box>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                    {regularPayments.filter(p => p.active && getDaysUntilDue(p.nextDue) <= 3).length}
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Due Soon
                  </Box>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444', mb: 1 }}>
                    {regularPayments.filter(p => p.active && getDaysUntilDue(p.nextDue) <= 0).length}
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Overdue
                  </Box>
                </Box>
              </Box>
            </ModernCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Upcoming Payments"
              subtitle="Next 7 days"
              icon={<CalendarToday />}
              color="#f59e0b"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {regularPayments
                  .filter(p => p.active && getDaysUntilDue(p.nextDue) <= 7)
                  .sort((a, b) => getDaysUntilDue(a.nextDue) - getDaysUntilDue(b.nextDue))
                  .map((payment, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: getDaysUntilDue(payment.nextDue) <= 3 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.02)',
                        border: getDaysUntilDue(payment.nextDue) <= 3 ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                      }}
                    >
                      <Box sx={{ fontSize: '1.5rem', mr: 2 }}>{payment.emoji}</Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {payment.name}
                        </Box>
                        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          Due: {payment.nextDue}
                        </Box>
                      </Box>
                      <Box sx={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 600, 
                        color: payment.color 
                      }}>
                        ${payment.amount}
                      </Box>
                    </Box>
                  ))}
              </Box>
            </ModernCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}