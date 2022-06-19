import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MembersService } from './members.service';
import { Member, Role } from './entities/member.entity';
import { CreateMemberInput } from './dto/create-member.input';
import { UpdateMemberInput } from './dto/update-member.input';
import { DeleteMemberPayload } from './dto/delete-member.payload';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.MODERATOR)
  findAll() {
    return this.membersService.findAll();
  }

  @Query(() => Member, { name: 'member' })
  findOne(@Args('username', { type: () => String }) username: string) {
    return this.membersService.findOne(username);
  }

  @Mutation(() => Member)
  @UseGuards(JwtAuthGuard)
  updateMember(
    @Args('updateMemberInput') updateMemberInput: UpdateMemberInput,
  ) {
    return this.membersService.update(updateMemberInput);
  }

  @Mutation(() => DeleteMemberPayload)
  @UseGuards(JwtAuthGuard)
  removeMember(
    @Args('username', { type: () => String }) username: string,
  ): Promise<DeleteMemberPayload> {
    return this.membersService.remove(username);
  }
}
