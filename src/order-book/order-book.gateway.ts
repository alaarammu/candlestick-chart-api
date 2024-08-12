import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderBookService } from './order-book.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrderBookGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private intervalId: NodeJS.Timeout;

  constructor(private readonly orderBookService: OrderBookService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
    this.intervalId = setInterval(async () => {
      const orderBookData = await this.orderBookService.fetchOrderBookData();
      this.server.emit('orderBookUpdate', orderBookData);
    }, 5000); 
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('subscribeOrderBook')
  async handleSubscribeOrderBook(client: Socket) {
    const orderBookData = await this.orderBookService.fetchOrderBookData();
    client.emit('orderBookUpdate', orderBookData);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
