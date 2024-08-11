import { Injectable } from '@nestjs/common';
import { Comment } from './entities/comment.entity';

// Define the DTO used for creating comments
export class CreateCommentDto {
  text: string;
}

@Injectable()
export class CommentService {
  private comments: Comment[] = []; // In-memory store for comments
  private nextId = 1; // Simple ID counter

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment: Comment = {
      id: this.nextId++,
      text: createCommentDto.text,
      createdAt: new Date().toISOString(),
    };
    this.comments.push(comment);
    return comment;
  }

  async findAll(): Promise<Comment[]> {
    return this.comments;
  }

  async remove(id: number): Promise<void> {
    this.comments = this.comments.filter(comment => comment.id !== id);
  }
}
