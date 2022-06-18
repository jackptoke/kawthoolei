import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DeleteCommentInput {
  @Field(() => String)
  memberId: string;

  @Field(() => Int)
  commentId: number;
}
