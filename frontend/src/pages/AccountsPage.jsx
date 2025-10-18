import { AccountBalance, Add, CreditCard, Delete, Edit, Savings, SwapHoriz } from "@mui/icons-material";
import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDeleteAccountMutation } from "../api/useDeleteAccountMutation";
import { useGetAccountBalanceSummaryQuery } from "../api/useGetAccountBalanceSummaryQuery";
import { useGetAccountsQuery } from "../api/useGetAccountsQuery";
import Button from "../components/common/Button";
import ModernCard from "../components/common/ModernCard";
import AccountCreateUpdateModal from "../components/modals/AccountCreateUpdateModal";
import ConfirmationModal from "../components/modals/CofirmationModal";

/**
 * Accounts page component displaying user's financial accounts
 * @returns {JSX.Element} The accounts page component
 */
export default function AccountsPage() {
  const queryClient = useQueryClient();
  const [accountCreateUpdateModalOpen, setAccountCreateUpdateModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(null);

  // Fetch accounts data
  const { data: accountsData, isLoading: accountsLoading, error: accountsError } = useGetAccountsQuery();
  const { data: balanceSummary, isLoading: summaryLoading } = useGetAccountBalanceSummaryQuery();

  // Delete account mutation
  const deleteAccountMutation = useDeleteAccountMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["accountBalanceSummary"] });
    },
    onError: (error) => {
      console.error('Failed to delete account:', error);
    }
  });

  // Get account icon based on type
  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking':
        return <AccountBalance />;
      case 'savings':
        return <Savings />;
      case 'creditCard':
        return <CreditCard />;
      default:
        return <AccountBalance />;
    }
  };

  // Get account color based on type
  const getAccountColor = (type) => {
    switch (type) {
      case 'checking':
        return '#667eea';
      case 'savings':
        return '#10b981';
      case 'creditCard':
        return '#ef4444';
      default:
        return '#667eea';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /* Account create/update modal handlers */
  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setAccountCreateUpdateModalOpen(true);
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setAccountCreateUpdateModalOpen(true);
  };

  const handleAccountCreateUpdateModalClose = () => {
    setAccountCreateUpdateModalOpen(false);
    setEditingAccount(null);
  };

  const handleAccountCreateUpdateModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["accountBalanceSummary"] });
    handleAccountCreateUpdateModalClose()
  };

  /* Delete account modal handlers */
  const handleDeleteAccount = (account) => {
    setDeletingAccount(account);
    setDeleteAccountModalOpen(true);
  };

  const handleDeleteAccountModalClose = () => {
    setDeleteAccountModalOpen(false);
    setDeletingAccount(null);
  };

  const handleDeleteAccountModalConfirm = () => {
    deleteAccountMutation.mutate(deletingAccount._id);
    setDeleteAccountModalOpen(false);
    setDeletingAccount(null);
  };

  const handleTransferMoney = () => {
    console.log('Transfer money');
    // TODO: Open transfer dialog
  };

  // Loading state
  if (accountsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading accounts...</Typography>
      </Box>
    );
  }

  // Error state
  if (accountsError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography color="error">Failed to load accounts</Typography>
      </Box>
    );
  }

  const accounts = accountsData?.accounts || [];
  const summary = balanceSummary || {};

  return (
    <Box>
      {/* Page Header - Only subtitle, no title */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>
              Manage your financial accounts
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<SwapHoriz />}
              onClick={handleTransferMoney}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
              }}
            >
              Transfer Money
            </Button>
            <Button
              startIcon={<Add />}
              onClick={handleAddAccount}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
              }}
            >
              Add Account
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Account Management Card - Moved to top */}
      <Box sx={{ mb: 4 }}>
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
                {summary.totalAccounts || accounts.length}
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Total Accounts
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', mb: 1 }}>
                {formatCurrency(summary.netWorth || 0)}
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Net Worth
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444', mb: 1 }}>
                {formatCurrency(summary.totalDebt || 0)}
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Total Debt
              </Box>
            </Box>
          </Box>
        </ModernCard>
      </Box>

      {/* Accounts Grid */}
      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account._id}>
            <ModernCard
              title={account.name}
              subtitle={account.type}
              icon={getAccountIcon(account.type)}
              color={getAccountColor(account.type)}
              sx={{ height: '100%' }} // Make all cards same height
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Account">
                      <IconButton
                        size="small"
                        onClick={() => handleEditAccount(account)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Account">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteAccount(account)}
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

                <Box sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: getAccountColor(account.type),
                  mb: 2
                }}>
                  {formatCurrency(account.balance)}
                </Box>
              </Box>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      {/* Account Create/Update Modal */}
      {accountCreateUpdateModalOpen && (
        <AccountCreateUpdateModal
          open={accountCreateUpdateModalOpen}
          onClose={handleAccountCreateUpdateModalClose}
          account={editingAccount}
          onSuccess={handleAccountCreateUpdateModalSuccess}
        />
      )}

      {/* Delete Account Modal */}
      {deleteAccountModalOpen && (
        <ConfirmationModal
          open={deleteAccountModalOpen}
          onClose={handleDeleteAccountModalClose}
          onConfirm={handleDeleteAccountModalConfirm}
          title="Delete Account"
          message={`Are you sure you want to delete ${deletingAccount?.name}?`}
          description="This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="error"
          cancelColor="secondary"
          confirmDisabled={deleteAccountMutation.isPending}
          cancelDisabled={deleteAccountMutation.isPending}
          showCancel={true}
          size="small"
        />
      )}
    </Box>
  );
}