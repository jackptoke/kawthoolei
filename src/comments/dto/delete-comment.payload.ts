import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';

@ObjectType()
export class DeleteCommentPayload {
  @Field(() => Comment)
  comment: Comment;

  @Field()
  msg: string;

  @Field(() => Int)
  numUids: number;
}
