import { Box, Stack, Typography } from "@mui/material";
import { Formik } from 'formik';
import PropTypes from "prop-types";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useCreateBudgetMutation } from "../../api/useCreateBudgetMutation";
import { useUpdateBudgetMutation } from "../../api/useUpdateBudgetMutation";
import { useGetCategoriesQuery } from "../../api/useGetCategoriesQuery";
import { showToast } from "../../redux/slices/toastSlice";
import Button from "../common/Button";
import Modal from "../common/Modal";
import TextField from "../form/TextField";
import Select from "../form/Select";

/**
 * Budget period options
 */
const PERIOD_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

/**
 * Validation schema for budget form
 */
const validationSchema = Yup.object().shape({
  categoryId: Yup.string()
    .required("Category is required"),

  name: Yup.string()
    .required("Budget name is required")
    .min(1, "Budget name must be at least 1 character")
    .max(100, "Budget name must not exceed 100 characters"),

  description: Yup.string()
    .max(500, "Description must not exceed 500 characters"),

  amount: Yup.number()
    .required("Amount is required")
    .min(0, "Amount must be positive")
    .typeError("Amount must be a valid number"),

  period: Yup.string()
    .oneOf(['weekly', 'monthly', 'quarterly', 'yearly'], "Invalid period")
    .required("Period is required"),

  startDate: Yup.date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past"),

  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref('startDate'), "End date must be after start date"),
});

/**
 * Budget Create/Update Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} [props.budget] - Budget data for editing (null for create)
 * @param {Function} [props.onSuccess] - Success callback
 */
export default function BudgetCreateUpdateModal({
  open,
  onClose,
  budget = null,
  onSuccess,
}) {
  const formikRef = useRef(null);
  const isEditMode = Boolean(budget);
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("loginInfo"))?.user;

  // Fetch categories for dropdown
  const { data: categoriesData } = useGetCategoriesQuery({
    filters: { isActive: true }
  });

  // Create budget mutation
  const createBudgetMutation = useCreateBudgetMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Budget created successfully", type: "success" }));
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create budget. Please try again.";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  });

  // Update budget mutation
  const updateBudgetMutation = useUpdateBudgetMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Budget updated successfully", type: "success" }));
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update budget. Please try again.";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  });

  // Initial form values
  const initialValues = {
    categoryId: budget?.categoryId?._id || '',
    name: budget?.name || '',
    description: budget?.description || '',
    amount: budget?.amount || '',
    period: budget?.period || 'monthly',
    startDate: budget?.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : '',
    endDate: budget?.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : '',
  };

  // Handle form submission
  const handleSubmit = (values) => {
    const submitData = {
      ...values,
      startDate: new Date(values.startDate),
      endDate: new Date(values.endDate),
    };

    if (isEditMode) {
      updateBudgetMutation.mutate({
        id: budget._id,
        data: submitData,
      });
    } else {
      createBudgetMutation.mutate({
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

  const isLoading = createBudgetMutation.isPending || updateBudgetMutation.isPending;

  // Prepare category options
  const categoryOptions = categoriesData?.categories?.map(category => ({
    value: category._id,
    label: category.name,
  })) || [];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? `Edit ${budget.name}` : 'Create New Budget'}
      subTitle={isEditMode ? 'Update budget information' : 'Set a budget limit for a category'}
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
          form="budget-form"
          disabled={isLoading}
          onClick={handleSubmit}
          sx={{ minWidth: 120 }}
        >
          {isLoading
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Budget' : 'Create Budget')
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
          <Box component="form" id="budget-form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Category Selection */}
              <Select
                required
                label="Category"
                name="categoryId"
                value={values.categoryId}
                onChange={handleChange}
                options={categoryOptions}
                error={Boolean(touched.categoryId && errors.categoryId)}
                errorText={touched.categoryId && errors.categoryId}
                helperText="Select the category for this budget"
                placeholder="Choose a category"
              />

              {/* Budget Name */}
              <TextField
                required
                label="Budget Name"
                name="name"
                placeholder="Enter budget name (e.g., Monthly Food Budget)"
                value={values.name}
                onChange={handleChange}
                error={Boolean(touched.name && errors.name)}
                errorText={touched.name && errors.name}
                helperText="Choose a descriptive name for your budget"
              />

              {/* Description */}
              <TextField
                label="Description"
                name="description"
                placeholder="Enter budget description (optional)"
                value={values.description}
                onChange={handleChange}
                error={Boolean(touched.description && errors.description)}
                errorText={touched.description && errors.description}
                helperText="Optional: Additional notes about this budget"
                multiline
                rows={3}
                characterLimit={500}
              />

              {/* Amount and Period */}
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
                  helperText="Budget amount"
                  sx={{ flex: 1 }}
                />

                <Select
                  required
                  label="Period"
                  name="period"
                  value={values.period}
                  onChange={handleChange}
                  options={PERIOD_OPTIONS}
                  error={Boolean(touched.period && errors.period)}
                  errorText={touched.period && errors.period}
                  helperText="Budget period"
                  sx={{ flex: 1 }}
                />
              </Box>

              {/* Date Range */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={values.startDate}
                  onChange={handleChange}
                  error={Boolean(touched.startDate && errors.startDate)}
                  errorText={touched.startDate && errors.startDate}
                  helperText="Budget start date"
                  sx={{ flex: 1 }}
                />

                <TextField
                  required
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={values.endDate}
                  onChange={handleChange}
                  error={Boolean(touched.endDate && errors.endDate)}
                  errorText={touched.endDate && errors.endDate}
                  helperText="Budget end date"
                  sx={{ flex: 1 }}
                />
              </Box>

              {/* Budget Summary */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                  Budget Summary:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {values.name || 'Budget Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Amount: ${values.amount || '0'} {values.period && `per ${values.period}`}
                </Typography>
                {values.startDate && values.endDate && (
                  <Typography variant="body2" color="text.secondary">
                    Period: {new Date(values.startDate).toLocaleDateString()} - {new Date(values.endDate).toLocaleDateString()}
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

BudgetCreateUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  budget: PropTypes.object,
  onSuccess: PropTypes.func,
};

BudgetCreateUpdateModal.defaultProps = {
  budget: null,
  onSuccess: null,
};
