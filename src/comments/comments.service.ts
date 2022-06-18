import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

@Injectable()
export class CommentsService {
  create(createCommentInput: CreateCommentInput) {
    return 'This action adds a new comment';
  }

  createCommentWithAParent(createCommentInput: CreateCommentInput) {
    return '...';
  }

  findAll(articleId: number) {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  findAllParents() {
    return `This action returns all comments`;
  }

  findAllChildren() {
    return `...`;
  }

  update(id: number, updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
