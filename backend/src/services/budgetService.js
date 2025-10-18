import { budgetModel } from "../models/budgetModel.js";
import { categoryModel } from "../models/categoryModel.js";

/**
 * Create a new budget
 * @param {Object} budgetData - Budget data
 * @param {string} budgetData.userId - User ID
 * @param {string} budgetData.categoryId - Category ID
 * @param {string} budgetData.name - Budget name
 * @param {string} budgetData.description - Budget description
 * @param {number} budgetData.amount - Budget amount
 * @param {string} budgetData.period - Budget period
 * @param {Date} budgetData.startDate - Budget start date
 * @param {Date} budgetData.endDate - Budget end date
 * @returns {Promise<Object>} Created budget data
 */
export async function createBudget(budgetData) {
  const {
    userId,
    categoryId,
    name,
    description,
    amount,
    period = "monthly",
    startDate,
    endDate,
  } = budgetData;

  // Verify category exists and belongs to user
  const category = await categoryModel.findOne({
    _id: categoryId,
    userId,
    deleted: false,
    isActive: true,
  });

  if (!category) {
    throw new Error("Category not found or inactive");
  }

  // Validate date range
  if (new Date(startDate) >= new Date(endDate)) {
    throw new Error("Start date must be before end date");
  }

  // Check for overlapping budgets for the same category
  const overlappingBudget = await budgetModel.findOne({
    userId,
    categoryId,
    deleted: false,
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
  });

  if (overlappingBudget) {
    throw new Error("Budget already exists for this category in the specified date range");
  }

  // Create new budget
  const newBudget = new budgetModel({
    userId,
    categoryId,
    name,
    description,
    amount,
    period,
    startDate,
    endDate,
  });

  const savedBudget = await newBudget.save();
  await savedBudget.populate([
    {
      path: "userId",
      select: "firstName lastName email",
    },
    {
      path: "categoryId",
      select: "name color icon",
    },
  ]);

  return savedBudget;
}

/**
 * Get budget by ID
 * @param {string} budgetId - Budget ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Budget data
 */
export async function getBudgetById(budgetId, userId) {
  const budget = await budgetModel
    .findOne({ _id: budgetId, userId, deleted: false })
    .populate([
      {
        path: "userId",
        select: "firstName lastName email",
      },
      {
        path: "categoryId",
        select: "name color icon",
      },
    ])
    .lean();

  if (!budget) {
    throw new Error("Budget not found");
  }

  return budget;
}

/**
 * Get all budgets for a user with filtering and pagination
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 * @param {boolean} filters.isActive - Active status filter
 * @param {string} filters.categoryId - Category ID filter
 * @param {string} filters.period - Period filter
 * @param {string} filters.search - Search term for name/description
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @param {string} filters.sortBy - Sort field
 * @param {string} filters.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Paginated budgets data
 */
export async function getBudgets(userId, filters = {}) {
  const {
    isActive,
    categoryId,
    period,
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

  if (categoryId) {
    query.categoryId = categoryId;
  }

  if (period) {
    query.period = period;
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
  const [budgets, totalCount] = await Promise.all([
    budgetModel
      .find(query)
      .populate([
        {
          path: "userId",
          select: "firstName lastName email",
        },
        {
          path: "categoryId",
          select: "name color icon",
        },
      ])
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    budgetModel.countDocuments(query),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);

  return {
    budgets,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
}

/**
 * Update a budget
 * @param {string} budgetId - Budget ID
 * @param {string} userId - User ID for authorization
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated budget data
 */
export async function updateBudget(budgetId, userId, updateData) {
  const budget = await budgetModel.findOne({
    _id: budgetId,
    userId,
    deleted: false,
  });

  if (!budget) {
    throw new Error("Budget not found");
  }

  // If category is being updated, verify it exists and belongs to user
  if (updateData.categoryId) {
    const category = await categoryModel.findOne({
      _id: updateData.categoryId,
      userId,
      deleted: false,
      isActive: true,
    });

    if (!category) {
      throw new Error("Category not found or inactive");
    }
  }

  // If dates are being updated, validate date range
  const startDate = updateData.startDate || budget.startDate;
  const endDate = updateData.endDate || budget.endDate;

  if (new Date(startDate) >= new Date(endDate)) {
    throw new Error("Start date must be before end date");
  }

  // Check for overlapping budgets (excluding current budget)
  const overlappingBudget = await budgetModel.findOne({
    userId,
    categoryId: updateData.categoryId || budget.categoryId,
    deleted: false,
    _id: { $ne: budgetId },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
  });

  if (overlappingBudget) {
    throw new Error("Budget already exists for this category in the specified date range");
  }

  // Update budget fields
  const updatedBudget = await budgetModel
    .findByIdAndUpdate(budgetId, updateData, { new: true })
    .populate([
      {
        path: "userId",
        select: "firstName lastName email",
      },
      {
        path: "categoryId",
        select: "name color icon",
      },
    ])
    .lean();

  return updatedBudget;
}

/**
 * Delete a budget (soft delete)
 * @param {string} budgetId - Budget ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteBudget(budgetId, userId) {
  const budget = await budgetModel.findOne({
    _id: budgetId,
    userId,
    deleted: false,
  });

  if (!budget) {
    throw new Error("Budget not found");
  }

  // Soft delete
  budget.deleted = true;
  budget.deletedAt = new Date();
  await budget.save();

  return { message: "Budget deleted successfully" };
}

/**
 * Get budget statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Budget statistics
 */
export async function getBudgetStats(userId) {
  const budgets = await budgetModel
    .find({ userId, deleted: false, isActive: true })
    .populate({
      path: "categoryId",
      select: "name color icon",
    })
    .lean();

  const totalBudgets = budgets.length;
  const activeBudgets = budgets.filter(budget => budget.isActive).length;
  const totalBudgetAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0);

  // Group by period
  const periodStats = budgets.reduce((acc, budget) => {
    acc[budget.period] = (acc[budget.period] || 0) + 1;
    return acc;
  }, {});

  // Group by category
  const categoryStats = budgets.reduce((acc, budget) => {
    const categoryName = budget.categoryId?.name || "Unknown";
    acc[categoryName] = (acc[categoryName] || 0) + budget.amount;
    return acc;
  }, {});

  return {
    totalBudgets,
    activeBudgets,
    totalBudgetAmount,
    periodStats,
    categoryStats,
    budgets: budgets.map(budget => ({
      id: budget._id,
      name: budget.name,
      amount: budget.amount,
      period: budget.period,
      category: budget.categoryId?.name || "Unknown",
      color: budget.categoryId?.color || "#3B82F6",
    })),
  };
}

/**
 * Get current active budgets
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Current active budgets
 */
export async function getCurrentBudgets(userId) {
  const currentDate = new Date();

  const budgets = await budgetModel
    .find({
      userId,
      deleted: false,
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    })
    .populate({
      path: "categoryId",
      select: "name color icon",
    })
    .lean();

  return budgets;
}
