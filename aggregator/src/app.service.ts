import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { Transaction } from './transaction.interface';

@Injectable()
export class AppService {
  private apiUrl = 'http://localhost:3001/transactions';
  private lastPollDate: Date = new Date();
  private aggregatedData = new Map<string, { balance: number; earned: number; spent: number; payout: number }>();

  constructor(private readonly httpService: HttpService) {}

  // Poll transactions API every minute
  @Cron('* * * * *')
  async pollTransactions() {
    let page = 1;
    let hasMorePages = true;
    const startDate = this.lastPollDate.toISOString();
    const endDate = new Date().toISOString();
    this.lastPollDate = new Date();

    while (hasMorePages) {
      const response = await this.httpService
        .get(`${this.apiUrl}`, {
          params: {
            startDate,
            endDate,
            page: page.toString(),
          },
        })
        .toPromise();
      const { items, meta } = response.data;

      // Process items without storing everything in memory
      this.processTransactions(items);

      if (meta.currentPage >= meta.totalPages || meta.itemsPerPage >= 1000) {
        hasMorePages = false;
      } else {
        page++;
      }
    }
  }

  // Process transactions for aggregation
  private processTransactions(transactions: Transaction[]) {
    transactions.forEach((transaction) => {
      this.updateAggregatedData(transaction);
    });
  }

  // Update aggregated data for each user
  private updateAggregatedData(transaction: Transaction) {
    const userId = transaction.userId;
    const userAggregate = this.aggregatedData.get(userId) || {
      balance: 0,
      earned: 0,
      spent: 0,
      payout: 0,
    };

    if (transaction.type === 'earned') {
      userAggregate.balance += transaction.amount;
      userAggregate.earned += transaction.amount;
    } else if (transaction.type === 'spent') {
      userAggregate.balance -= transaction.amount;
      userAggregate.spent += transaction.amount;
    } else if (transaction.type === 'payout') {
      userAggregate.balance -= transaction.amount;
      userAggregate.payout += transaction.amount;
    }

    this.aggregatedData.set(userId, userAggregate);
  }

  // Get aggregated data by user ID
  getAggregatedDataByUserId(userId: string) {
    const userAggregate = this.aggregatedData.get(userId);
    if (!userAggregate) {
      throw new NotFoundException(`Aggregated data for user ID ${userId} not found.`);
    }
    return userAggregate;
  }

  // Get payouts aggregated by user ID
  getRequestedPayoutsByUserId() {
    const payouts = [];
    this.aggregatedData.forEach((data, userId) => {
      if (data.payout > 0) {
        payouts.push({ userId, payoutAmount: data.payout });
      }
    });
    return payouts;
  }
}
