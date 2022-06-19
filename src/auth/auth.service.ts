import { Inject, Injectable } from '@nestjs/common';
import { MembersService } from '../members/members.service';
import { LoginResponse } from './dto/login-response.payload';
import { Member } from '../members/entities/member.entity';
import { AuthenticationError } from 'apollo-server-express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MembersService) private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateMember(username: string, password: string): Promise<Member> {
    const member = await this.membersService.authenticateUser(
      username,
      password,
    );
    if (member) {
      //   const { password, ...result } = member;
      return member;
    }
    return null;
  }

  async login(member: Member): Promise<LoginResponse> {
    // const member = await this.membersService.authenticateUser(
    //   authInput.username,
    //   authInput.password,
    // );
    if (!member)
      throw new AuthenticationError(
        'Incorrect password or not a valid username',
      );
    return {
      access_token: this.jwtService.sign({
        username: member.username,
        role: member.role,
      }),
      member: member,
    };
  }
}
