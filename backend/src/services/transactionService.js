import { transactionModel } from "../models/transactionModel.js";

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data
 * @param {string} transactionData.userId - User ID
 * @param {string} transactionData.type - Transaction type
 * @param {string} transactionData.category - Transaction category
 * @param {number} transactionData.amount - Transaction amount
 * @param {string} transactionData.description - Transaction description
 * @param {Date} transactionData.date - Transaction date
 * @param {Array} transactionData.tags - Transaction tags
 * @param {string} transactionData.accountId - Account ID
 * @returns {Promise<Object>} Created transaction data
 */
export async function createTransaction(transactionData) {
  const {
    userId,
    type,
    category,
    amount,
    description,
    date,
    tags,
    accountId,
  } = transactionData;

  // Create new transaction
  const newTransaction = new transactionModel({
    userId,
    type,
    category,
    amount,
    description,
    date: date || new Date(),
    tags: tags || [],
    accountId,
  });

  const savedTransaction = await newTransaction.save();
  await savedTransaction.populate([
    {
      path: "userId",
      select: "firstName lastName email",
    },
    {
      path: "accountId",
      select: "name type balance",
    },
  ]);

  return savedTransaction;
}

/**
 * Get transaction by ID
 * @param {string} transactionId - Transaction ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Transaction data
 */
export async function getTransactionById(transactionId, userId) {
  const transaction = await transactionModel
    .findOne({ _id: transactionId, userId, deleted: false })
    .populate([
      {
        path: "userId",
        select: "firstName lastName email",
      },
      {
        path: "accountId",
        select: "name type balance",
      },
    ])
    .lean();

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction;
}

/**
 * Get all transactions for a user with filtering and pagination
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 * @param {string} filters.type - Transaction type filter
 * @param {string} filters.category - Category filter
 * @param {string} filters.accountId - Account ID filter
 * @param {Date} filters.startDate - Start date filter
 * @param {Date} filters.endDate - End date filter
 * @param {number} filters.minAmount - Minimum amount filter
 * @param {number} filters.maxAmount - Maximum amount filter
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @param {string} filters.sortBy - Sort field
 * @param {string} filters.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Paginated transactions data
 */
export async function getTransactions(userId, filters = {}) {
  const {
    type,
    category,
    accountId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    page = 1,
    limit = 10,
    sortBy = "date",
    sortOrder = "desc",
  } = filters;

  // Build query
  const query = { userId, deleted: false };

  if (type) {
    query.type = type;
  }

  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  if (accountId) {
    query.accountId = accountId;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }

  if (minAmount !== undefined || maxAmount !== undefined) {
    query.amount = {};
    if (minAmount !== undefined) {
      query.amount.$gte = minAmount;
    }
    if (maxAmount !== undefined) {
      query.amount.$lte = maxAmount;
    }
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const [transactions, totalCount] = await Promise.all([
    transactionModel
      .find(query)
      .populate([
        {
          path: "userId",
          select: "firstName lastName email",
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
    transactionModel.countDocuments(query),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);

  return {
    transactions,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
}

/**
 * Update a transaction
 * @param {string} transactionId - Transaction ID
 * @param {string} userId - User ID for authorization
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated transaction data
 */
export async function updateTransaction(transactionId, userId, updateData) {
  const transaction = await transactionModel.findOne({
    _id: transactionId,
    userId,
    deleted: false,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Update transaction fields
  console.log({ updateData });
  const updatedTransaction = await transactionModel.findByIdAndUpdate(transactionId, updateData, { new: true }).populate([
    {
      path: "userId",
      select: "firstName lastName email",
    },
    {
      path: "accountId",
      select: "name type balance",
    },
  ]).lean();

  return updatedTransaction;
}

/**
 * Delete a transaction (soft delete)
 * @param {string} transactionId - Transaction ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteTransaction(transactionId, userId) {
  const transaction = await transactionModel.findOne({
    _id: transactionId,
    userId,
    deleted: false,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Soft delete
  transaction.deleted = true;
  transaction.deletedAt = new Date();
  await transaction.save();

  return { message: "Transaction deleted successfully" };
}

