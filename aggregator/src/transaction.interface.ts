export interface Transaction {
    id: string;
    userId: string;
    createdAt: string;
    type: 'earned' | 'spent' | 'payout';
    amount: number;
  }
  