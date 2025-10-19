import { regularPaymentModel } from "../models/regularPaymentModel.js";
import { categoryModel } from "../models/categoryModel.js";
import { accountModel } from "../models/accountModel.js";

/**
 * Create a new regular payment
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.userId - User ID
 * @param {string} paymentData.categoryId - Category ID
 * @param {string} paymentData.accountId - Account ID
 * @param {string} paymentData.name - Payment name
 * @param {string} paymentData.description - Payment description
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.frequency - Payment frequency
 * @param {Date} paymentData.nextDueDate - Next due date
 * @param {Date} paymentData.endDate - End date (optional)
 * @param {Array} paymentData.tags - Payment tags
 * @returns {Promise<Object>} Created payment data
 */
export async function createRegularPayment(paymentData) {
  const {
    userId,
    categoryId,
    accountId,
    name,
    description,
    amount,
    frequency = "monthly",
    nextDueDate,
    endDate,
    tags = [],
  } = paymentData;

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

  // Verify account exists and belongs to user
  const account = await accountModel.findOne({
    _id: accountId,
    userId,
    deleted: false,
    isActive: true,
  });

  if (!account) {
    throw new Error("Account not found or inactive");
  }

  // Validate next due date
  if (new Date(nextDueDate) <= new Date()) {
    throw new Error("Next due date must be in the future");
  }

  // If end date is provided, validate date range
  if (endDate && new Date(nextDueDate) >= new Date(endDate)) {
    throw new Error("Next due date must be before end date");
  }

  // Create new regular payment
  const newPayment = new regularPaymentModel({
    userId,
    categoryId,
    accountId,
    name,
    description,
    amount,
    frequency,
    nextDueDate,
    endDate,
    tags,
  });

  const savedPayment = await newPayment.save();
  await savedPayment.populate([
    {
      path: "userId",
      select: "firstName lastName email",
    },
    {
      path: "categoryId",
      select: "name color icon",
    },
    {
      path: "accountId",
      select: "name type balance",
    },
  ]);

  return savedPayment;
}

/**
 * Get regular payment by ID
 * @param {string} paymentId - Payment ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Payment data
 */
export async function getRegularPaymentById(paymentId, userId) {
  const payment = await regularPaymentModel
    .findOne({ _id: paymentId, userId, deleted: false })
    .populate([
      {
        path: "userId",
        select: "firstName lastName email",
      },
      {
        path: "categoryId",
        select: "name color icon",
      },
      {
        path: "accountId",
        select: "name type balance",
      },
    ])
    .lean();

  if (!payment) {
    throw new Error("Regular payment not found");
  }

  return payment;
}

/**
 * Get all regular payments for a user with filtering and pagination
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 * @param {boolean} filters.isActive - Active status filter
 * @param {string} filters.categoryId - Category ID filter
 * @param {string} filters.accountId - Account ID filter
 * @param {string} filters.frequency - Frequency filter
 * @param {string} filters.search - Search term for name/description
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @param {string} filters.sortBy - Sort field
 * @param {string} filters.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Paginated payments data
 */
