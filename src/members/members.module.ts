import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersResolver } from './members.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MembersResolver, MembersService],
  exports: [MembersService],
})
export class MembersModule {}
