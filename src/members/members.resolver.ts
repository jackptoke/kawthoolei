import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { CreateMemberInput } from './dto/create-member.input';
import { UpdateMemberInput } from './dto/update-member.input';
import { DeleteMemberPayload } from './dto/delete-member.payload';

@Resolver(() => Member)
export class MembersResolver {
  constructor(private readonly membersService: MembersService) {}

  @Mutation(() => Member)
  createMember(
    @Args('createMemberInput') createMemberInput: CreateMemberInput,
  ) {
    return this.membersService.create(createMemberInput);
  }

  @Query(() => [Member], { name: 'members' })
  findAll() {
    return this.membersService.findAll();
  }

  @Query(() => Member, { name: 'member' })
  findOne(@Args('username', { type: () => String }) username: string) {
    return this.membersService.findOne(username);
  }

  @Mutation(() => Member)
  updateMember(
    @Args('updateMemberInput') updateMemberInput: UpdateMemberInput,
  ) {
    return this.membersService.update(updateMemberInput);
  }

  @Mutation(() => DeleteMemberPayload)
  removeMember(
    @Args('username', { type: () => String }) username: string,
  ): Promise<DeleteMemberPayload> {
    return this.membersService.remove(username);
  }
}
