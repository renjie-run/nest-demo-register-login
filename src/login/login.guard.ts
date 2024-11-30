import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwt: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.header('authorization') || '';
    if (!authorization) {
      throw new UnauthorizedException('token is required');
    }

    const bearer = authorization.split(' ');
    const key = bearer[0];
    const token = bearer.length > 1 ? bearer[1] : '';
    if (key !== 'Bearer' || !token) {
      throw new UnauthorizedException('invalid token');
    }

    try {
      const info = this.jwt.verify(token);
      (request as any).user = info.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('token is expired, re-login is required');
    }
  }
}
