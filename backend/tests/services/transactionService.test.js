import { jest, test } from '@jest/globals';

// Mock transactionModel
jest.unstable_mockModule('../src/models/transactionModel.js', () => {
  const mockTransactionModel = jest.fn();
  mockTransactionModel.findOne = jest.fn();
  mockTransactionModel.find = jest.fn();
  mockTransactionModel.countDocuments = jest.fn();
  mockTransactionModel.findByIdAndUpdate = jest.fn();

  return {
    transactionModel: mockTransactionModel,
    __esModule: true
  }
});

const { transactionModel } = await import('../../src/models/transactionModel.js');
const {
  createTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
  deleteTransaction
} = await import('../../src/services/transactionService.js');


describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    const mockTransactionData = {
      userId: 'user123',
      type: 'expense',
      categoryId: 'category123',
      amount: 25.50,
      description: 'Lunch at restaurant',
      date: new Date('2023-01-15'),
      tags: ['food', 'lunch'],
      accountId: 'account123'
    };

    const mockSavedTransaction = {
      _id: 'transaction123',
      ...mockTransactionData,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15'),
      populate: jest.fn()
    };

    it('should successfully create a new transaction', async () => {
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
        categoryId: 'category123',
        amount: 25.50,
        description: 'Lunch at restaurant',
        date: mockTransactionData.date,
        tags: ['food', 'lunch'],
        accountId: 'account123'
      });
      expect(mockNewTransaction.save).toHaveBeenCalled();
      expect(mockSavedTransaction.populate).toHaveBeenCalledWith([{
        path: 'userId',
        select: 'firstName lastName email'
      },
      {
        path: "accountId",
        select: "name type balance",
      },
      {
        path: "categoryId",
        select: "name description color icon",
      },
      ]);
      expect(result).toBe(mockSavedTransaction);
    });

    it('should create transaction with default values when optional fields are not provided', async () => {
      // Arrange
      const minimalTransactionData = {
        userId: 'user123',
        type: 'income',
        categoryId: 'category456',
        amount: 5000,
        description: 'Monthly salary',
        accountId: 'account456'
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
        categoryId: 'category456',
        amount: 5000,
        description: 'Monthly salary',
        date: expect.any(Date),
        tags: [],
        accountId: 'account456'
      });
    });

    it('should handle transaction save error', async () => {
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
      categoryId: 'category123',
      amount: 25.50,
      description: 'Lunch',
      date: new Date('2023-01-15'),
      tags: ['food'],
      accountId: 'account123'
    };

    it('should successfully get transaction by ID', async () => {
      // Arrange
      const mockReturnValue = {
        ...mockTransaction,
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockTransaction)
        })
      };

      transactionModel.findOne.mockReturnValue(mockReturnValue);

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

    it('should throw error when transaction not found', async () => {
      // Arrange
      const mockValue = {
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null)
        })
      };

      transactionModel.findOne.mockReturnValue(mockValue);

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
        categoryId: 'category123',
        amount: 25.50,
        description: 'Lunch',
        date: new Date('2023-01-15'),
        accountId: 'account123'
      },
      {
        _id: 'transaction2',
        userId: 'user123',
        type: 'income',
        categoryId: 'category456',
        amount: 5000,
        description: 'Monthly salary',
        date: new Date('2023-01-01'),
        accountId: 'account456'
      }
    ];

    it('should get transactions with default pagination', async () => {
      // Arrange
      const mockQuery = {
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockTransactions)
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

    it('should get transactions with custom filters and pagination', async () => {
      // Arrange
      const filters = {
        type: 'expense',
        categoryId: 'category123',
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
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockTransactions)
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
        categoryId: 'category123',
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

    it('should handle empty results', async () => {
      // Arrange
      const mockQuery = {
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([])
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
      categoryId: 'category123',
      amount: 30.00,
      description: 'Updated lunch',
      date: new Date('2023-01-15'),
      accountId: 'account123'
    };

    it('should successfully update transaction', async () => {
      // Arrange
      const mockTransaction = {
        _id: 'transaction123',
        userId: 'user123',
        deleted: false
      };

      transactionModel.findOne.mockResolvedValue(mockTransaction);
      transactionModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue(mockUpdatedTransaction)
        })
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

    it('should throw error when transaction not found', async () => {
      // Arrange
      transactionModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(updateTransaction('nonexistent', 'user123', mockUpdateData))
        .rejects.toThrow('Transaction not found');
    });
  });

  describe('deleteTransaction', () => {
    it('should successfully delete transaction (soft delete)', async () => {
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

    it('should throw error when transaction not found', async () => {
      // Arrange
      transactionModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(deleteTransaction('nonexistent', 'user123'))
        .rejects.toThrow('Transaction not found');
    });

    it('should handle save error during soft delete', async () => {
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
