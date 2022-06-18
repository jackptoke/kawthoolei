import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateMemberInput } from './dto/create-member.input';
import { UpdateMemberInput } from './dto/update-member.input';
import { Member } from './entities/member.entity';
import { DeleteMemberPayload } from './dto/delete-member.payload';

@Injectable()
export class MembersService {
  private saltOrRound = 10;

  constructor(
    @InjectRepository(Member) private readonly membersRepo: Repository<Member>,
  ) {}

  getMembersBaseQuery() {
    return this.membersRepo.createQueryBuilder().orderBy('username', 'DESC');
  }

  private hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, this.saltOrRound);
  };

  async create(createMemberInput: CreateMemberInput): Promise<Member> {
    const member = await this.membersRepo.findOne({
      where: { email: createMemberInput.email },
    });
    if (member) throw new Error('Email already being used.');

    const newMember = new Member();
    newMember.email = createMemberInput.email;
    newMember.fullName = createMemberInput.fullName;
    newMember.gender = createMemberInput.gender;
    newMember.username = createMemberInput.username;
    newMember.imageUrl = createMemberInput.imageUrl;
    newMember.password = this.hashPassword(createMemberInput.password);

    const createdMember = this.membersRepo.create(newMember);

    return this.membersRepo.save(createdMember);
  }

  async findAll(): Promise<Member[]> {
    return this.membersRepo.find({
      relations: ['articles'],
      relationLoadStrategy: 'query',
    });
  }

  async findOne(username: string): Promise<Member> {
    return this.getMembersBaseQuery()
      .where('username = :username OR email = :username', {
        username: username,
      })
      .getOne();
  }

  async update(updateMemberInput: UpdateMemberInput) {
    const username = updateMemberInput.username;
    let { email, fullName, gender, password, imageUrl, isDeactivated } =
      updateMemberInput;
    const member = await this.findOne(username);
    if (!email) email = member.email;
    if (!fullName) fullName = member.fullName;
    if (gender === undefined) gender = member.gender;
    if (!password) password = member.password;
    else password = this.hashPassword(password);
    if (!imageUrl) imageUrl = member.imageUrl;
    if (isDeactivated === undefined) isDeactivated = member.isDeactivated;

    const updatedMember = await this.getMembersBaseQuery()
      .update(Member)
      .set({
        email: email,
        fullName: fullName,
        gender: gender,
        password: password,
        imageUrl: imageUrl,
        isDeactivated: isDeactivated,
      })
      .where('username = :username', { username: username })
      .execute();
    console.log('[update] ', updatedMember);

    return {
      email: email,
      fullName: fullName,
      gender: gender,
      password: password,
      imageUrl: imageUrl,
      isDeactivated: isDeactivated,
      username: username,
    };
  }

  async remove(username: string): Promise<DeleteMemberPayload> {
    const payload = new DeleteMemberPayload();
    payload.member = await this.findOne(username);
    if (payload.member === null)
      throw new Error(`Member with username ${username} doesn't exist.`);
    const result = await this.getMembersBaseQuery()
      .delete()
      .from(Member)
      .where('username = :username', { username: username })
      .execute();
    payload.numUids = result.affected;
    payload.msg =
      result.affected > 0
        ? `Member with username ${username} was deleted.`
        : `Failed to delete user with username ${username}`;
    return payload;
  }
}
