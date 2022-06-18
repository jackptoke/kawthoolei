import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput {
  @Field(() => Int)
  commentId: number;

  @Field(() => String)
  message: string;

  @Field(() => String)
  memberId: string;
}
