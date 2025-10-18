import { jest } from '@jest/globals';
import {
  createTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../../src/services/transactionService.js';
import { transactionModel } from '../../src/models/transactionModel.js';

// Mock transactionModel
jest.mock('../../src/models/transactionModel.js', () => ({
  transactionModel: {
    findOne: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    prototype: {
      save: jest.fn(),
      populate: jest.fn()
    }
  }
}));

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    const mockTransactionData = {
      userId: 'user123',
      type: 'expense',
      category: 'Food',
      amount: 25.50,
      description: 'Lunch at restaurant',
      date: new Date('2023-01-15'),
      tags: ['food', 'lunch'],
      relatedTransactionId: null,
      paymentMethod: 'credit_card',
      location: 'Restaurant ABC'
    };

    const mockSavedTransaction = {
      _id: 'transaction123',
      ...mockTransactionData,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15'),
      populate: jest.fn()
    };

    test('should successfully create a new transaction', async () => {
      // Arrange
      const mockNewTransaction = {
        ...mockTransactionData,
        save: jest.fn().mockResolvedValue(mockSavedTransaction)
      };
      
      const TransactionConstructor = jest.fn().mockImplementation(() => mockNewTransaction);
      transactionModel.mockImplementation(TransactionConstructor);
      
      mockSavedTransaction.populate.mockResolvedValue(mockSavedTransaction);

      // Act
      const result = await createTransaction(mockTransactionData);

      // Assert
      expect(TransactionConstructor).toHaveBeenCalledWith({
        userId: 'user123',
        type: 'expense',
        category: 'Food',
        amount: 25.50,
        description: 'Lunch at restaurant',
        date: mockTransactionData.date,
        tags: ['food', 'lunch'],
        relatedTransactionId: null,
        paymentMethod: 'credit_card',
        location: 'Restaurant ABC'
      });
      expect(mockNewTransaction.save).toHaveBeenCalled();
      expect(mockSavedTransaction.populate).toHaveBeenCalledWith({
        path: 'userId',
        select: 'firstName lastName email'
      });
      expect(result).toBe(mockSavedTransaction);
    });

    test('should create transaction with default values when optional fields are not provided', async () => {
      // Arrange
      const minimalTransactionData = {
        userId: 'user123',
        type: 'income',
        category: 'Salary',
        amount: 5000,
        description: 'Monthly salary'
      };

      const mockNewTransaction = {
        ...minimalTransactionData,
        save: jest.fn().mockResolvedValue(mockSavedTransaction)
      };
      
      const TransactionConstructor = jest.fn().mockImplementation(() => mockNewTransaction);
      transactionModel.mockImplementation(TransactionConstructor);
      
      mockSavedTransaction.populate.mockResolvedValue(mockSavedTransaction);

      // Act
      const result = await createTransaction(minimalTransactionData);

      // Assert
      expect(TransactionConstructor).toHaveBeenCalledWith({
        userId: 'user123',
        type: 'income',
        category: 'Salary',
        amount: 5000,
        description: 'Monthly salary',
        date: expect.any(Date),
        tags: [],
        relatedTransactionId: undefined,
        paymentMethod: undefined,
        location: undefined
      });
    });

    test('should handle transaction save error', async () => {
      // Arrange
      const mockNewTransaction = {
        ...mockTransactionData,
        save: jest.fn().mockRejectedValue(new Error('Save error'))
      };
      
      const TransactionConstructor = jest.fn().mockImplementation(() => mockNewTransaction);
      transactionModel.mockImplementation(TransactionConstructor);

      // Act & Assert
      await expect(createTransaction(mockTransactionData)).rejects.toThrow('Save error');
    });
  });

  describe('getTransactionById', () => {
    const mockTransaction = {
      _id: 'transaction123',
      userId: 'user123',
      type: 'expense',
      category: 'Food',
      amount: 25.50,
      description: 'Lunch',
      date: new Date('2023-01-15'),
      tags: ['food'],
      paymentMethod: 'credit_card',
      location: 'Restaurant'
    };

    test('should successfully get transaction by ID', async () => {
      // Arrange
      const mockQuery = {
        findOne: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockTransaction)
          })
        })
      };
      
      transactionModel.findOne.mockReturnValue(mockQuery);

      // Act
      const result = await getTransactionById('transaction123', 'user123');

      // Assert
      expect(transactionModel.findOne).toHaveBeenCalledWith({
        _id: 'transaction123',
        userId: 'user123',
        deleted: false
      });
      expect(result).toBe(mockTransaction);
    });

    test('should throw error when transaction not found', async () => {
      // Arrange
      const mockQuery = {
        findOne: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
          })
        })
      };
      
      transactionModel.findOne.mockReturnValue(mockQuery);

      // Act & Assert
      await expect(getTransactionById('nonexistent', 'user123')).rejects.toThrow('Transaction not found');
    });
  });

  describe('getTransactions', () => {
    const mockTransactions = [
      {
        _id: 'transaction1',
        userId: 'user123',
        type: 'expense',
        category: 'Food',
        amount: 25.50,
        description: 'Lunch',
        date: new Date('2023-01-15')
      },
      {
        _id: 'transaction2',
        userId: 'user123',
        type: 'income',
        category: 'Salary',
        amount: 5000,
        description: 'Monthly salary',
        date: new Date('2023-01-01')
      }
    ];

    test('should get transactions with default pagination', async () => {
      // Arrange
      const mockQuery = {
        find: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  lean: jest.fn().mockResolvedValue(mockTransactions)
                })
              })
            })
          })
        })
      };
      
      transactionModel.find.mockReturnValue(mockQuery);
      transactionModel.countDocuments.mockResolvedValue(2);

      // Act
      const result = await getTransactions('user123');

      // Assert
      expect(transactionModel.find).toHaveBeenCalledWith({
        userId: 'user123',
        deleted: false
      });
      expect(result).toEqual({
        transactions: mockTransactions,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 2,
          limit: 10
        }
      });
    });

    test('should get transactions with custom filters and pagination', async () => {
      // Arrange
      const filters = {
        type: 'expense',
        category: 'Food',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        minAmount: 10,
        maxAmount: 100,
        page: 2,
        limit: 5,
        sortBy: 'amount',
        sortOrder: 'asc'
      };

      const mockQuery = {
        find: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  lean: jest.fn().mockResolvedValue(mockTransactions)
                })
              })
            })
          })
        })
      };
      
      transactionModel.find.mockReturnValue(mockQuery);
      transactionModel.countDocuments.mockResolvedValue(15);

      // Act
      const result = await getTransactions('user123', filters);

      // Assert
      expect(transactionModel.find).toHaveBeenCalledWith({
        userId: 'user123',
        deleted: false,
        type: 'expense',
        category: { $regex: 'Food', $options: 'i' },
        date: {
          $gte: new Date('2023-01-01'),
          $lte: new Date('2023-01-31')
        },
        amount: {
          $gte: 10,
          $lte: 100
        }
      });
      expect(result.pagination).toEqual({
        currentPage: 2,
        totalPages: 3,
        totalCount: 15,
        limit: 5
      });
    });

    test('should handle empty results', async () => {
      // Arrange
      const mockQuery = {
        find: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  lean: jest.fn().mockResolvedValue([])
                })
              })
            })
          })
        })
      };
      
      transactionModel.find.mockReturnValue(mockQuery);
      transactionModel.countDocuments.mockResolvedValue(0);

      // Act
      const result = await getTransactions('user123');

      // Assert
      expect(result).toEqual({
        transactions: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          limit: 10
        }
      });
    });
  });

  describe('updateTransaction', () => {
    const mockUpdateData = {
      amount: 30.00,
      description: 'Updated lunch'
    };

    const mockUpdatedTransaction = {
      _id: 'transaction123',
      userId: 'user123',
      type: 'expense',
      category: 'Food',
      amount: 30.00,
      description: 'Updated lunch',
      date: new Date('2023-01-15')
    };

    test('should successfully update transaction', async () => {
      // Arrange
      const mockTransaction = {
        _id: 'transaction123',
        userId: 'user123',
        deleted: false
      };

      transactionModel.findOne.mockResolvedValue(mockTransaction);
      transactionModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUpdatedTransaction)
      });

      // Act
      const result = await updateTransaction('transaction123', 'user123', mockUpdateData);

      // Assert
      expect(transactionModel.findOne).toHaveBeenCalledWith({
        _id: 'transaction123',
        userId: 'user123',
        deleted: false
      });
      expect(transactionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'transaction123',
        mockUpdateData,
        { new: true }
      );
      expect(result).toBe(mockUpdatedTransaction);
    });

    test('should throw error when transaction not found', async () => {
      // Arrange
      transactionModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(updateTransaction('nonexistent', 'user123', mockUpdateData))
        .rejects.toThrow('Transaction not found');
    });
  });

  describe('deleteTransaction', () => {
    test('should successfully delete transaction (soft delete)', async () => {
      // Arrange
      const mockTransaction = {
        _id: 'transaction123',
        userId: 'user123',
        deleted: false,
        save: jest.fn().mockResolvedValue()
      };

      transactionModel.findOne.mockResolvedValue(mockTransaction);

      // Act
      const result = await deleteTransaction('transaction123', 'user123');

      // Assert
      expect(transactionModel.findOne).toHaveBeenCalledWith({
        _id: 'transaction123',
        userId: 'user123',
        deleted: false
      });
      expect(mockTransaction.deleted).toBe(true);
      expect(mockTransaction.deletedAt).toBeInstanceOf(Date);
      expect(mockTransaction.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Transaction deleted successfully' });
    });

    test('should throw error when transaction not found', async () => {
      // Arrange
      transactionModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(deleteTransaction('nonexistent', 'user123'))
        .rejects.toThrow('Transaction not found');
    });

    test('should handle save error during soft delete', async () => {
      // Arrange
      const mockTransaction = {
        _id: 'transaction123',
        userId: 'user123',
        deleted: false,
        save: jest.fn().mockRejectedValue(new Error('Save error'))
      };

      transactionModel.findOne.mockResolvedValue(mockTransaction);

      // Act & Assert
      await expect(deleteTransaction('transaction123', 'user123'))
        .rejects.toThrow('Save error');
    });
  });
});
