import { Module } from '@nestjs/common';
import { OrderBookGateway } from './order-book.gateway';
import { OrderBookService } from './order-book.service';

@Module({
  providers: [OrderBookGateway, OrderBookService],
  exports: [OrderBookService],
})
export class OrderBookModule {}
