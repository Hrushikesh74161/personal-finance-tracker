import { Box, Stack, Typography } from "@mui/material";
import { Formik } from 'formik';
import PropTypes from "prop-types";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useCreateRegularPaymentMutation } from "../../api/useCreateRegularPaymentMutation";
import { useUpdateRegularPaymentMutation } from "../../api/useUpdateRegularPaymentMutation";
import { useGetCategoriesQuery } from "../../api/useGetCategoriesQuery";
import { useGetAccountsQuery } from "../../api/useGetAccountsQuery";
import { showToast } from "../../redux/slices/toastSlice";
import Button from "../common/Button";
import Modal from "../common/Modal";
import TextField from "../form/TextField";
import Select from "../form/Select";

/**
 * Payment frequency options
 */
const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

/**
 * Validation schema for regular payment form
 */
const validationSchema = Yup.object().shape({
  categoryId: Yup.string()
    .required("Category is required"),

  accountId: Yup.string()
    .required("Account is required"),

  name: Yup.string()
    .required("Payment name is required")
    .min(1, "Payment name must be at least 1 character")
    .max(100, "Payment name must not exceed 100 characters"),

  description: Yup.string()
    .max(500, "Description must not exceed 500 characters"),

  amount: Yup.number()
    .required("Amount is required")
    .min(0, "Amount must be positive")
    .typeError("Amount must be a valid number"),

  frequency: Yup.string()
    .oneOf(['weekly', 'monthly', 'quarterly', 'yearly'], "Invalid frequency")
    .required("Frequency is required"),

  nextDueDate: Yup.date()
    .required("Next due date is required")
    .min(new Date(), "Next due date must be in the future"),

  endDate: Yup.date()
    .nullable()
    .test('end-date-validation', 'End date must be after next due date', function(value) {
      if (!value) return true; // Optional field
      return new Date(value) > new Date(this.parent.nextDueDate);
    }),
});

/**
 * Regular Payment Create/Update Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} [props.payment] - Payment data for editing (null for create)
 * @param {Function} [props.onSuccess] - Success callback
 */
