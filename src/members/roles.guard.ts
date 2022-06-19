import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from './entities/member.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) return true;

    const gqlContext = GqlExecutionContext.create(context);
    const user = gqlContext.getContext().req.user;
    console.log('[RolesGuard][user]: ', user);
    console.log('[RolesGuard][requiredRoles]: ', requireRoles);

    return requireRoles.some((role) => user?.role === role);
  }
}
