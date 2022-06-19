import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger();
  constructor(private readonly authService: AuthService) {
    super();
  }
  public async validate(username: string, password: string): Promise<any> {
    const member = this.authService.validateMember(username, password);
    if (!member) {
      this.logger.debug(`Invalid username or password`);
      throw new UnauthorizedException();
    }
    return member;
  }
}
