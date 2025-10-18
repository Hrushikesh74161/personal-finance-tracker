import { Box, Stack, Typography } from "@mui/material";
import { Formik } from 'formik';
import PropTypes from "prop-types";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useCreateTransactionMutation } from "../../api/useCreateTransactionMutation";
import { useGetAccountsQuery } from "../../api/useGetAccountsQuery";
import { useUpdateTransactionMutation } from "../../api/useUpdateTransactionMutation";
import { showToast } from "../../redux/slices/toastSlice";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Select from "../form/Select";
import TextField from "../form/TextField";

/**
 * Transaction types configuration
 */
const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
];

/**
 * Transaction categories configuration
 */
const TRANSACTION_CATEGORIES = [
  { value: 'Food & Dining', label: 'Food & Dining' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Bills & Utilities', label: 'Bills & Utilities' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Income', label: 'Income' },
  { value: 'Transfer', label: 'Transfer' },
  { value: 'Other', label: 'Other' },
];

/**
 * Validation schema for transaction form
 */
const validationSchema = Yup.object().shape({
  type: Yup.string()
    .required("Transaction type is required")
    .oneOf(['income', 'expense', 'transfer'], "Please select a valid transaction type"),

  category: Yup.string()
    .required("Category is required")
    .min(1, "Category must be at least 1 character")
    .max(100, "Category must not exceed 100 characters"),

  amount: Yup.number()
    .typeError("Amount must be a valid number")
    .required("Amount is required")
    .min(0.01, "Amount must be greater than 0"),

  description: Yup.string()
    .required("Description is required")
    .min(1, "Description must be at least 1 character")
    .max(500, "Description must not exceed 500 characters"),

  date: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),

  accountId: Yup.string()
    .required("Account is required"),

  transferToAccountId: Yup.string()
    .when('type', {
      is: 'transfer',
      then: (schema) => schema.required("Transfer destination account is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

/**
 * Transaction Create/Update Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} [props.transaction] - Transaction data for editing (null for create)
 * @param {Function} [props.onSuccess] - Success callback
 */
export default function TransactionCreateUpdateModal({
  open,
  onClose,
  transaction = null,
  onSuccess,
}) {
  const formikRef = useRef(null);
  const isEditMode = Boolean(transaction);
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("loginInfo"))?.user;

  // Fetch accounts for dropdown
  const { data: accountsData } = useGetAccountsQuery();
  const accounts = accountsData?.accounts || [];

  // Create account options for dropdown
  const accountOptions = accounts.map(account => ({
    value: account._id,
    label: `${account.name} (${account.type})`
  }));

  // Create account options excluding the selected account for transfer destination
  const getTransferAccountOptions = (selectedAccountId) => {
    return accounts
      .filter(account => account._id !== selectedAccountId)
      .map(account => ({
        value: account._id,
        label: `${account.name} (${account.type})`
      }));
  };

  // Create transaction mutation
  const createTransactionMutation = useCreateTransactionMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Transaction created successfully", type: "success" }));
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create transaction. Please try again.";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  });

  // Update transaction mutation
  const updateTransactionMutation = useUpdateTransactionMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Transaction updated successfully", type: "success" }));
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update transaction. Please try again.";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  });

  // Initial form values
  const initialValues = {
    type: transaction?.type || '',
    category: transaction?.category || '',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    accountId: transaction?.accountId || '',
    transferToAccountId: transaction?.transferToAccountId || '',
  };

  // Handle form submission
  const handleSubmit = (values) => {
    const transactionData = {
      ...values,
      userId: user._id,
      date: new Date(values.date).toISOString(),
    };

    if (isEditMode) {
      updateTransactionMutation.mutate({
        transactionId: transaction._id,
        updateData: transactionData,
      });
    } else {
      createTransactionMutation.mutate(transactionData);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
    onClose();
  };

  const isLoading = createTransactionMutation.isPending || updateTransactionMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? `Edit Transaction` : 'Create New Transaction'}
      subTitle={isEditMode ? 'Update transaction information' : 'Add a new transaction to track your money'}
      size="medium"
      showCloseIcon={false}
      actions={[
        <Button
          key="cancel"
          variant="outlined"
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="submit"
          form="transaction-form"
          disabled={isLoading}
          onClick={handleSubmit}
          sx={{ minWidth: 120 }}
        >
          {isLoading
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Transaction' : 'Create Transaction')
          }
        </Button>,
      ]}
    >
      <Formik
        innerRef={formikRef}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        initialValues={initialValues}
      >
        {({ handleSubmit, values, errors, touched, handleChange, setFieldValue }) => (
          <Box component="form" id="transaction-form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Transaction Type */}
              <Select
                required
                label="Transaction Type"
                name="type"
                value={values.type}
                onChange={(e) => setFieldValue('type', e.target.value)}
                error={Boolean(touched.type && errors.type)}
                errorText={touched.type && errors.type}
                helperText="Select the type of transaction"
                options={TRANSACTION_TYPES}
              />

              {/* Category */}
              <Select
                required
                label="Category"
                name="category"
                value={values.category}
                onChange={(e) => setFieldValue('category', e.target.value)}
                error={Boolean(touched.category && errors.category)}
                errorText={touched.category && errors.category}
                helperText="Select or enter a category for this transaction"
                options={TRANSACTION_CATEGORIES}
                allowCustom
              />

              {/* Amount */}
              <TextField
                required
                label="Amount"
                name="amount"
                type="number"
                placeholder="0.00"
                value={values.amount}
                onChange={handleChange}
                error={Boolean(touched.amount && errors.amount)}
                errorText={touched.amount && errors.amount}
                helperText="Enter the transaction amount"
                inputProps={{
                  step: "0.01",
                  min: "0.01"
                }}
              />

              {/* Description */}
              <TextField
                required
                label="Description"
                name="description"
                placeholder="Enter transaction description"
                value={values.description}
                onChange={handleChange}
                error={Boolean(touched.description && errors.description)}
                errorText={touched.description && errors.description}
                helperText="Describe what this transaction is for"
                multiline
                rows={2}
                characterLimit={500}
              />

              {/* Date */}
              <TextField
                required
                label="Date"
                name="date"
                type="date"
                value={values.date}
                onChange={handleChange}
                error={Boolean(touched.date && errors.date)}
                errorText={touched.date && errors.date}
                helperText="Select the date of this transaction"
              />

              {/* Account */}
              <Select
                required
                label="Account"
                name="accountId"
                value={values.accountId}
                onChange={(e) => setFieldValue('accountId', e.target.value)}
                error={Boolean(touched.accountId && errors.accountId)}
                errorText={touched.accountId && errors.accountId}
                helperText="Select the account for this transaction"
                options={accountOptions}
              />

              {/* Transfer Destination Account (only for transfer type) */}
              {values.type === 'transfer' && (
                <Select
                  required
                  label="Transfer To Account"
                  name="transferToAccountId"
                  value={values.transferToAccountId}
                  onChange={(e) => setFieldValue('transferToAccountId', e.target.value)}
                  error={Boolean(touched.transferToAccountId && errors.transferToAccountId)}
                  errorText={touched.transferToAccountId && errors.transferToAccountId}
                  helperText="Select the destination account for the transfer"
                  options={getTransferAccountOptions(values.accountId)}
                />
              )}

              {/* Transaction Type Info */}
              {values.type && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: values.type === 'income'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : values.type === 'expense'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(102, 126, 234, 0.1)',
                    border: values.type === 'income'
                      ? '1px solid rgba(16, 185, 129, 0.2)'
                      : values.type === 'expense'
                        ? '1px solid rgba(239, 68, 68, 0.2)'
                        : '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                    {values.type === 'income' && 'Income Transaction:'}
                    {values.type === 'expense' && 'Expense Transaction:'}
                    {values.type === 'transfer' && 'Transfer Transaction:'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {values.type === 'income' && 'Money coming into your account (salary, bonus, etc.)'}
                    {values.type === 'expense' && 'Money going out of your account (purchases, bills, etc.)'}
                    {values.type === 'transfer' && 'Money moving between your accounts'}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        )}
      </Formik>
    </Modal>
  );
}

TransactionCreateUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  transaction: PropTypes.object,
  onSuccess: PropTypes.func,
};

TransactionCreateUpdateModal.defaultProps = {
  transaction: null,
  onSuccess: null,
};
