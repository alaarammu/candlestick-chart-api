import { Injectable } from '@nestjs/common';
import { Comment } from './entities/comment.entity';

export class CreateCommentDto {
  text: string;
}

@Injectable()
export class CommentService {
  private comments: Comment[] = []; // store for comments
  private nextId = 1; // counts the IDs

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
