import { CreateMemberInput } from './create-member.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { Gender } from '../entities/member.entity';

@InputType()
export class UpdateMemberInput extends PartialType(CreateMemberInput) {
  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  isDeactivated?: boolean;
}
