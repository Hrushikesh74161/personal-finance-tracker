import { Add, Delete, Edit, TrendingUp, CalendarToday, AttachMoney } from "@mui/icons-material";
import { Box, Chip, Grid, IconButton, Tooltip, Typography, Card, CardContent, LinearProgress } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDeleteBudgetMutation } from "../api/useDeleteBudgetMutation";
import { useGetBudgetsQuery } from "../api/useGetBudgetsQuery";
import { useGetBudgetStatsQuery } from "../api/useGetBudgetStatsQuery";
import { useGetCurrentBudgetsQuery } from "../api/useGetCurrentBudgetsQuery";
import Button from "../components/common/Button";
import ModernCard from "../components/common/ModernCard";
import BudgetCreateUpdateModal from "../components/modals/BudgetCreateUpdateModal";
import ConfirmationModal from "../components/modals/CofirmationModal";

/**
 * Budget page component displaying user's budgets
 * @returns {JSX.Element} The budget page component
 */
export default function BudgetPage() {
  const queryClient = useQueryClient();
  const [budgetCreateUpdateModalOpen, setBudgetCreateUpdateModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteBudgetModalOpen, setDeleteBudgetModalOpen] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState(null);

  // Fetch budgets data
  const { data: budgetsData, isLoading: budgetsLoading, error: budgetsError } = useGetBudgetsQuery();
  const { data: budgetStats, isLoading: statsLoading } = useGetBudgetStatsQuery();
  const { data: currentBudgets, isLoading: currentBudgetsLoading } = useGetCurrentBudgetsQuery();

  // Delete budget mutation
  const deleteBudgetMutation = useDeleteBudgetMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgetStats"] });
      queryClient.invalidateQueries({ queryKey: ["currentBudgets"] });
    },
    onError: (error) => {
      console.error('Failed to delete budget:', error);
    }
  });

  /* Budget create/update modal handlers */
  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setBudgetCreateUpdateModalOpen(true);
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setBudgetCreateUpdateModalOpen(true);
  };

  const handleBudgetCreateUpdateModalClose = () => {
    setBudgetCreateUpdateModalOpen(false);
    setEditingBudget(null);
  };

  const handleBudgetCreateUpdateModalSuccess = () => {
    handleBudgetCreateUpdateModalClose();
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
    queryClient.invalidateQueries({ queryKey: ["budgetStats"] });
    queryClient.invalidateQueries({ queryKey: ["currentBudgets"] });
  };

  /* Delete budget modal handlers */
  const handleDeleteBudget = (budget) => {
    setDeletingBudget(budget);
    setDeleteBudgetModalOpen(true);
  };

  const handleDeleteBudgetModalClose = () => {
    setDeleteBudgetModalOpen(false);
    setDeletingBudget(null);
  };

  const handleDeleteBudgetModalConfirm = () => {
    deleteBudgetMutation.mutate(deletingBudget._id);
    setDeleteBudgetModalOpen(false);
    setDeletingBudget(null);
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
    queryClient.invalidateQueries({ queryKey: ["budgetStats"] });
    queryClient.invalidateQueries({ queryKey: ["currentBudgets"] });
  };

  // Loading state
  if (budgetsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading budgets...</Typography>
      </Box>
    );
  }

  // Error state
  if (budgetsError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography color="error">Failed to load budgets</Typography>
        <Typography color="error">{JSON.stringify(budgetsError?.message)}</Typography>
      </Box>
    );
  }

  const budgets = budgetsData?.budgets || [];
  const stats = budgetStats || {};
  const currentBudgetsList = currentBudgets || [];

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Helper function to get budget status
  const getBudgetStatus = (budget) => {
    const now = new Date();
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);

    if (now < startDate) return { status: 'upcoming', color: 'info' };
    if (now > endDate) return { status: 'expired', color: 'error' };
    return { status: 'active', color: 'success' };
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Budget Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your spending budgets
          </Typography>
        </Box>
        <Button
          startIcon={<Add />}
          onClick={handleAddBudget}
          sx={{ minWidth: 140 }}
        >
          Add Budget
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ModernCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Budgets
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.totalBudgets || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.activeBudgets || 0} active
              </Typography>
            </CardContent>
          </ModernCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <ModernCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Amount
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {formatCurrency(stats.totalBudgetAmount || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all budgets
              </Typography>
            </CardContent>
          </ModernCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <ModernCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Current Budgets
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {currentBudgetsList.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active this period
              </Typography>
            </CardContent>
          </ModernCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <ModernCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Avg. Budget
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {formatCurrency(stats.totalBudgets ? (stats.totalBudgetAmount / stats.totalBudgets) : 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per budget
              </Typography>
            </CardContent>
          </ModernCard>
        </Grid>
      </Grid>

      {/* Budgets List */}
      <ModernCard>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            All Budgets
          </Typography>

          {budgets.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No budgets created yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first budget to start tracking your spending
              </Typography>
              <Button
                startIcon={<Add />}
                onClick={handleAddBudget}
                variant="outlined"
              >
                Create Budget
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {budgets.map((budget) => {
                const budgetStatus = getBudgetStatus(budget);
                return (
                  <Grid item xs={12} sm={6} md={4} key={budget._id}>
                    <Card
                      sx={{
                        height: '100%',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {budget.name}
                            </Typography>
                            <Chip
                              label={budgetStatus.status}
                              color={budgetStatus.color}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Edit Budget">
                              <IconButton
                                size="small"
                                onClick={() => handleEditBudget(budget)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Budget">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteBudget(budget)}
                                color="error"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {formatCurrency(budget.amount)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            per {budget.period}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Category: {budget.categoryId?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Period: {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                          </Typography>
                        </Box>

                        {budget.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {budget.description}
                          </Typography>
                        )}

                        {/* Progress bar for active budgets */}
                        {budgetStatus.status === 'active' && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Progress
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={50} // This would be calculated based on actual spending
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                              50% used
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </ModernCard>

      {/* Modals */}
      <BudgetCreateUpdateModal
        open={budgetCreateUpdateModalOpen}
        onClose={handleBudgetCreateUpdateModalClose}
        budget={editingBudget}
        onSuccess={handleBudgetCreateUpdateModalSuccess}
      />

      <ConfirmationModal
        open={deleteBudgetModalOpen}
        onClose={handleDeleteBudgetModalClose}
        onConfirm={handleDeleteBudgetModalConfirm}
        title="Delete Budget"
        message={`Are you sure you want to delete "${deletingBudget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />
    </Box>
  );
}