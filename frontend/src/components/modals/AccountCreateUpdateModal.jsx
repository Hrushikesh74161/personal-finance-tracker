import { Box, Stack, Typography } from "@mui/material";
import { Formik } from 'formik';
import PropTypes from "prop-types";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useCreateAccountMutation } from "../../api/useCreateAccountMutation";
import { useUpdateAccountMutation } from "../../api/useUpdateAccountMutation";
import { showToast } from "../../redux/slices/toastSlice";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Select from "../form/Select";
import TextField from "../form/TextField";

/**
 * Account types configuration
 */
const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Checking Account' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'creditCard', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' },
];

/**
 * Validation schema for account form
 */
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Account name is required")
    .min(1, "Account name must be at least 1 character")
    .max(256, "Account name must not exceed 256 characters"),

  type: Yup.string()
    .required("Account type is required")
    .oneOf(['checking', 'savings', 'creditCard', 'cash', 'other'], "Please select a valid account type"),

  balance: Yup.number()
    .typeError("Balance must be a valid number")
    .min(0, "Balance cannot be negative")
    .required("Initial balance is required"),

  description: Yup.string()
    .max(500, "Description must not exceed 500 characters"),

  accountNumber: Yup.string()
    .max(50, "Account number must not exceed 50 characters"),
});

/**
 * Account Create/Update Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} [props.account] - Account data for editing (null for create)
 * @param {Function} [props.onSuccess] - Success callback
 */
export default function AccountCreateUpdateModal({
  open,
  onClose,
  account = null,
  onSuccess,
}) {
  const formikRef = useRef(null);
  const isEditMode = Boolean(account);
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("loginInfo"))?.user;
  // Create account mutation

  const createAccountMutation = useCreateAccountMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Account created successfully", type: "success" }));
      onSuccess?.(data);
      onClose();
    },
    onError: (error) => {
      console.log({createAccountError: error});
      dispatch(showToast({ message: "Failed to create account", type: "error" }));
    }
  });

  // Update account mutation
  const updateAccountMutation = useUpdateAccountMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Account updated successfully", type: "success" }));
      onSuccess?.(data);
      onClose();
    },
    onError: (error) => {
      dispatch(showToast({ message: "Failed to update account", type: "error" }));
    }
  });

  // Initial form values
  const initialValues = {
    name: account?.name || '',
    type: account?.type || '',
    balance: account?.balance || 0,
    description: account?.description || '',
    accountNumber: account?.accountNumber || '',
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (isEditMode) {
      updateAccountMutation.mutate({
        accountId: account._id,
        updateData: values,
      });
    } else {
      createAccountMutation.mutate({
        ...values,
        userId: user._id,
      });
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
    onClose();
  };

  // Get account type label
  const getAccountTypeLabel = (type) => {
    const accountType = ACCOUNT_TYPES.find(option => option.value === type);
    return accountType ? accountType.label : type;
  };

  const isLoading = createAccountMutation.isPending || updateAccountMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? `Edit ${account.name}` : 'Create New Account'}
      subTitle={isEditMode ? 'Update account information' : 'Add a new financial account to track your money'}
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
          form="account-form"
          disabled={isLoading}
          onClick={handleSubmit}
          sx={{ minWidth: 120 }}
        >
          {isLoading
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Account' : 'Create Account')
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
          <Box component="form" id="account-form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Account Name */}
              <TextField
                required
                label="Account Name"
                name="name"
                placeholder="Enter account name (e.g., My Checking Account)"
                value={values.name}
                onChange={handleChange}
                error={Boolean(touched.name && errors.name)}
                errorText={touched.name && errors.name}
                helperText="Choose a descriptive name for your account"
              />

              {/* Account Type */}
              <Select
                required
                label="Account Type"
                name="type"
                value={values.type}
                onChange={(e) => setFieldValue('type', e.target.value)}
                error={Boolean(touched.type && errors.type)}
                errorText={touched.type && errors.type}
                helperText="Select the type of account you're creating"
                options={ACCOUNT_TYPES}
              />

              {/* Initial Balance */}
              <TextField
                required
                label="Initial Balance"
                name="balance"
                type="number"
                placeholder="0"
                value={values.balance}
                onChange={handleChange}
                error={Boolean(touched.balance && errors.balance)}
                errorText={touched.balance && errors.balance}
                helperText="Enter the current balance of this account"
                inputProps={{
                  step: "1",
                  min: "0"
                }}
              />

              {/* Account Number */}
              <TextField
                label="Account Number"
                name="accountNumber"
                placeholder="Enter account number (optional)"
                value={values.accountNumber}
                onChange={handleChange}
                error={Boolean(touched.accountNumber && errors.accountNumber)}
                errorText={touched.accountNumber && errors.accountNumber}
                helperText="Optional: Bank account number or card number"
              />

              {/* Description */}
              <TextField
                label="Description"
                name="description"
                placeholder="Enter account description (optional)"
                value={values.description}
                onChange={handleChange}
                error={Boolean(touched.description && errors.description)}
                errorText={touched.description && errors.description}
                helperText="Optional: Additional notes about this account"
                multiline
                rows={3}
                characterLimit={500}
              />

              {/* Account Type Info */}
              {values.type && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                    {getAccountTypeLabel(values.type)} Information:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {values.type === 'checking' && 'A checking account for daily transactions and bill payments.'}
                    {values.type === 'savings' && 'A savings account for storing money and earning interest.'}
                    {values.type === 'creditCard' && 'A credit card account for tracking credit card balances and payments.'}
                    {values.type === 'cash' && 'A cash account for tracking physical cash on hand.'}
                    {values.type === 'other' && 'A custom account type for other financial instruments.'}
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

AccountCreateUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.object,
  onSuccess: PropTypes.func,
};

AccountCreateUpdateModal.defaultProps = {
  account: null,
  onSuccess: null,
};
