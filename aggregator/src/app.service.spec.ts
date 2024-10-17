// Import necessary modules
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const mockHttpService = {
  get: jest.fn(),
};

describe('TransactionsService', () => {
  let service: AppService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAggregatedDataByUserId', () => {
    it('should return aggregated data for an existing user', () => {
      const userId = 'user123';
      service['aggregatedData'].set(userId, {
        balance: 100,
        earned: 150,
        spent: 50,
        payout: 0,
      });

      const result = service.getAggregatedDataByUserId(userId);
      expect(result).toEqual({
        balance: 100,
        earned: 150,
        spent: 50,
        payout: 0,
      });
    });

    it('should throw NotFoundException if user data is not found', () => {
      expect(() => service.getAggregatedDataByUserId('nonExistentUser')).toThrow(NotFoundException);
    });
  });

  describe('getRequestedPayoutsByUserId', () => {
    it('should return a list of users with their payout amounts', () => {
      service['aggregatedData'].set('user123', {
        balance: 100,
        earned: 150,
        spent: 50,
        payout: 20,
      });
      service['aggregatedData'].set('user456', {
        balance: 200,
        earned: 250,
        spent: 50,
        payout: 0,
      });

      const result = service.getRequestedPayoutsByUserId();
      expect(result).toEqual([{ userId: 'user123', payoutAmount: 20 }]);
    });
  });

  describe('pollTransactions', () => {
    it('should poll transactions and update aggregated data', async () => {
      const mockApiResponse = {
        data: {
          items: [
            {
              id: uuidv4(),
              userId: 'user123',
              createdAt: new Date().toISOString(),
              type: 'earned',
              amount: 50,
            },
            {
              id: uuidv4(),
              userId: 'user123',
              createdAt: new Date().toISOString(),
              type: 'spent',
              amount: 20,
            },
          ],
          meta: {
            currentPage: 1,
            totalPages: 1,
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      await service.pollTransactions();

      const userAggregate = service['aggregatedData'].get('user123');
      expect(userAggregate).toEqual({
        balance: 30,
        earned: 50,
        spent: 20,
        payout: 0,
      });
    });
  });
});
