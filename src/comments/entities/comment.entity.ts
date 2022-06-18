import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Field(() => Date)
  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deleteDate: Date;

  @Field(() => Member, { nullable: false })
  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: 'memberId', referencedColumnName: 'username' })
  member: Member;

  @Field(() => Article, { nullable: false })
  @ManyToOne(() => Article, (article) => article.comments, { nullable: false })
  @JoinColumn({ name: 'articleId', referencedColumnName: 'articleId' })
  article: Article;

  @Field(() => [Comment], { nullable: 'items' })
  @OneToMany(() => Comment, (childComment) => childComment.parentComment, {
    nullable: true,
  })
  childrenComments: Comment[];

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, (parentComment) => parentComment.childrenComments, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: true,
  })
  @JoinColumn({ name: 'parentCommentId', referencedColumnName: 'commentId' })
  parentComment?: Comment;

  // @Field(() => Int, { nullable: true })
  // @Column({ nullable: true, default: null })
  // parentCommentId: number;
}
