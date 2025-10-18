import { Add, Category, Delete, Edit, Palette } from "@mui/icons-material";
import { Box, Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDeleteCategoryMutation } from "../api/useDeleteCategoryMutation";
import { useGetCategoriesQuery } from "../api/useGetCategoriesQuery";
import { useGetCategoryStatsQuery } from "../api/useGetCategoryStatsQuery";
import Button from "../components/common/Button";
import ModernCard from "../components/common/ModernCard";
import CategoryCreateUpdateModal from "../components/modals/CategoryCreateUpdateModal";
import ConfirmationModal from "../components/modals/CofirmationModal";

/**
 * Categories page component displaying user's expense categories
 * @returns {JSX.Element} The categories page component
 */
export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [categoryCreateUpdateModalOpen, setCategoryCreateUpdateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Fetch categories data
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
  const { data: categoryStats, isLoading: statsLoading } = useGetCategoryStatsQuery();

  // Delete category mutation
  const deleteCategoryMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
    },
    onError: (error) => {
      console.error('Failed to delete category:', error);
    }
  });

  /* Category create/update modal handlers */
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryCreateUpdateModalOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryCreateUpdateModalOpen(true);
  };

  const handleCategoryCreateUpdateModalClose = () => {
    setCategoryCreateUpdateModalOpen(false);
    setEditingCategory(null);
  };

  const handleCategoryCreateUpdateModalSuccess = () => {
    handleCategoryCreateUpdateModalClose();
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
  };

  /* Delete category modal handlers */
  const handleDeleteCategory = (category) => {
    setDeletingCategory(category);
    setDeleteCategoryModalOpen(true);
  };

  const handleDeleteCategoryModalClose = () => {
    setDeleteCategoryModalOpen(false);
    setDeletingCategory(null);
  };

  const handleDeleteCategoryModalConfirm = () => {
    deleteCategoryMutation.mutate(deletingCategory._id);
    setDeleteCategoryModalOpen(false);
    setDeletingCategory(null);
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
  };

  // Loading state
  if (categoriesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading categories...</Typography>
      </Box>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography color="error">Failed to load categories</Typography>
        <Typography color="error">{JSON.stringify(categoriesError?.message)}</Typography>
      </Box>
    );
  }

  const categories = categoriesData?.categories || [];
  const stats = categoryStats || {};

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>
              Organize your expenses with custom categories
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<Add />}
              onClick={handleAddCategory}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
              }}
            >
              Add Category
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Category Management Card */}
      <Box sx={{ mb: 4 }}>
        <ModernCard
          title="Category Management"
          subtitle="Overview and insights"
          icon={<Category />}
          color="#8B5CF6"
        >
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 3,
            mt: 2
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#8B5CF6', mb: 1 }}>
                {stats.totalCategories || categories.length}
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Total Categories
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#10B981', mb: 1 }}>
                {stats.activeCategories || categories.filter(cat => cat.isActive).length}
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Active Categories
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: '2rem', fontWeight: 700, color: '#F59E0B', mb: 1 }}>
                {categories.filter(cat => !cat.isActive).length}
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Inactive Categories
              </Box>
            </Box>
          </Box>
        </ModernCard>
      </Box>

      {/* Categories Grid */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category._id}>
            <ModernCard
              title={category.name}
              subtitle={category.description || "No description"}
              icon={<Palette />}
              color={category.color}
              sx={{ height: '100%' }}
            >
              <Box sx={{ mt: 2 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: category.color,
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Chip
                      label={category.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={category.isActive ? "success" : "default"}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Category">
                      <IconButton
                        size="small"
                        onClick={() => handleEditCategory(category)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Category">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCategory(category)}
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

                {category.icon && (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Icon:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {category.icon}
                    </Typography>
                  </Box>
                )}

                <Box sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}>
                  Created {new Date(category.createdAt).toLocaleDateString()}
                </Box>
              </Box>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      {/* Category Create/Update Modal */}
      {categoryCreateUpdateModalOpen && (
        <CategoryCreateUpdateModal
          open={categoryCreateUpdateModalOpen}
          onClose={handleCategoryCreateUpdateModalClose}
          category={editingCategory}
          onSuccess={handleCategoryCreateUpdateModalSuccess}
        />
      )}

      {/* Delete Category Modal */}
      {deleteCategoryModalOpen && (
        <ConfirmationModal
          open={deleteCategoryModalOpen}
          onClose={handleDeleteCategoryModalClose}
          onConfirm={handleDeleteCategoryModalConfirm}
          title="Delete Category"
          message={`Are you sure you want to delete ${deletingCategory?.name}?`}
          description="This action cannot be undone. Any transactions using this category will need to be updated."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="error"
          cancelColor="secondary"
          confirmDisabled={deleteCategoryMutation.isPending}
          cancelDisabled={deleteCategoryMutation.isPending}
          showCancel={true}
          size="small"
        />
      )}
    </Box>
  );
}