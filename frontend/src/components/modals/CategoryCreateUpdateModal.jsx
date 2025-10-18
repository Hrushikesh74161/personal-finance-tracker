import { Box, Stack, Typography } from "@mui/material";
import { Formik } from 'formik';
import PropTypes from "prop-types";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useCreateCategoryMutation } from "../../api/useCreateCategoryMutation";
import { useUpdateCategoryMutation } from "../../api/useUpdateCategoryMutation";
import { showToast } from "../../redux/slices/toastSlice";
import Button from "../common/Button";
import Modal from "../common/Modal";
import TextField from "../form/TextField";

/**
 * Predefined color options for categories
 */
const COLOR_OPTIONS = [
  { value: '#3B82F6', label: 'Blue', color: '#3B82F6' },
  { value: '#10B981', label: 'Green', color: '#10B981' },
  { value: '#F59E0B', label: 'Yellow', color: '#F59E0B' },
  { value: '#EF4444', label: 'Red', color: '#EF4444' },
  { value: '#8B5CF6', label: 'Purple', color: '#8B5CF6' },
  { value: '#06B6D4', label: 'Cyan', color: '#06B6D4' },
  { value: '#F97316', label: 'Orange', color: '#F97316' },
  { value: '#84CC16', label: 'Lime', color: '#84CC16' },
  { value: '#EC4899', label: 'Pink', color: '#EC4899' },
  { value: '#6B7280', label: 'Gray', color: '#6B7280' },
];

/**
 * Predefined icon options for categories
 */
const ICON_OPTIONS = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'car', label: 'Transportation' },
  { value: 'home', label: 'Home & Utilities' },
  { value: 'health', label: 'Healthcare' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'gift', label: 'Gifts' },
  { value: 'category', label: 'General' },
];

/**
 * Validation schema for category form
 */
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .min(1, "Category name must be at least 1 character")
    .max(100, "Category name must not exceed 100 characters"),

  description: Yup.string()
    .max(500, "Description must not exceed 500 characters"),

  color: Yup.string()
    .matches(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color code")
    .required("Color is required"),

  icon: Yup.string()
    .max(50, "Icon must not exceed 50 characters")
    .required("Icon is required"),
});

/**
 * Category Create/Update Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} [props.category] - Category data for editing (null for create)
 * @param {Function} [props.onSuccess] - Success callback
 */
export default function CategoryCreateUpdateModal({
  open,
  onClose,
  category = null,
  onSuccess,
}) {
  const formikRef = useRef(null);
  const isEditMode = Boolean(category);
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("loginInfo"))?.user;

  // Create category mutation
  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Category created successfully", type: "success" }));
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create category. Please try again.";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  });

  // Update category mutation
  const updateCategoryMutation = useUpdateCategoryMutation({
    onSuccess: (data) => {
      dispatch(showToast({ message: "Category updated successfully", type: "success" }));
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update category. Please try again.";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  });

  // Initial form values
  const initialValues = {
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#3B82F6',
    icon: category?.icon || 'category',
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (isEditMode) {
      updateCategoryMutation.mutate({
        id: category._id,
        data: values,
      });
    } else {
      createCategoryMutation.mutate({
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

  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? `Edit ${category.name}` : 'Create New Category'}
      subTitle={isEditMode ? 'Update category information' : 'Add a new category to organize your expenses'}
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
          form="category-form"
          disabled={isLoading}
          onClick={handleSubmit}
          sx={{ minWidth: 120 }}
        >
          {isLoading
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Category' : 'Create Category')
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
          <Box component="form" id="category-form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Category Name */}
              <TextField
                required
                label="Category Name"
                name="name"
                placeholder="Enter category name (e.g., Food & Dining)"
                value={values.name}
                onChange={handleChange}
                error={Boolean(touched.name && errors.name)}
                errorText={touched.name && errors.name}
                helperText="Choose a descriptive name for your category"
              />

              {/* Description */}
              <TextField
                label="Description"
                name="description"
                placeholder="Enter category description (optional)"
                value={values.description}
                onChange={handleChange}
                error={Boolean(touched.description && errors.description)}
                errorText={touched.description && errors.description}
                helperText="Optional: Additional notes about this category"
                multiline
                rows={3}
                characterLimit={500}
              />

              {/* Color Selection */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Color *
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {COLOR_OPTIONS.map((option) => (
                    <Box
                      key={option.value}
                      onClick={() => setFieldValue('color', option.value)}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: option.color,
                        cursor: 'pointer',
                        border: values.color === option.value ? '3px solid #000' : '2px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }
                      }}
                    />
                  ))}
                </Box>
                <TextField
                  label="Custom Color"
                  name="color"
                  placeholder="#3B82F6"
                  value={values.color}
                  onChange={handleChange}
                  error={Boolean(touched.color && errors.color)}
                  errorText={touched.color && errors.color}
                  helperText="Enter a hex color code (e.g., #3B82F6)"
                  size="small"
                />
              </Box>

              {/* Icon Selection */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Icon *
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {ICON_OPTIONS.map((option) => (
                    <Box
                      key={option.value}
                      onClick={() => setFieldValue('icon', option.value)}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        border: values.icon === option.value ? '2px solid #3B82F6' : '1px solid #e0e0e0',
                        cursor: 'pointer',
                        backgroundColor: values.icon === option.value ? '#EBF4FF' : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#F3F4F6',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <TextField
                  label="Custom Icon"
                  name="icon"
                  placeholder="category"
                  value={values.icon}
                  onChange={handleChange}
                  error={Boolean(touched.icon && errors.icon)}
                  errorText={touched.icon && errors.icon}
                  helperText="Enter a custom icon identifier"
                  size="small"
                />
              </Box>

              {/* Preview */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                  Preview:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: values.color,
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {values.name || 'Category Name'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {values.icon}
                  </Typography>
                </Box>
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

CategoryCreateUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  category: PropTypes.object,
  onSuccess: PropTypes.func,
};

CategoryCreateUpdateModal.defaultProps = {
  category: null,
  onSuccess: null,
};
