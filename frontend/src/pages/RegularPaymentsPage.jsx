import { Box, Grid, Chip, Switch, Avatar, CircularProgress, Alert, IconButton, Menu, MenuItem } from "@mui/material";
import { Add, Repeat, CreditCard, Home, Phone, Wifi, CalendarToday, MoreVert, Edit, Delete, CheckCircle } from "@mui/icons-material";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PageHeader from "../components/common/PageHeader";
import ModernCard from "../components/common/ModernCard";
import RegularPaymentCreateUpdateModal from "../components/modals/RegularPaymentCreateUpdateModal";
import ConfirmationModal from "../components/modals/CofirmationModal";
import { useGetRegularPaymentsQuery } from "../api/useGetRegularPaymentsQuery";
import { useGetRegularPaymentStatsQuery } from "../api/useGetRegularPaymentStatsQuery";
import { useGetUpcomingPaymentsQuery } from "../api/useGetUpcomingPaymentsQuery";
import { useDeleteRegularPaymentMutation } from "../api/useDeleteRegularPaymentMutation";
import { useUpdateNextDueDateMutation } from "../api/useUpdateNextDueDateMutation";
import { useUpdateRegularPaymentMutation } from "../api/useUpdateRegularPaymentMutation";

export default function RegularPaymentsPage() {
  const queryClient = useQueryClient();
  
  // State for modals and actions
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPaymentId, setMenuPaymentId] = useState(null);

  const { data: regularPaymentsData, isLoading: isLoadingPayments, error: paymentsError } = useGetRegularPaymentsQuery({
    filters: { isActive: true }
  });
  
  const { data: statsData, isLoading: isLoadingStats } = useGetRegularPaymentStatsQuery();
  
  const { data: upcomingPaymentsData, isLoading: isLoadingUpcoming } = useGetUpcomingPaymentsQuery(7);

  const regularPayments = regularPaymentsData?.payments || [];
  const stats = statsData || {};
  const upcomingPayments = upcomingPaymentsData || [];

  // Mutations
  const deletePaymentMutation = useDeleteRegularPaymentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['regularPayments']);
      queryClient.invalidateQueries(['regularPaymentStats']);
      queryClient.invalidateQueries(['upcomingPayments']);
    }
  });

  const updateNextDueDateMutation = useUpdateNextDueDateMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['regularPayments']);
      queryClient.invalidateQueries(['regularPaymentStats']);
      queryClient.invalidateQueries(['upcomingPayments']);
    }
  });

  const updatePaymentMutation = useUpdateRegularPaymentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['regularPayments']);
      queryClient.invalidateQueries(['regularPaymentStats']);
      queryClient.invalidateQueries(['upcomingPayments']);
    }
  });

  // Handler functions
  const handleCreatePayment = () => {
    setCreateModalOpen(true);
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
    setAnchorEl(null);
  };

  const handleDeletePayment = (payment) => {
    setSelectedPayment(payment);
    setDeleteModalOpen(true);
    setAnchorEl(null);
  };

  const handleMarkAsPaid = (payment) => {
    updateNextDueDateMutation.mutate(payment._id);
    setAnchorEl(null);
  };

  const handleToggleActive = (payment) => {
    updatePaymentMutation.mutate({
      id: payment._id,
      data: { isActive: !payment.isActive }
    });
  };

  const handleMenuOpen = (event, paymentId) => {
    setAnchorEl(event.currentTarget);
    setMenuPaymentId(paymentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPaymentId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedPayment) {
      deletePaymentMutation.mutate(selectedPayment._id);
      setDeleteModalOpen(false);
      setSelectedPayment(null);
    }
  };

  const getDaysUntilDue = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'weekly': return <Repeat />;
      case 'monthly': return <CalendarToday />;
      case 'quarterly': return <CalendarToday />;
      case 'yearly': return <CalendarToday />;
      default: return <Repeat />;
    }
  };

  const getFrequencyEmoji = (frequency) => {
    switch (frequency) {
      case 'weekly': return '📅';
      case 'monthly': return '📆';
      case 'quarterly': return '🗓️';
      case 'yearly': return '📅';
      default: return '💰';
    }
  };

  if (paymentsError) {
    return (
      <Box>
        <PageHeader 
          title="Regular Payments" 
          subtitle="Manage your recurring payments and subscriptions"
          action={() => console.log('Add payment')}
          actionIcon={<Add />}
          actionText="Add Payment"
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading regular payments: {paymentsError.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="Regular Payments" 
        subtitle="Manage your recurring payments and subscriptions"
        action={handleCreatePayment}
        actionIcon={<Add />}
        actionText="Add Payment"
      />

      {isLoadingPayments ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {regularPayments.map((payment, index) => {
            const daysUntilDue = getDaysUntilDue(payment.nextDueDate);
            const categoryColor = payment.categoryId?.color || "#667eea";
            const categoryName = payment.categoryId?.name || "Unknown";
            const accountName = payment.accountId?.name || "Unknown";
            
            return (
              <Grid item xs={12} sm={6} md={4} key={payment._id || index}>
                <ModernCard
                  title={payment.name}
                  subtitle={`${categoryName} • ${accountName}`}
                  icon={getFrequencyIcon(payment.frequency)}
                  color={categoryColor}
                  onClick={() => console.log('View payment', payment.name)}
                  sx={{ opacity: payment.isActive ? 1 : 0.7 }}
                >
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: `${categoryColor}20`,
                          color: categoryColor,
                          fontSize: '1.5rem',
                        }}
                      >
                        {getFrequencyEmoji(payment.frequency)}
                      </Avatar>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                          checked={payment.isActive}
                          size="small"
                          onChange={() => handleToggleActive(payment)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: categoryColor,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: categoryColor,
                            },
                          }}
                        />
                        <Chip
                          label={payment.isActive ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            backgroundColor: payment.isActive ? `${categoryColor}20` : 'rgba(0,0,0,0.1)',
                            color: payment.isActive ? categoryColor : 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, payment._id)}
                          sx={{ ml: 1 }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: categoryColor,
                        mb: 1
                      }}>
                        ${payment.amount}
                      </Box>
                      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', textTransform: 'capitalize' }}>
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
                        Next due: {new Date(payment.nextDueDate).toLocaleDateString()}
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
      )}

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Payment Summary"
              subtitle="Monthly recurring payments overview"
              icon={<Repeat />}
              color="#667eea"
            >
              {isLoadingStats ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: 3,
                  mt: 2
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', mb: 1 }}>
                      {stats.activePayments || 0}
                    </Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      Active Payments
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', mb: 1 }}>
                      ${(stats.totalMonthlyAmount || 0).toFixed(2)}
                    </Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      Monthly Total
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                      {stats.upcomingPayments || 0}
                    </Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      Due Soon
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444', mb: 1 }}>
                      {stats.overduePayments || 0}
                    </Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      Overdue
                    </Box>
                  </Box>
                </Box>
              )}
            </ModernCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Upcoming Payments"
              subtitle="Next 7 days"
              icon={<CalendarToday />}
              color="#f59e0b"
            >
              {isLoadingUpcoming ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {upcomingPayments.length === 0 ? (
                    <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 2 }}>
                      No upcoming payments in the next 7 days
                    </Box>
                  ) : (
                    upcomingPayments
                      .sort((a, b) => getDaysUntilDue(a.nextDueDate) - getDaysUntilDue(b.nextDueDate))
                      .map((payment, index) => {
                        const daysUntilDue = getDaysUntilDue(payment.nextDueDate);
                        const categoryColor = payment.categoryId?.color || "#667eea";
                        
                        return (
                          <Box
                            key={payment._id || index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: daysUntilDue <= 3 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.02)',
                              border: daysUntilDue <= 3 ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                            }}
                          >
                            <Box sx={{ fontSize: '1.5rem', mr: 2 }}>{getFrequencyEmoji(payment.frequency)}</Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                {payment.name}
                              </Box>
                              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                Due: {new Date(payment.nextDueDate).toLocaleDateString()}
                              </Box>
                            </Box>
                            <Box sx={{ 
                              fontSize: '0.875rem', 
                              fontWeight: 600, 
                              color: categoryColor 
                            }}>
                              ${payment.amount}
                            </Box>
                          </Box>
                        );
                      })
                  )}
                </Box>
              )}
            </ModernCard>
          </Grid>
        </Grid>
      </Box>

      {/* Modals */}
      <RegularPaymentCreateUpdateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries(['regularPayments']);
          queryClient.invalidateQueries(['regularPaymentStats']);
          queryClient.invalidateQueries(['upcomingPayments']);
        }}
      />

      <RegularPaymentCreateUpdateModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        onSuccess={() => {
          queryClient.invalidateQueries(['regularPayments']);
          queryClient.invalidateQueries(['regularPaymentStats']);
          queryClient.invalidateQueries(['upcomingPayments']);
        }}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPayment(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Regular Payment"
        message={`Are you sure you want to delete "${selectedPayment?.name}"?`}
        description="This action cannot be undone. The payment will be permanently removed from your account."
        confirmText="Delete"
        confirmColor="error"
        confirmDisabled={deletePaymentMutation.isPending}
      />

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          const payment = regularPayments.find(p => p._id === menuPaymentId);
          if (payment) handleEditPayment(payment);
        }}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          const payment = regularPayments.find(p => p._id === menuPaymentId);
          if (payment) handleMarkAsPaid(payment);
        }}>
          <CheckCircle fontSize="small" sx={{ mr: 1 }} />
          Mark as Paid
        </MenuItem>
        <MenuItem onClick={() => {
          const payment = regularPayments.find(p => p._id === menuPaymentId);
          if (payment) handleDeletePayment(payment);
        }} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}