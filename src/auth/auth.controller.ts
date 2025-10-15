import { FastifyReply } from 'fastify';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './login.dto';
import { FastifyRequest } from 'fastify/types/request';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { status, token, payload } = await this.service.callSignIn(loginData);
    const refreshToken = await this.service.generateRefreshToken(payload);

    const MINUTE_EXPIRATION = 15 * 60;
    const DAYS_EXPIRATION = 7 * 24 * 60 * 60;

    reply.setCookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: MINUTE_EXPIRATION,
    });

    reply.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: DAYS_EXPIRATION,
    });

    return { status };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) reply: FastifyReply) {
    reply.clearCookie('access_token', { path: '/' });
    reply.clearCookie('refresh_token', { path: '/' });
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const refreshToken: string | undefined = req.cookies['refresh_token'];
    if (!refreshToken) throw new BadRequestException('Refresh token not found');

    const result = await this.service.verifyToken(refreshToken);

    const payload = {
      sub: result.sub,
      role: result.role,
      mention: result.mention,
      level: result.level,
      branche: result.branche,
    };
    const newToken = await this.service.generateAccessToken(payload);
    const newRefreshToken = await this.service.generateRefreshToken(payload);

    const MINUTE_EXPIRATION = 15 * 60;
    const DAYS_EXPIRATION = 7 * 24 * 60 * 60;

    reply.setCookie('access_token', newToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: MINUTE_EXPIRATION,
    });

    reply.setCookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: DAYS_EXPIRATION,
    });
    return { status: 'ok' };
  }
}
