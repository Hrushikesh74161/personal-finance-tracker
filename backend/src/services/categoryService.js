import { categoryModel } from "../models/categoryModel.js";

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @param {string} categoryData.userId - User ID
 * @param {string} categoryData.name - Category name
 * @param {string} categoryData.description - Category description
 * @param {string} categoryData.color - Category color
 * @param {string} categoryData.icon - Category icon
 * @returns {Promise<Object>} Created category data
 */
export async function createCategory(categoryData) {
  const {
    userId,
    name,
    description,
    color = "#3B82F6",
    icon = "category",
  } = categoryData;

  // Check if category with same name already exists for user
  const existingCategory = await categoryModel.findOne({
    userId,
    name: { $regex: new RegExp(`^${name}$`, "i") },
    deleted: false,
  });

  if (existingCategory) {
    throw new Error("Category with this name already exists");
  }

  // Create new category
  const newCategory = new categoryModel({
    userId,
    name,
    description,
    color,
    icon,
  });

  const savedCategory = await newCategory.save();
  await savedCategory.populate({
    path: "userId",
    select: "firstName lastName email",
  });

  return savedCategory;
}

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Category data
 */
export async function getCategoryById(categoryId, userId) {
  const category = await categoryModel
    .findOne({ _id: categoryId, userId, deleted: false })
    .populate({
      path: "userId",
      select: "firstName lastName email",
    })
    .lean();

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

/**
 * Get all categories for a user with filtering and pagination
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 * @param {boolean} filters.isActive - Active status filter
 * @param {string} filters.search - Search term for name/description
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @param {string} filters.sortBy - Sort field
 * @param {string} filters.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Paginated categories data
 */
export async function getCategories(userId, filters = {}) {
  const {
    isActive,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  // Build query
  const query = { userId, deleted: false };

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const [categories, totalCount] = await Promise.all([
    categoryModel
      .find(query)
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    categoryModel.countDocuments(query),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);

  return {
    categories,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
}

/**
 * Update a category
 * @param {string} categoryId - Category ID
 * @param {string} userId - User ID for authorization
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated category data
 */
export async function updateCategory(categoryId, userId, updateData) {
  const category = await categoryModel.findOne({
    _id: categoryId,
    userId,
    deleted: false,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Check if name is being updated and if it conflicts with existing category
  if (updateData.name && updateData.name !== category.name) {
    const existingCategory = await categoryModel.findOne({
      userId,
      name: { $regex: new RegExp(`^${updateData.name}$`, "i") },
      deleted: false,
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }
  }

  // Update category fields
  const updatedCategory = await categoryModel
    .findByIdAndUpdate(categoryId, updateData, { new: true })
    .populate({
      path: "userId",
      select: "firstName lastName email",
    })
    .lean();

  return updatedCategory;
}

/**
 * Delete a category (soft delete)
 * @param {string} categoryId - Category ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteCategory(categoryId, userId) {
  const category = await categoryModel.findOne({
    _id: categoryId,
    userId,
    deleted: false,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Soft delete
  category.deleted = true;
  category.deletedAt = new Date();
  await category.save();

  return { message: "Category deleted successfully" };
}

/**
 * Get category usage statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Category usage statistics
 */
export async function getCategoryStats(userId) {
  const categories = await categoryModel
    .find({ userId, deleted: false, isActive: true })
    .select("name color icon")
    .lean();

  return {
    totalCategories: categories.length,
    activeCategories: categories.filter(cat => cat.isActive).length,
    categories: categories,
  };
}
