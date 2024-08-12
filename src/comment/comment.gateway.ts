import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentService } from './comment.service';

// Define gateway
@WebSocketGateway({ cors: { origin: '*' } })
export class CommentGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly commentService: CommentService) {}

  // Called when WebSocket server is initialized
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  // when a client connects
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    this.sendCommentsUpdate(); // Send initial comment list on connection
  }

  // when a client side disconnects
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Handle client subscribing to comments
  @SubscribeMessage('subscribeComments')
  async handleSubscribeComments(client: Socket) {
    const comments = await this.commentService.findAll();
    client.emit('commentsUpdate', comments);
  }

  // posting a new comment
  @SubscribeMessage('postComment')
  async handlePostComment(client: Socket, commentData: { text: string }) {
    const createdComment = await this.commentService.create({ text: commentData.text });
  
    this.server.emit('commentAdded', createdComment);
  }

  // client deleting a comment
  @SubscribeMessage('deleteComment')
  async handleDeleteComment(client: Socket, id: number) {
    await this.commentService.remove(id);
    this.sendCommentsUpdate(); 
  }

  // Send  updated list of comments
  private async sendCommentsUpdate() {
    const comments = await this.commentService.findAll();
    this.server.emit('commentsUpdate', comments);
  }
}
