import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from './transaction.interface';

@Injectable()
export class AppService {
  private transactions: Transaction[] = [];

  getTransactions(startDate: string, endDate: string, page: string) {
    const filteredTransactions = this.transactions.filter((transaction) => {
      const createdAt = new Date(transaction.createdAt).getTime();
      return createdAt >= new Date(startDate).getTime() && createdAt <= new Date(endDate).getTime();
    });

    const itemsPerPage = 10;
    const currentPage = parseInt(page, 10);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    const meta = {
      totalItems: filteredTransactions.length,
      itemCount: paginatedTransactions.length,
      itemsPerPage,
      totalPages: Math.ceil(filteredTransactions.length / itemsPerPage),
      currentPage,
    };

    return {
      items: paginatedTransactions,
      meta,
    };
  }

  addTransaction(userId: string, amount: number, type: 'earned' | 'spent' | 'payout') {
    const newTransaction: Transaction = {
      id: uuidv4(),
      userId,
      createdAt: new Date().toISOString(),
      type,
      amount,
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }
}
