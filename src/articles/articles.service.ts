import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { MembersService } from '../members/members.service';
import { DeleteArticlePayload } from './dto/delete-article.payload';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @Inject(MembersService) private readonly membersService: MembersService,
  ) {}

  private getArticlesBaseQuery() {
    return this.articleRepo
      .createQueryBuilder()
      .orderBy('publishedDate', 'DESC');
  }

  async create(createArticleInput: CreateArticleInput): Promise<Article> {
    //First check if the author id is valid
    const author = await this.membersService.findOne(
      createArticleInput.authorId,
    );
    if (!author)
      throw new Error('A valid authorId is needed to create an article');
    const article = new Article();
    article.title = createArticleInput.title.trim();
    article.content = createArticleInput.content.trim();
    article.category = createArticleInput.category;
    article.author = author;
    if (createArticleInput.publish)
      article.publishedDate = new Date(Date.now());
    const newArticle = this.articleRepo.create(article);
    return this.articleRepo.save(newArticle);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepo.find({
      relations: [
        'author',
        'comments',
        'comments.member',
        'comments.childrenComments',
        'comments.childrenComments.member',
      ],
      relationLoadStrategy: 'query',
    });
  }

  async findOne(id: number): Promise<Article> {
    return await this.getArticlesBaseQuery()
      .where('articleId = :articleId', {
        articleId: id,
      })
      .getOne();
  }

  /*
    An article's content, title, publishedDate and category can be changed, 
    but not its author, created date and children.
  */

  async update(updateArticleInput: UpdateArticleInput) {
    const { articleId, title, content, category, publish } = updateArticleInput;
    const article = await this.findOne(articleId);
    if (!(article && title && content))
      throw new Error(
        `The article with id ${articleId} you are trying to edit doesn't exist`,
      );

    if (publish) {
      article.publishedDate = new Date(Date.now());
    }

    article.title = title;
    article.content = content;
    article.category = category;
    await this.getArticlesBaseQuery()
      .update(Article)
      .set({
        title: title,
        content: content,
        publishedDate: article.publishedDate,
      })
      .where('articleId = :articleId', { articleId: articleId })
      .execute();
    return article;
  }

  /*
  Soft deleting the article
  */

  async remove(articleId: number): Promise<DeleteArticlePayload> {
    const article = await this.findOne(articleId);
    if (!article)
      throw new Error(`Article with id ${articleId} doesn't exist.`);
    const payload = new DeleteArticlePayload();
    const result = await this.getArticlesBaseQuery()
      .softDelete()
      .from(Article)
      .where('articleId = :articleId', { articleId: articleId })
      .execute();

    payload.article = article;
    payload.msg = `Article with id ${articleId} successfully deleted`;
    payload.numUids = result.affected;
    return payload;
  }
}
