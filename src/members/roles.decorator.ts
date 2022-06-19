import { SetMetadata } from '@nestjs/common';
import { Role } from './entities/member.entity';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