export default function RegularPaymentCreateUpdateModal({
  open,
  onClose,
  payment = null,
  onSuccess,
}) {
  const formikRef = useRef(null);
  const isEditMode = Boolean(payment);
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("loginInfo"))?.user;

  // Fetch categories and accounts for dropdowns
  const { data: categoriesData } = useGetCategoriesQuery({
    filters: { isActive: true }
  });

  const { data: accountsData } = useGetAccountsQuery({
    filters: { isActive: true }
  });

  // Create regular payment mutation
  const createPaymentMutation = useCreateRegularPaymentMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Regular payment created successfully", type: "success" }));
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create regular payment. Please try again.";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  });

  // Update regular payment mutation
  const updatePaymentMutation = useUpdateRegularPaymentMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Regular payment updated successfully", type: "success" }));
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update regular payment. Please try again.";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  });

  // Initial form values
  const initialValues = {
    categoryId: payment?.categoryId?._id || '',
    accountId: payment?.accountId?._id || '',
    name: payment?.name || '',
    description: payment?.description || '',
    amount: payment?.amount || '',
    frequency: payment?.frequency || 'monthly',
    nextDueDate: payment?.nextDueDate ? new Date(payment.nextDueDate).toISOString().split('T')[0] : '',
    endDate: payment?.endDate ? new Date(payment.endDate).toISOString().split('T')[0] : '',
  };

  // Handle form submission
  const handleSubmit = (values) => {
    const submitData = {
      ...values,
      nextDueDate: new Date(values.nextDueDate),
      endDate: values.endDate ? new Date(values.endDate) : null,
    };

    if (isEditMode) {
      updatePaymentMutation.mutate({
        id: payment._id,
        data: submitData,
      });
    } else {
      createPaymentMutation.mutate({
        ...submitData,
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

  const isLoading = createPaymentMutation.isPending || updatePaymentMutation.isPending;

  // Prepare options
  const categoryOptions = categoriesData?.categories?.map(category => ({
    value: category._id,
    label: category.name,
  })) || [];

  const accountOptions = accountsData?.accounts?.map(account => ({
    value: account._id,
    label: `${account.name} (${account.type})`,
  })) || [];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? `Edit ${payment.name}` : 'Create New Regular Payment'}
      subTitle={isEditMode ? 'Update payment information' : 'Set up a recurring payment'}
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
          form="payment-form"
          disabled={isLoading}
          onClick={handleSubmit}
          sx={{ minWidth: 120 }}
        >
          {isLoading
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Payment' : 'Create Payment')
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
          <Box component="form" id="payment-form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Payment Name */}
              <TextField
                required
                label="Payment Name"
                name="name"
                placeholder="Enter payment name (e.g., Rent Payment, Netflix Subscription)"
                value={values.name}
                onChange={handleChange}
                error={Boolean(touched.name && errors.name)}
                errorText={touched.name && errors.name}
                helperText="Choose a descriptive name for your payment"
              />

              {/* Category and Account Selection */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Select
                  required
                  label="Category"
                  name="categoryId"
                  value={values.categoryId}
                  onChange={handleChange}
                  options={categoryOptions}
                  error={Boolean(touched.categoryId && errors.categoryId)}
                  errorText={touched.categoryId && errors.categoryId}
                  helperText="Payment category"
                  placeholder="Choose a category"
                  sx={{ flex: 1 }}
                />

                <Select
                  required
                  label="Account"
                  name="accountId"
                  value={values.accountId}
                  onChange={handleChange}
                  options={accountOptions}
                  error={Boolean(touched.accountId && errors.accountId)}
                  errorText={touched.accountId && errors.accountId}
                  helperText="Payment account"
                  placeholder="Choose an account"
                  sx={{ flex: 1 }}
                />
              </Box>

              {/* Amount and Frequency */}
              <Box sx={{ display: 'flex', gap: 2 }}>
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
                  helperText="Payment amount"
                  sx={{ flex: 1 }}
                />

                <Select
                  required
                  label="Frequency"
                  name="frequency"
                  value={values.frequency}
                  onChange={handleChange}
                  options={FREQUENCY_OPTIONS}
                  error={Boolean(touched.frequency && errors.frequency)}
                  errorText={touched.frequency && errors.frequency}
                  helperText="Payment frequency"
                  sx={{ flex: 1 }}
                />
              </Box>

              {/* Dates */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  label="Next Due Date"
                  name="nextDueDate"
                  type="date"
                  value={values.nextDueDate}
                  onChange={handleChange}
                  error={Boolean(touched.nextDueDate && errors.nextDueDate)}
                  errorText={touched.nextDueDate && errors.nextDueDate}
                  helperText="When is the next payment due?"
                  sx={{ flex: 1 }}
                />

                <TextField
                  label="End Date (Optional)"
                  name="endDate"
                  type="date"
                  value={values.endDate}
                  onChange={handleChange}
                  error={Boolean(touched.endDate && errors.endDate)}
                  errorText={touched.endDate && errors.endDate}
                  helperText="When should payments stop? (optional)"
                  sx={{ flex: 1 }}
                />
              </Box>

              {/* Description */}
              <TextField
                label="Description"
                name="description"
                placeholder="Enter payment description (optional)"
                value={values.description}
                onChange={handleChange}
                error={Boolean(touched.description && errors.description)}
                errorText={touched.description && errors.description}
                helperText="Optional: Additional notes about this payment"
                multiline
                rows={3}
                characterLimit={500}
              />

              {/* Payment Summary */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                  Payment Summary:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {values.name || 'Payment Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Amount: ${values.amount || '0'} {values.frequency && `per ${values.frequency}`}
                </Typography>
                {values.nextDueDate && (
                  <Typography variant="body2" color="text.secondary">
                    Next Due: {new Date(values.nextDueDate).toLocaleDateString()}
                  </Typography>
                )}
                {values.endDate && (
                  <Typography variant="body2" color="text.secondary">
                    End Date: {new Date(values.endDate).toLocaleDateString()}
                  </Typography>
                )}
                {values.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {values.description}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        )}
      </Formik>
    </Modal>
  );
}

RegularPaymentCreateUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  payment: PropTypes.object,
  onSuccess: PropTypes.func,
};

RegularPaymentCreateUpdateModal.defaultProps = {
  payment: null,
  onSuccess: null,
};
