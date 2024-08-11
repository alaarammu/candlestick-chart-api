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

// Define the gateway
@WebSocketGateway({ cors: { origin: '*' } })
export class CommentGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly commentService: CommentService) {}

  // Called when WebSocket server is initialized
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  // Called when a client connects
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    this.sendCommentsUpdate(); // Send initial comment list on connection
  }

  // Called when a client disconnects
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Handle client subscribing to comments
  @SubscribeMessage('subscribeComments')
  async handleSubscribeComments(client: Socket) {
    const comments = await this.commentService.findAll();
    client.emit('commentsUpdate', comments);
  }

  // Handle client posting a new comment
  @SubscribeMessage('postComment')
  async handlePostComment(client: Socket, commentData: { text: string }) {
    const createdComment = await this.commentService.create({ text: commentData.text });
    // Emit only the newly created comment
    this.server.emit('commentAdded', createdComment);
  }

  // Handle client deleting a comment
  @SubscribeMessage('deleteComment')
  async handleDeleteComment(client: Socket, id: number) {
    await this.commentService.remove(id);
    this.sendCommentsUpdate(); // Notify all clients of the updated comment list
  }

  // Send the updated list of comments to all connected clients
  private async sendCommentsUpdate() {
    const comments = await this.commentService.findAll();
    this.server.emit('commentsUpdate', comments);
  }
}
