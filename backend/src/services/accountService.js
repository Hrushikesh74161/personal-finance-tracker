import { accountModel } from "../models/accountModel.js";

/**
 * Create a new account
 * @param {Object} accountData - Account data
 * @param {string} accountData.userId - User ID
 * @param {string} accountData.name - Account name
 * @param {string} accountData.type - Account type
 * @param {number} accountData.balance - Account balance
 * @param {string} accountData.description - Account description
 * @param {string} accountData.accountNumber - Account number
 * @returns {Promise<Object>} Created account data
 */
export async function createAccount(accountData) {
  const {
    userId,
    name,
    type,
    balance = 0,
    description,
    accountNumber,
  } = accountData;

  // Create new account
  const newAccount = new accountModel({
    userId,
    name,
    type,
    balance,
    description,
    accountNumber,
  });

  const savedAccount = await newAccount.save();
  await savedAccount.populate({
    path: "userId",
    select: "firstName lastName email",
  });

  return savedAccount;
}

/**
 * Get account by ID
 * @param {string} accountId - Account ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Account data
 */
export async function getAccountById(accountId, userId) {
  const account = await accountModel
    .findOne({ _id: accountId, userId, deleted: false })
    .populate({
      path: "userId",
      select: "firstName lastName email",
    })
    .lean();

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
}

/**
 * Get all accounts for a user with filtering and pagination
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 * @param {string} filters.type - Account type filter
 * @param {boolean} filters.isActive - Active status filter
 * @param {number} filters.minBalance - Minimum balance filter
 * @param {number} filters.maxBalance - Maximum balance filter
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @param {string} filters.sortBy - Sort field
 * @param {string} filters.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Paginated accounts data
 */
export async function getAccounts(userId, filters = {}) {
  const {
    type,
    isActive,
    minBalance,
    maxBalance,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  // Build query
  const query = { userId, deleted: false };

  if (type) {
    query.type = type;
  }

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  if (minBalance !== undefined || maxBalance !== undefined) {
    query.balance = {};
    if (minBalance !== undefined) {
      query.balance.$gte = minBalance;
    }
    if (maxBalance !== undefined) {
      query.balance.$lte = maxBalance;
    }
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const [accounts, totalCount] = await Promise.all([
    accountModel
      .find(query)
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    accountModel.countDocuments(query),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);

  return {
    accounts,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
}

/**
 * Update an account
 * @param {string} accountId - Account ID
 * @param {string} userId - User ID for authorization
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated account data
 */
export async function updateAccount(accountId, userId, updateData) {
  const account = await accountModel.findOne({
    _id: accountId,
    userId,
    deleted: false,
  });

  if (!account) {
    throw new Error("Account not found");
  }

  // Update account fields
  const updatedAccount = await accountModel
    .findByIdAndUpdate(accountId, updateData, { new: true })
    .populate({
      path: "userId",
      select: "firstName lastName email",
    })
    .lean();

  return updatedAccount;
}

/**
 * Delete an account (soft delete)
 * @param {string} accountId - Account ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteAccount(accountId, userId) {
  const account = await accountModel.findOne({
    _id: accountId,
    userId,
    deleted: false,
  });

  if (!account) {
    throw new Error("Account not found");
  }

  // Soft delete
  account.deleted = true;
  account.deletedAt = new Date();
  await account.save();

  return { message: "Account deleted successfully" };
}

/**
 * Get account balance summary for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Balance summary data
 */
export async function getAccountBalanceSummary(userId) {
  const accounts = await accountModel
    .find({ userId, deleted: false, isActive: true })
    .select("balance")
    .lean();

  const summary = {
    totalDebt: 0,
    netWorth: 0,
    totalAccounts: accounts.length,
  };

  accounts.forEach((account) => {
    summary.totalDebt += account.balance < 0 ? account.balance : 0;
    summary.netWorth += account.balance;
  });

  return {
    totalDebt: summary.totalDebt,
    netWorth: summary.netWorth,
    totalAccounts: summary.totalAccounts,
  };
}
