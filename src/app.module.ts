import { Module } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { OrderBookModule } from './order-book/order-book.module';
import { OrderBookGateway } from './order-book/order-book.gateway';
import { CommentGateway } from './comment/comment.gateway';

@Module({
  imports: [
    OrderBookModule,
    CommentModule,
  ],
  controllers: [],
  providers: [OrderBookGateway, CommentGateway],
})
export class AppModule {}

// app.module importing all other resouces, modules, files, and gateway to connect to client side