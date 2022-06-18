import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Article } from '../../articles/entities/article.entity';

@Entity()
@ObjectType()
export class Comment {
  @Field(() => Int, {
    description: 'The unique identification number of a comment',
  })
  @PrimaryGeneratedColumn()
  commentId: number;

  @Field(() => String)
  @Column('text')
  message: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdDate: Date;

  @Field(() => Member, { nullable: false })
  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: 'memberId', referencedColumnName: 'username' })
  member: Member;

  @Field(() => Article, { nullable: false })
  @ManyToOne(() => Article, (article) => article.comments, { nullable: false })
  @JoinColumn({ name: 'articleId', referencedColumnName: 'articleId' })
  article: Article;

  @Field(() => Comment)
  @OneToMany(() => Comment, (childComment) => childComment.parentComment)
  childrenComments: Comment[];

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, (parentComment) => parentComment.childrenComments, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentCommentId', referencedColumnName: 'commentId' })
  parentComment?: Comment;
}
