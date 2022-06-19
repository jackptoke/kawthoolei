import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.KTL_PASS_HASH_KEY,
      logging: true,
    });
  }

  async validate(payload: any) {
    // console.log('[JwtStrategy][validate] ', payload);
    return { username: payload.username, role: payload.role };
  }
}
