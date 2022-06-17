import { InputType, Field } from '@nestjs/graphql';
import { Gender } from '../entities/member.entity';

@InputType()
export class CreateMemberInput {
  @Field()
  username: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Gender)
  gender: Gender;

  @Field({ nullable: true })
  imageUrl?: string;
}
