import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { MembersService } from '../members/members.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlesService } from '../articles/articles.service';
import { Comment } from './entities/comment.entity';
import { DeleteCommentInput } from './dto/delete-comment.input';
import { DeleteCommentPayload } from './dto/delete-comment.payload';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(MembersService) private readonly membersService: MembersService,
    @Inject(ArticlesService) private readonly articlesService: ArticlesService,
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
  ) {}

  getCommentsBaseQuery() {
    return this.commentsRepo.createQueryBuilder().orderBy('commentId', 'DESC');
  }

  async create(createCommentInput: CreateCommentInput) {
    const { memberId, articleId, message, parentCommentId } =
      createCommentInput;
    const member = await this.membersService.findOne(memberId);
    const article = await this.articlesService.findOne(articleId);
    let parentComment: Comment = null;
    if (parentCommentId) parentComment = await this.findOne(parentCommentId);

    const newComment = new Comment();
    newComment.article = article;
    newComment.member = member;
    newComment.parentComment = parentComment;
    newComment.message = message;

    const comment = await this.commentsRepo.create(newComment);

    return await this.commentsRepo.save(comment);
  }

  async findAll(articleId: number): Promise<Comment[]> {
    return await this.commentsRepo.find({
      where: { article: { articleId: articleId } },
      relations: ['childrenComments'],
    });
  }

  async findOne(commentId: number): Promise<Comment> {
    return this.getCommentsBaseQuery()
      .where('commentId = :commentId', {
        commentId: commentId,
      })
      .getOne();
  }

  async findAllParentComments(articleId: number): Promise<Comment[]> {
    return await this.getCommentsBaseQuery()
      .where('articleId = :articleId AND parentCommentId = NULL', {
        articleId: articleId,
      })
      .getMany();
  }

  async update(updateCommentInput: UpdateCommentInput) {
    const result = await this.getCommentsBaseQuery()
      .update(Comment)
      .set({ message: updateCommentInput.message })
      .where('commentId = :commentId AND member.username = :memberId', {
        commentId: updateCommentInput.commentId,
        memberId: updateCommentInput.memberId,
      })
      .execute();
    console.log('[updateComment] ', result);

    return this.findOne(updateCommentInput.commentId);
  }

  async remove(
    deleteCommentInput: DeleteCommentInput,
  ): Promise<DeleteCommentPayload> {
    const { commentId, memberId } = deleteCommentInput;
    const comment = await this.findOne(commentId);
    if (!comment)
      throw new Error('The comment you are trying to delete does not exist.');
    const { affected } = await this.getCommentsBaseQuery()
      .softDelete()
      .from(Comment)
      .where('commentId = :commentId AND member.username = :memberId', {
        commentId: commentId,
        memberId: memberId,
      })
      .execute();

    const payload = new DeleteCommentPayload();
    payload.numUids = affected;
    if (affected > 0)
      payload.msg = `Comment id ${commentId} has been successfully deleted`;
    else payload.msg = `Failed to delete comment with id ${commentId}`;
    payload.comment = comment;
    return payload;
  }
}
