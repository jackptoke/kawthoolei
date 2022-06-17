import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

export enum Gender {
  MALE,
  FEMALE,
}

registerEnumType(Gender, {
  name: 'Gender',
  description: 'Whether the person is a male or female.',
});

@Entity()
@ObjectType()
export class Member {
  @Field()
  @PrimaryColumn({ length: 15 })
  username: string;

  @Field()
  @PrimaryColumn()
  email: string;

  @Field()
  @Column()
  fullName: string;

  @Column()
  password: string;

  @Field(() => Gender)
  @Column()
  gender: Gender;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isDeactivated: boolean;

  @Field(() => [Article], { nullable: 'items' })
  @OneToMany(() => Article, (article) => article.author, { nullable: true })
  articles: Article[];
}
