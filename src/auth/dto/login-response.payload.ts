import { Field, ObjectType } from '@nestjs/graphql';
import { Member } from '../../members/entities/member.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field(() => Member)
  member: Member;
}
