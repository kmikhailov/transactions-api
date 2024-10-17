import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Transaction } from './transaction.interface';

@ApiTags('transactions')
@Controller('transactions')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get mock transactions' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date for the transactions (ISO format)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date for the transactions (ISO format)' })
  @ApiQuery({ name: 'page', required: true, description: 'Page number for pagination' })
  getTransactions(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('page') page: string,
  ) {
    return this.appService.getTransactions(startDate, endDate, page);
  }

  @Post()
  @ApiOperation({ summary: 'Add a transaction' })
  @ApiBody({ description: 'Transaction details', required: true, type: Object })
  addTransaction(@Body() body: { userId: string; amount: number; type: 'earned' | 'spent' | 'payout' }): Transaction { // Define return type
    return this.appService.addTransaction(body.userId, body.amount, body.type);
  }
}
