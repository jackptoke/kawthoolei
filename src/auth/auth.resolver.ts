import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthInput } from './dto/auth.input';
import { LoginResponse } from './dto/login-response.payload';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse, { name: 'login' })
  @UseGuards(GqlAuthGuard)
  login(
    @Args('authInput', { type: () => AuthInput }) authInput: AuthInput,
    @Context() context,
  ) {
    return this.authService.login(context.user);
  }
}
