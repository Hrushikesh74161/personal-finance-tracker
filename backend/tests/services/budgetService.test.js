import { jest } from '@jest/globals';

// mock budget model
jest.unstable_mockModule('../src/models/budgetModel.js', () => {
  const mockBudgetModel = jest.fn();
  mockBudgetModel.findOne = jest.fn();
  mockBudgetModel.find = jest.fn();
  mockBudgetModel.findByIdAndUpdate = jest.fn();
  mockBudgetModel.countDocuments = jest.fn();

  return {
    budgetModel: mockBudgetModel,
    __esModule: true,
  }
});

// mock category model
jest.unstable_mockModule('../src/models/categoryModel.js', () => {
  const mockCategoryModel = jest.fn();
  mockCategoryModel.findOne = jest.fn();

  return {
    categoryModel: mockCategoryModel,
    __esModule: true,
  }
});

const { budgetModel } = await import('../../src/models/budgetModel.js');
const { categoryModel } = await import('../../src/models/categoryModel.js');
const {
  createBudget,
  deleteBudget,
  getBudgetById,
  getBudgets,
  getBudgetStats,
  getCurrentBudgets,
  updateBudget,
} = await import('../../src/services/budgetService.js');

describe('BudgetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBudget', () => {
    it('should create a new budget successfully', async () => {
      const budgetData = {
        userId: 'user123',
        categoryId: 'category123',
        name: 'Monthly Food Budget',
        description: 'Budget for food expenses',
        amount: 500,
        period: 'monthly',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const mockCategory = {
        _id: 'category123',
        name: 'Food',
        userId: 'user123',
        deleted: false,
        isActive: true,
      };

      const mockBudget = {
        _id: 'budget123',
        ...budgetData,
        isActive: true,
        deleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue({
          _id: 'budget123',
          ...budgetData,
          isActive: true,
          deleted: false,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          populate: jest.fn(),
        }),
      };

      categoryModel.findOne.mockResolvedValue(mockCategory);
      budgetModel.findOne.mockResolvedValue(null);
      budgetModel.mockImplementation(() => mockBudget);

      const result = await createBudget(budgetData);

      expect(categoryModel.findOne).toHaveBeenCalledWith({
        _id: budgetData.categoryId,
        userId: budgetData.userId,
        deleted: false,
        isActive: true,
      });
      expect(budgetModel.findOne).toHaveBeenCalled();
      expect(mockBudget.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        _id: 'budget123',
        ...budgetData,
      }));
    });

    it('should throw error if category not found', async () => {
      const budgetData = {
        userId: 'user123',
        categoryId: 'category123',
        name: 'Monthly Food Budget',
        amount: 500,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      categoryModel.findOne.mockResolvedValue(null);

      await expect(createBudget(budgetData)).rejects.toThrow('Category not found or inactive');
    });

    it('should throw error if start date is after end date', async () => {
      const budgetData = {
        userId: 'user123',
        categoryId: 'category123',
        name: 'Monthly Food Budget',
        amount: 500,
        startDate: new Date('2024-01-31'),
        endDate: new Date('2024-01-01'),
      };

      const mockCategory = {
        _id: 'category123',
        name: 'Food',
        userId: 'user123',
        deleted: false,
        isActive: true,
      };

      categoryModel.findOne.mockResolvedValue(mockCategory);

      await expect(createBudget(budgetData)).rejects.toThrow('Start date must be before end date');
    });

    it('should throw error if overlapping budget exists', async () => {
      const budgetData = {
        userId: 'user123',
        categoryId: 'category123',
        name: 'Monthly Food Budget',
        amount: 500,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const mockCategory = {
        _id: 'category123',
        name: 'Food',
        userId: 'user123',
        deleted: false,
        isActive: true,
      };

      const existingBudget = {
        _id: 'existing123',
        userId: 'user123',
        categoryId: 'category123',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-15'),
      };

      categoryModel.findOne.mockResolvedValue(mockCategory);
      budgetModel.findOne.mockResolvedValue(existingBudget);

      await expect(createBudget(budgetData)).rejects.toThrow('Budget already exists for this category in the specified date range');
    });
  });

  describe('getBudgetById', () => {
    it('should return budget by ID', async () => {
      const budgetId = 'budget123';
      const userId = 'user123';

      const mockBudget = {
        _id: budgetId,
        userId,
        name: 'Monthly Food Budget',
        amount: 500,
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({
          _id: budgetId,
          userId,
          name: 'Monthly Food Budget',
          amount: 500,
        }),
      };

      budgetModel.findOne.mockReturnValue(mockBudget);

      const result = await getBudgetById(budgetId, userId);

      expect(budgetModel.findOne).toHaveBeenCalledWith({
        _id: budgetId,
        userId,
        deleted: false,
      });
      expect(result).toEqual({
        _id: budgetId,
        userId,
        name: 'Monthly Food Budget',
        amount: 500,
      });
    });

    it('should throw error if budget not found', async () => {
      const budgetId = 'budget123';
      const userId = 'user123';

      const mockBudget = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      };

      budgetModel.findOne.mockReturnValue(mockBudget);

      await expect(getBudgetById(budgetId, userId)).rejects.toThrow('Budget not found');
    });
  });

  describe('getBudgets', () => {
    it('should return paginated budgets', async () => {
      const userId = 'user123';
      const filters = { page: 1, limit: 10 };

      const mockBudgets = [
        { _id: 'budget1', name: 'Budget 1', amount: 500 },
        { _id: 'budget2', name: 'Budget 2', amount: 300 },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockBudgets),
      };

      budgetModel.find.mockReturnValue(mockQuery);
      budgetModel.countDocuments.mockResolvedValue(2);

      const result = await getBudgets(userId, filters);

      expect(result).toEqual({
        budgets: mockBudgets,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 2,
          limit: 10,
        },
      });
    });
  });

  describe('updateBudget', () => {
    it('should update budget successfully', async () => {
      const budgetId = 'budget123';
      const userId = 'user123';
      const updateData = { name: 'Updated Budget', amount: 600 };

      const mockBudget = {
        _id: budgetId,
        userId,
        categoryId: 'category123',
        name: 'Original Budget',
        amount: 500,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        deleted: false,
      };

      const updatedBudget = {
        _id: budgetId,
        userId,
        categoryId: 'category123',
        name: 'Updated Budget',
        amount: 600,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({
          _id: budgetId,
          userId,
          categoryId: 'category123',
          name: 'Updated Budget',
          amount: 600,
        }),
      };

      budgetModel.findOne.mockResolvedValue(mockBudget);
      budgetModel.findOne.mockResolvedValueOnce(mockBudget).mockResolvedValueOnce(null); // No overlapping budget
      budgetModel.findByIdAndUpdate.mockReturnValue(updatedBudget);

      const result = await updateBudget(budgetId, userId, updateData);

      expect(result).toEqual({
        _id: budgetId,
        userId,
        categoryId: 'category123',
        name: 'Updated Budget',
        amount: 600,
      });
    });

    it('should throw error if budget not found', async () => {
      const budgetId = 'budget123';
      const userId = 'user123';
      const updateData = { name: 'Updated Budget' };

      budgetModel.findOne.mockResolvedValue(null);

      await expect(updateBudget(budgetId, userId, updateData)).rejects.toThrow('Budget not found');
    });
  });

  describe('deleteBudget', () => {
    it('should soft delete budget successfully', async () => {
      const budgetId = 'budget123';
      const userId = 'user123';

      const mockBudget = {
        _id: budgetId,
        userId,
        deleted: false,
        deletedAt: null,
        save: jest.fn().mockResolvedValue({
          _id: budgetId,
          userId,
          deleted: true,
          deletedAt: new Date(),
        }),
      };

      budgetModel.findOne.mockResolvedValue(mockBudget);

      const result = await deleteBudget(budgetId, userId);

      expect(mockBudget.deleted).toBe(true);
      expect(mockBudget.deletedAt).toBeInstanceOf(Date);
      expect(mockBudget.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Budget deleted successfully' });
    });

    it('should throw error if budget not found', async () => {
      const budgetId = 'budget123';
      const userId = 'user123';

      budgetModel.findOne.mockResolvedValue(null);

      await expect(deleteBudget(budgetId, userId)).rejects.toThrow('Budget not found');
    });
  });

  describe('getBudgetStats', () => {
    it('should return budget statistics', async () => {
      const userId = 'user123';

      const mockBudgets = [
        {
          _id: 'budget1',
          name: 'Food Budget',
          amount: 500,
          period: 'monthly',
          isActive: true,
          categoryId: { name: 'Food', color: '#FF5733', icon: 'restaurant' },
        },
        {
          _id: 'budget2',
          name: 'Transport Budget',
          amount: 300,
          period: 'monthly',
          isActive: true,
          categoryId: { name: 'Transport', color: '#3B82F6', icon: 'car' },
        },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockBudgets),
      };

      budgetModel.find.mockReturnValue(mockQuery);

      const result = await getBudgetStats(userId);

      expect(result).toEqual({
        totalBudgets: 2,
        activeBudgets: 2,
        totalBudgetAmount: 800,
        periodStats: { monthly: 2 },
        categoryStats: { Food: 500, Transport: 300 },
        budgets: expect.arrayContaining([
          expect.objectContaining({
            id: 'budget1',
            name: 'Food Budget',
            amount: 500,
            period: 'monthly',
            category: 'Food',
            color: '#FF5733',
          }),
          expect.objectContaining({
            id: 'budget2',
            name: 'Transport Budget',
            amount: 300,
            period: 'monthly',
            category: 'Transport',
            color: '#3B82F6',
          }),
        ]),
      });
    });
  });

  describe('getCurrentBudgets', () => {
    it('should return current active budgets', async () => {
      const userId = 'user123';

      const mockBudgets = [
        {
          _id: 'budget1',
          name: 'Current Food Budget',
          amount: 500,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          categoryId: { name: 'Food', color: '#FF5733' },
        },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockBudgets),
      };

      budgetModel.find.mockReturnValue(mockQuery);

      const result = await getCurrentBudgets(userId);

      expect(budgetModel.find).toHaveBeenCalledWith({
        userId,
        deleted: false,
        isActive: true,
        startDate: expect.any(Object),
        endDate: expect.any(Object),
      });
      expect(result).toEqual(mockBudgets);
    });
  });
});
