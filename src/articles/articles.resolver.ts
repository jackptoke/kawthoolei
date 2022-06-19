import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Article)
export class ArticlesResolver {
  constructor(private readonly articlesService: ArticlesService) {}

  @Mutation(() => Article)
  @UseGuards(JwtAuthGuard)
  createArticle(
    @Args('createArticleInput') createArticleInput: CreateArticleInput,
    @Context() context,
  ) {
    console.log('[context]: ', context.req.user);

    return this.articlesService.create(createArticleInput);
  }

  @Query(() => [Article], { name: 'articles' })
  findAll() {
    return this.articlesService.findAll();
  }

  @Query(() => Article, { name: 'article' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.articlesService.findOne(id);
  }

  @Mutation(() => Article)
  @UseGuards(JwtAuthGuard)
  updateArticle(
    @Args('updateArticleInput') updateArticleInput: UpdateArticleInput,
  ) {
    return this.articlesService.update(updateArticleInput);
  }

  @Mutation(() => Article)
  @UseGuards(JwtAuthGuard)
  removeArticle(@Args('id', { type: () => Int }) id: number) {
    return this.articlesService.remove(id);
  }
}
