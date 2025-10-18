import { Box, Grid, Chip, Avatar } from "@mui/material";
import { Add, Restaurant, DirectionsCar, ShoppingCart, Home, LocalHospital, School, SportsEsports, Category } from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import ModernCard from "../components/common/ModernCard";

export default function CategoriesPage() {
  const categories = [
    {
      name: "Food & Dining",
      icon: <Restaurant />,
      color: "#f59e0b",
      transactionCount: 45,
      emoji: "🍽️",
      totalSpent: "$1,250.00",
    },
    {
      name: "Transportation",
      icon: <DirectionsCar />,
      color: "#3b82f6",
      transactionCount: 23,
      emoji: "🚗",
      totalSpent: "$450.00",
    },
    {
      name: "Shopping",
      icon: <ShoppingCart />,
      color: "#ef4444",
      transactionCount: 18,
      emoji: "🛍️",
      totalSpent: "$800.00",
    },
    {
      name: "Housing",
      icon: <Home />,
      color: "#10b981",
      transactionCount: 12,
      emoji: "🏠",
      totalSpent: "$1,200.00",
    },
    {
      name: "Healthcare",
      icon: <LocalHospital />,
      color: "#8b5cf6",
      transactionCount: 8,
      emoji: "🏥",
      totalSpent: "$300.00",
    },
    {
      name: "Education",
      icon: <School />,
      color: "#06b6d4",
      transactionCount: 5,
      emoji: "📚",
      totalSpent: "$150.00",
    },
    {
      name: "Entertainment",
      icon: <SportsEsports />,
      color: "#ec4899",
      transactionCount: 15,
      emoji: "🎬",
      totalSpent: "$200.00",
    },
  ];

  return (
    <Box>
      <PageHeader 
        title="Categories" 
        subtitle="Organize your transactions by category"
        action={() => console.log('Add category')}
        actionIcon={<Add />}
        actionText="Add Category"
      />

      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ModernCard
              title={category.name}
              subtitle={`${category.transactionCount} transactions`}
              icon={category.icon}
              color={category.color}
              onClick={() => console.log('View category', category.name)}
            >
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                      fontSize: '1.5rem',
                    }}
                  >
                    {category.emoji}
                  </Avatar>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 700, 
                      color: category.color,
                      mb: 0.5
                    }}>
                      {category.totalSpent}
                    </Box>
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Total Spent
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    Transactions
                  </Box>
                  <Chip
                    label={category.transactionCount}
                    size="small"
                    sx={{
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
              </Box>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ModernCard
              title="Category Overview"
              subtitle="Spending breakdown by category"
              icon={<Category />}
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
                  <Category sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Box sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Category spending chart will appear here
                  </Box>
                </Box>
              </Box>
            </ModernCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ModernCard
              title="Top Categories"
              subtitle="Your highest spending categories"
              icon={<Category />}
              color="#f59e0b"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {categories.slice(0, 5).map((category, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box sx={{ fontSize: '1.5rem', mr: 2 }}>{category.emoji}</Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {category.name}
                      </Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {category.transactionCount} transactions
                      </Box>
                    </Box>
                    <Box sx={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      color: category.color 
                    }}>
                      {category.totalSpent}
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