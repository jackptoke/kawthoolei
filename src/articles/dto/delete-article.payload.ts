import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Article } from '../entities/article.entity';

@ObjectType()
export class DeleteArticlePayload {
  @Field(() => Article)
  article: Article;

  @Field()
  msg: string;

  @Field(() => Int)
  numUids: number;
}
