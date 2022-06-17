import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Member } from '../../members/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  @Column()
  title: string;

  @Field(() => String, { description: 'The content of the article.' })
  @Column()
  content: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdDate: Date;

  @Field(() => Date)
  @Column('timestamp', { nullable: true })
  publishedDate?: Date;

  @Field(() => Member)
  @ManyToOne(() => Member, (member) => member.articles, { nullable: false })
  @JoinColumn({ name: 'authorId', referencedColumnName: 'username' })
  author: Member;
}
