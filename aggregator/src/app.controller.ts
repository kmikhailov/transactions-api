import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('transactions')
@Controller('transactions')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get aggregated data by user ID' })
  @ApiResponse({ status: 200, description: 'Aggregated data retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Aggregated data for user ID not found.' })
  getAggregatedDataByUserId(@Param('userId') userId: string) {
    return this.appService.getAggregatedDataByUserId(userId);
  }

  @Get('payouts')
  @ApiOperation({ summary: 'Get requested payouts aggregated by user ID' })
  @ApiResponse({ status: 200, description: 'Payouts aggregated by user ID retrieved successfully.' })
  getRequestedPayoutsByUserId() {
    return this.appService.getRequestedPayoutsByUserId();
  }
}
