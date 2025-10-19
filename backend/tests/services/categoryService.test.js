import { jest } from '@jest/globals';

// Mock the category model
jest.unstable_mockModule('../src/models/categoryModel.js', () => {
  const mockCategoryModel = jest.fn();
  mockCategoryModel.findOne = jest.fn();
  mockCategoryModel.find = jest.fn();
  mockCategoryModel.findByIdAndUpdate = jest.fn();
  mockCategoryModel.countDocuments = jest.fn();

  return {
    categoryModel: mockCategoryModel,
    __esModule: true,
  }
});

const { categoryModel } = await import('../../src/models/categoryModel.js');
const {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryStats,
  updateCategory,
} = await import('../../src/services/categoryService.js');


describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a new category successfully', async () => {
      const categoryData = {
        userId: 'user123',
        name: 'Food & Dining',
        description: 'Expenses related to food',
        color: '#FF5733',
        icon: 'restaurant',
      };

      const mockCategory = {
        _id: 'category123',
        ...categoryData,
        isActive: true,
        deleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue({
          _id: 'category123',
          ...categoryData,
          isActive: true,
          deleted: false,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          populate: jest.fn().mockReturnThis(),
        }),
      };

      categoryModel.findOne = jest.fn().mockResolvedValue(null);
      categoryModel.mockImplementation(() => mockCategory);

      const result = await createCategory(categoryData);

      expect(categoryModel.findOne).toHaveBeenCalledWith({
        userId: 'user123',
        name: { $regex: /^Food & Dining$/i },
        deleted: false,
      });
      expect(result).toEqual(expect.objectContaining({
        _id: 'category123',
        name: 'Food & Dining',
        description: 'Expenses related to food',
        color: '#FF5733',
        icon: 'restaurant',
      }));
    });

    it('should throw error if category with same name exists', async () => {
      const categoryData = {
        userId: 'user123',
        name: 'Food & Dining',
      };

      const existingCategory = {
        _id: 'existing123',
        name: 'Food & Dining',
      };

      categoryModel.findOne = jest.fn().mockResolvedValue(existingCategory);

      await expect(createCategory(categoryData)).rejects.toThrow(
        'Category with this name already exists'
      );
    });
  });

  describe('getCategoryById', () => {
    it('should get category by ID successfully', async () => {
      const mockCategory = {
        _id: 'category123',
        userId: 'user123',
        name: 'Food & Dining',
        description: 'Expenses related to food',
        color: '#FF5733',
        icon: 'restaurant',
        isActive: true,
        deleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      categoryModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockCategory),
        }),
      });

      const result = await getCategoryById('category123', 'user123');

      expect(categoryModel.findOne).toHaveBeenCalledWith({
        _id: 'category123',
        userId: 'user123',
        deleted: false,
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw error if category not found', async () => {
      categoryModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(getCategoryById('category123', 'user123')).rejects.toThrow(
        'Category not found'
      );
    });
  });

  describe('getCategories', () => {
    it('should get categories with pagination', async () => {
      const mockCategories = [
        {
          _id: 'category123',
          name: 'Food & Dining',
          color: '#FF5733',
        },
        {
          _id: 'category456',
          name: 'Transportation',
          color: '#3B82F6',
        },
      ];

      const mockQuery = {
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCategories),
      };

      categoryModel.find = jest.fn().mockReturnValue(mockQuery);
      categoryModel.countDocuments = jest.fn().mockResolvedValue(2);

      const result = await getCategories('user123', { page: 1, limit: 10 });

      expect(result).toEqual({
        categories: mockCategories,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 2,
          limit: 10,
        },
      });
    });

    it('should apply search filter', async () => {
      const mockQuery = {
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      categoryModel.find = jest.fn().mockReturnValue(mockQuery);
      categoryModel.countDocuments = jest.fn().mockResolvedValue(0);

      await getCategories('user123', { search: 'food' });

      expect(categoryModel.find).toHaveBeenCalledWith({
        userId: 'user123',
        deleted: false,
        $or: [
          { name: { $regex: 'food', $options: 'i' } },
          { description: { $regex: 'food', $options: 'i' } },
        ],
      });
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const mockCategory = {
        _id: 'category123',
        name: 'Food & Dining',
        save: jest.fn(),
      };

      const updatedCategory = {
        _id: 'category123',
        name: 'Food & Groceries',
        description: 'Updated description',
        color: '#FF6B35',
      };

      categoryModel.findOne.mockResolvedValueOnce(mockCategory).mockResolvedValueOnce(undefined);
      categoryModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(updatedCategory),
        }),
      });

      const result = await updateCategory('category123', 'user123', {
        name: 'Food & Groceries',
        description: 'Updated description',
        color: '#FF6B35',
      });

      expect(result).toEqual(updatedCategory);
    });

    it('should throw error if category not found', async () => {
      categoryModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        updateCategory('category123', 'user123', { name: 'Updated' })
      ).rejects.toThrow('Category not found');
    });

    it('should throw error if name conflicts with existing category', async () => {
      const mockCategory = {
        _id: 'category123',
        name: 'Food & Dining',
      };

      const existingCategory = {
        _id: 'existing123',
        name: 'Food & Groceries',
      };

      categoryModel.findOne = jest.fn()
        .mockResolvedValueOnce(mockCategory) // First call for the category to update
        .mockResolvedValueOnce(existingCategory); // Second call for name conflict check

      await expect(
        updateCategory('category123', 'user123', { name: 'Food & Groceries' })
      ).rejects.toThrow('Category with this name already exists');
    });
  });

  describe('deleteCategory', () => {
    it('should soft delete category successfully', async () => {
      const mockCategory = {
        _id: 'category123',
        name: 'Food & Dining',
        deleted: false,
        deletedAt: null,
        save: jest.fn().mockResolvedValue(),
      };

      categoryModel.findOne = jest.fn().mockResolvedValue(mockCategory);

      const result = await deleteCategory('category123', 'user123');

      expect(mockCategory.deleted).toBe(true);
      expect(mockCategory.deletedAt).toBeInstanceOf(Date);
      expect(mockCategory.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Category deleted successfully' });
    });

    it('should throw error if category not found', async () => {
      categoryModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(deleteCategory('category123', 'user123')).rejects.toThrow(
        'Category not found'
      );
    });
  });

  describe('getCategoryStats', () => {
    it('should get category statistics successfully', async () => {
      const mockCategories = [
        {
          _id: 'category123',
          name: 'Food & Dining',
          color: '#FF5733',
          icon: 'restaurant',
          isActive: true,
        },
        {
          _id: 'category456',
          name: 'Transportation',
          color: '#3B82F6',
          icon: 'car',
          isActive: true,
        },
        {
          _id: 'category789',
          name: 'Inactive Category',
          color: '#6B7280',
          icon: 'inactive',
          isActive: false,
        },
      ];

      categoryModel.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockCategories),
        }),
      });

      const result = await getCategoryStats('user123');

      expect(result).toEqual({
        totalCategories: 3,
        activeCategories: 2,
        categories: mockCategories,
      });
    });
  });
});
