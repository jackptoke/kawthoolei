import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: false })
  memberId: string;

  @Field(() => Int, { nullable: false })
  articleId: number;

  @Field(() => Int, { nullable: true })
  parentCommentId?: number;
}