export async function getRegularPayments(userId, filters = {}) {
  const {
    isActive,
    categoryId,
    accountId,
    frequency,
    search,
    page = 1,
    limit = 10,
    sortBy = "nextDueDate",
    sortOrder = "asc",
  } = filters;

  // Build query
  const query = { userId, deleted: false };

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  if (categoryId) {
    query.categoryId = categoryId;
  }

  if (accountId) {
    query.accountId = accountId;
  }

  if (frequency) {
    query.frequency = frequency;
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
  const [payments, totalCount] = await Promise.all([
    regularPaymentModel
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
        {
          path: "accountId",
          select: "name type balance",
        },
      ])
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    regularPaymentModel.countDocuments(query),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);

  return {
    payments,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
}

/**
 * Update a regular payment
 * @param {string} paymentId - Payment ID
 * @param {string} userId - User ID for authorization
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated payment data
 */
export async function updateRegularPayment(paymentId, userId, updateData) {
  const payment = await regularPaymentModel.findOne({
    _id: paymentId,
    userId,
    deleted: false,
  });

  if (!payment) {
    throw new Error("Regular payment not found");
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

  // If account is being updated, verify it exists and belongs to user
  if (updateData.accountId) {
    const account = await accountModel.findOne({
      _id: updateData.accountId,
      userId,
      deleted: false,
      isActive: true,
    });

    if (!account) {
      throw new Error("Account not found or inactive");
    }
  }

  // If next due date is being updated, validate it
  const nextDueDate = updateData.nextDueDate || payment.nextDueDate;
  if (new Date(nextDueDate) <= new Date()) {
    throw new Error("Next due date must be in the future");
  }

  // If end date is being updated, validate date range
  const endDate = updateData.endDate || payment.endDate;
  if (endDate && new Date(nextDueDate) >= new Date(endDate)) {
    throw new Error("Next due date must be before end date");
  }

  // Update payment fields
  const updatedPayment = await regularPaymentModel
    .findByIdAndUpdate(paymentId, updateData, { new: true })
    .populate([
      {
        path: "userId",
        select: "firstName lastName email",
      },
      {
        path: "categoryId",
        select: "name color icon",
      },
      {
        path: "accountId",
        select: "name type balance",
      },
    ])
    .lean();

  return updatedPayment;
}

/**
 * Delete a regular payment (soft delete)
 * @param {string} paymentId - Payment ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteRegularPayment(paymentId, userId) {
  const payment = await regularPaymentModel.findOne({
    _id: paymentId,
    userId,
    deleted: false,
  });

  if (!payment) {
    throw new Error("Regular payment not found");
  }

  // Soft delete
  payment.deleted = true;
  payment.deletedAt = new Date();
  await payment.save();

  return { message: "Regular payment deleted successfully" };
}

/**
 * Get regular payment statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Payment statistics
 */
export async function getRegularPaymentStats(userId) {
  const payments = await regularPaymentModel
    .find({ userId, deleted: false, isActive: true })
    .populate([
      {
        path: "categoryId",
        select: "name color icon",
      },
      {
        path: "accountId",
        select: "name type balance",
      },
    ])
    .lean();

  const totalPayments = payments.length;
  const activePayments = payments.filter(payment => payment.isActive).length;
  const totalMonthlyAmount = payments.reduce((sum, payment) => {
    // Convert all frequencies to monthly equivalent
    let monthlyAmount = payment.amount;
    switch (payment.frequency) {
      case "weekly":
        monthlyAmount = payment.amount * 4.33; // Average weeks per month
        break;
      case "quarterly":
        monthlyAmount = payment.amount / 3;
        break;
      case "yearly":
        monthlyAmount = payment.amount / 12;
        break;
      default: // monthly
        monthlyAmount = payment.amount;
    }
    return sum + monthlyAmount;
  }, 0);

  // Group by frequency
  const frequencyStats = payments.reduce((acc, payment) => {
    acc[payment.frequency] = (acc[payment.frequency] || 0) + 1;
    return acc;
  }, {});

  // Group by category
  const categoryStats = payments.reduce((acc, payment) => {
    const categoryName = payment.categoryId?.name || "Unknown";
    acc[categoryName] = (acc[categoryName] || 0) + payment.amount;
    return acc;
  }, {});

  // Get upcoming payments (next 7 days)
  const upcomingPayments = payments.filter(payment => {
    const daysUntilDue = Math.ceil((new Date(payment.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  });

  // Get overdue payments
  const overduePayments = payments.filter(payment => {
    const daysUntilDue = Math.ceil((new Date(payment.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilDue < 0;
  });

  return {
    totalPayments,
    activePayments,
    totalMonthlyAmount,
    frequencyStats,
    categoryStats,
    upcomingPayments: upcomingPayments.length,
    overduePayments: overduePayments.length,
    payments: payments.map(payment => ({
      id: payment._id,
      name: payment.name,
      amount: payment.amount,
      frequency: payment.frequency,
      nextDueDate: payment.nextDueDate,
      category: payment.categoryId?.name || "Unknown",
      color: payment.categoryId?.color || "#3B82F6",
      account: payment.accountId?.name || "Unknown",
    })),
  };
}

/**
 * Get upcoming regular payments
 * @param {string} userId - User ID
 * @param {number} days - Number of days to look ahead (default: 30)
 * @returns {Promise<Array>} Upcoming payments
 */
export async function getUpcomingPayments(userId, days = 30) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  const payments = await regularPaymentModel
    .find({
      userId,
      deleted: false,
      isActive: true,
      nextDueDate: { $lte: endDate },
    })
    .populate([
      {
        path: "categoryId",
        select: "name color icon",
      },
      {
        path: "accountId",
        select: "name type balance",
      },
    ])
    .sort({ nextDueDate: 1 })
    .lean();

  return payments;
}

/**
 * Update next due date for a payment (used when payment is made)
 * @param {string} paymentId - Payment ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Updated payment data
 */
export async function updateNextDueDate(paymentId, userId) {
  const payment = await regularPaymentModel.findOne({
    _id: paymentId,
    userId,
    deleted: false,
    isActive: true,
  });

  if (!payment) {
    throw new Error("Regular payment not found");
  }

  // Calculate next due date based on frequency
  const currentDueDate = new Date(payment.nextDueDate);
  let nextDueDate = new Date(currentDueDate);

  switch (payment.frequency) {
    case "weekly":
      nextDueDate.setDate(currentDueDate.getDate() + 7);
      break;
    case "monthly":
      nextDueDate.setMonth(currentDueDate.getMonth() + 1);
      break;
    case "quarterly":
      nextDueDate.setMonth(currentDueDate.getMonth() + 3);
      break;
    case "yearly":
      nextDueDate.setFullYear(currentDueDate.getFullYear() + 1);
      break;
  }

  // Check if payment has an end date
  if (payment.endDate && nextDueDate > new Date(payment.endDate)) {
    // Payment has ended, deactivate it
    payment.isActive = false;
    payment.nextDueDate = nextDueDate;
  } else {
    payment.nextDueDate = nextDueDate;
  }

  const updatedPayment = await payment.save();
  await updatedPayment.populate([
    {
      path: "categoryId",
      select: "name color icon",
    },
    {
      path: "accountId",
      select: "name type balance",
    },
  ]);

  return updatedPayment;
}
