import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Member } from '../entities/member.entity';
@ObjectType()
export class DeleteMemberPayload {
  @Field(() => Member)
  member: Member;

  @Field()
  msg: string;

  @Field(() => Int)
  numUids: number;
}
