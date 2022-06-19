import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from 'src/members/members.module';
import { Member } from '../members/entities/member.entity';
import { LocalStrategy } from './local.strategy';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from '../members/roles.guard';

@Module({
  imports: [
    PassportModule,
    MembersModule,
    TypeOrmModule.forFeature([Member]),
    JwtModule.register({
      signOptions: { expiresIn: '3h' },
      secret: process.env.KTL_PASS_HASH_KEY,
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
  ],
})
export class AuthModule {}
