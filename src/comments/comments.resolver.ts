import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { DeleteCommentInput } from './dto/delete-comment.input';
import { DeleteCommentPayload } from './dto/delete-comment.payload';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentsService.create(createCommentInput);
  }

  @Query(() => [Comment], { name: 'comments' })
  findAll(@Args('articleId', { type: () => Int }) articleId: number) {
    return this.commentsService.findAll(articleId);
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('commentId', { type: () => Int }) commentId: number) {
    return this.commentsService.findOne(commentId);
  }

  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentsService.update(updateCommentInput);
  }

  @Mutation(() => DeleteCommentPayload)
  removeComment(
    @Args('deleteCommentInput', { type: () => DeleteCommentInput })
    deleteCommentInput: DeleteCommentInput,
  ) {
    return this.commentsService.remove(deleteCommentInput);
  }
}
