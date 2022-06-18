import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Member } from '../../members/entities/member.entity';
import { Comment } from 'src/comments/entities/comment.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CATEGORY {
  THOOLEI_NEWS,
  WORLD_NEWS,
  POLITICS,
  BUSINESS,
  SPORTNEWS,
  EDUCATION,
  HEALTH,
  ENVIRONMENT,
  OPINION,
  LIFESTYLE,
}

registerEnumType(CATEGORY, {
  name: 'CATEGORY',
  description: 'The category in which the article belong to',
});

@Entity()
@ObjectType()
export class Article {
  @Field(() => Int, {
    description: 'A unique identification number of the article',
  })
  @PrimaryGeneratedColumn()
  articleId: number;

  @Field(() => String, {
    description:
      'The title of the article that encourages readers to click the article',
  })
  @Column('text')
  title: string;

  @Field(() => String, { description: 'The content of the article.' })
  @Column('mediumtext')
  content: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdDate: Date;

  @Field(() => Date, { nullable: true })
  @Column('timestamp', { nullable: true })
  publishedDate?: Date;

  @Field(() => CATEGORY)
  @Column()
  category: CATEGORY;

  @Field(() => Member)
  @ManyToOne(() => Member, (member) => member.articles, { nullable: false })
  @JoinColumn({ name: 'authorId', referencedColumnName: 'username' })
  author: Member;

  @Field(() => [Comment], { nullable: 'items' })
  @OneToMany(() => Comment, (comment) => comment.article, { nullable: true })
  comments: Comment[];
}
