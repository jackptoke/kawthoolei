import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

export enum Gender {
  MALE,
  FEMALE,
}

export enum Role {
  REGULAR = 'Regular',
  EDITOR = 'Editor',
  MODERATOR = 'Moderator',
  SUPERADMIN = 'Super',
}

registerEnumType(Gender, {
  name: 'Gender',
  description: 'Whether the person is a male or female.',
});

registerEnumType(Role, {
  name: 'Role',
  description: `Regular member can read, create article and edit 
his/her own article.  Editor can edit other people's articles, as well as do what regular member can do.  
Moderator doesn't edit but can unpublish article and move it to other category.`,
});

@Entity()
@ObjectType()
export class Member {
  @Field()
  @PrimaryColumn({ length: 15 })
  username: string;

  @Field()
  @Column()
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

  @Field(() => Role)
  @Column({ default: Role.REGULAR })
  role: Role;

  @Field(() => [Article], { nullable: 'items' })
  @OneToMany(() => Article, (article) => article.author, { nullable: true })
  articles: Article[];
}
