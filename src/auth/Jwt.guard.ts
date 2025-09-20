/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

export class JwtGuard implements CanActivate {
  constructor(private JwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.JwtService.verifyAsync(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
