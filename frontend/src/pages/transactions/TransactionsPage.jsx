import { Add, Delete, Edit, Receipt, TrendingDown, TrendingUp } from "@mui/icons-material";
import { Avatar, Box, Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDeleteTransactionMutation } from "../../api/useDeleteTransactionMutation";
import { useGetTransactionsQuery } from "../../api/useGetTransactionsQuery";
import { useGetCategoriesQuery } from "../../api/useGetCategoriesQuery";
import ModernCard from "../../components/common/ModernCard";
import Button from "../../components/common/Button";
import ConfirmationModal from "../../components/modals/CofirmationModal";
import TransactionCreateUpdateModal from "../../components/modals/TransactionCreateUpdateModal";

/**
 * Transactions page component displaying user's financial transactions
 * @returns {JSX.Element} The transactions page component
 */
export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const [transactionCreateUpdateModalOpen, setTransactionCreateUpdateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteTransactionModalOpen, setDeleteTransactionModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' or categoryId

  // Fetch categories for filtering
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  // Fetch transactions data with filter
  const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useGetTransactionsQuery({
    type: filterType === 'all' ? undefined : filterType,
    categoryId: filterCategory === 'all' ? undefined : filterCategory,
    limit: 50, // Get more transactions for better overview
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useDeleteTransactionMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["accountBalanceSummary"] });
    },
    onError: (error) => {
      console.error('Failed to delete transaction:', error);
    }
  });

  const getCategoryColor = (category) => {
    return category?.color || "#6b7280";
  };

  // Get transaction icon based on category
  const getTransactionIcon = (category) => {
    // Use category icon if available, otherwise use a default
    if (category?.icon) {
      // Map common icon names to emojis
      const iconMap = {
        "restaurant": "🍽️",
        "shopping": "🛍️",
        "car": "🚗",
        "home": "🏠",
        "health": "🏥",
        "entertainment": "🎬",
        "education": "📚",
        "travel": "✈️",
        "gift": "🎁",
        "category": "📝",
      };
      return iconMap[category.icon] || "💳";
    }
    return "💳";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /* Transaction create/update modal handlers */
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionCreateUpdateModalOpen(true);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setTransactionCreateUpdateModalOpen(true);
  };

  const handleTransactionCreateUpdateModalClose = () => {
    setTransactionCreateUpdateModalOpen(false);
    setEditingTransaction(null);
  };

  const handleTransactionCreateUpdateModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["accountBalanceSummary"] });
    handleTransactionCreateUpdateModalClose();
  };

  /* Delete transaction modal handlers */
  const handleDeleteTransaction = (transaction) => {
    setDeletingTransaction(transaction);
    setDeleteTransactionModalOpen(true);
  };

  const handleDeleteTransactionModalClose = () => {
    setDeleteTransactionModalOpen(false);
    setDeletingTransaction(null);
  };

  const handleDeleteTransactionModalConfirm = () => {
    deleteTransactionMutation.mutate(deletingTransaction._id);
    setDeleteTransactionModalOpen(false);
    setDeletingTransaction(null);
  };

  // Filter handlers
  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const handleCategoryFilterChange = (categoryId) => {
    setFilterCategory(categoryId);
  };

  // Calculate summary data
  const calculateSummary = () => {
    if (!transactionsData?.transactions) {
      return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    }

    const transactions = transactionsData.transactions;
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const netBalance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, netBalance };
  };

  // Loading state
  if (transactionsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading transactions...</Typography>
      </Box>
    );
  }

  // Error state
  if (transactionsError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography color="error">Failed to load transactions</Typography>
      </Box>
    );
  }

  const transactions = transactionsData?.transactions || [];
  const summary = calculateSummary();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>
              View all your transactions
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<Add />}
              onClick={handleAddTransaction}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
              }}
            >
              Add transaction
            </Button>
          </Box>
        </Box>

        {/* Filter buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          {/* Transaction Type Filters */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={filterType === 'all' ? 'contained' : 'outlined'}
              onClick={() => handleFilterChange('all')}
              size="small"
            >
              All Types
            </Button>
            <Button
              variant={filterType === 'income' ? 'contained' : 'outlined'}
              onClick={() => handleFilterChange('income')}
              size="small"
              sx={{ color: filterType === 'income' ? 'white' : '#10b981' }}
            >
              Income
            </Button>
            <Button
              variant={filterType === 'expense' ? 'contained' : 'outlined'}
              onClick={() => handleFilterChange('expense')}
              size="small"
              sx={{ color: filterType === 'expense' ? 'white' : '#ef4444' }}
            >
              Expenses
            </Button>
          </Box>

          {/* Category Filters */}
          {categories.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant={filterCategory === 'all' ? 'contained' : 'outlined'}
                onClick={() => handleCategoryFilterChange('all')}
                size="small"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category._id}
                  variant={filterCategory === category._id ? 'contained' : 'outlined'}
                  onClick={() => handleCategoryFilterChange(category._id)}
                  size="small"
                  sx={{
                    color: filterCategory === category._id ? 'white' : category.color || '#6b7280',
                    borderColor: category.color || '#6b7280',
                    '&:hover': {
                      backgroundColor: filterCategory === category._id 
                        ? undefined 
                        : `${category.color || '#6b7280'}20`,
                    }
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ModernCard
            title="Recent Transactions"
            subtitle="Your latest financial activity"
            icon={<Receipt />}
            color="#667eea"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {transactions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No transactions found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {filterType === 'all' && filterCategory === 'all'
                      ? 'Start by adding your first transaction' 
                      : `No transactions found for the selected filters`
                    }
                  </Typography>
                </Box>
              ) : (
                transactions.map((transaction) => (
                  <Box
                    key={transaction._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease',
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
                      {getTransactionIcon(transaction.categoryId)}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ fontWeight: 600, mb: 0.5 }}>
                        {transaction.description}
                      </Box>
                      <Chip
                        label={transaction.categoryId?.name || 'Unknown Category'}
                        size="small"
                        sx={{
                          backgroundColor: `${getCategoryColor(transaction.categoryId)}20`,
                          color: getCategoryColor(transaction.categoryId),
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>

                    <Box sx={{ textAlign: 'right', mr: 2 }}>
                      <Box sx={{
                        fontWeight: 700,
                        color: transaction.type === 'income' ? '#10b981' : transaction.type === 'expense' ? '#ef4444' : '#667eea',
                        mb: 0.5
                      }}>
                        {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {formatDate(transaction.date)}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {transaction.type === 'income' ? (
                        <TrendingUp sx={{ color: '#10b981' }} />
                      ) : transaction.type === 'expense' ? (
                        <TrendingDown sx={{ color: '#ef4444' }} />
                      ) : (
                        <TrendingUp sx={{ color: '#667eea' }} />
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit Transaction">
                          <IconButton
                            size="small"
                            onClick={() => handleEditTransaction(transaction)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'primary.main' }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Transaction">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteTransaction(transaction)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'error.main' }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
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
                  {formatCurrency(summary.totalIncome)}
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
                  {formatCurrency(summary.totalExpenses)}
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
                <Box sx={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700, 
                  color: summary.netBalance >= 0 ? '#10b981' : '#ef4444' 
                }}>
                  {formatCurrency(summary.netBalance)}
                </Box>
              </Box>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>

      {/* Transaction Create/Update Modal */}
      {transactionCreateUpdateModalOpen && (
        <TransactionCreateUpdateModal
          open={transactionCreateUpdateModalOpen}
          onClose={handleTransactionCreateUpdateModalClose}
          transaction={editingTransaction}
          onSuccess={handleTransactionCreateUpdateModalSuccess}
        />
      )}

      {/* Delete Transaction Modal */}
      {deleteTransactionModalOpen && (
        <ConfirmationModal
          open={deleteTransactionModalOpen}
          onClose={handleDeleteTransactionModalClose}
          onConfirm={handleDeleteTransactionModalConfirm}
          title="Delete Transaction"
          message={`Are you sure you want to delete "${deletingTransaction?.description}"?`}
          description="This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="error"
          cancelColor="secondary"
          confirmDisabled={deleteTransactionMutation.isPending}
          cancelDisabled={deleteTransactionMutation.isPending}
          showCancel={true}
          size="small"
        />
      )}
    </Box>
  );
}