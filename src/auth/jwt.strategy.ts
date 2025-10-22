import { Branche, Level, Mention, Role } from '@/core/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';

const cookieExtractor = (req: FastifyRequest): string | null => {
  return req.cookies?.access_token || null;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: config.get('JWT_SECRET') as string,
    });
  }

  validate(payload: {
    sub: number;
    mention: Mention;
    level: Level;
    branche: Branche;
    role: Role;
  }) {
    return payload;
  }
}
