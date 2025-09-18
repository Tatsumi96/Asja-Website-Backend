import { FastifyReply } from 'fastify';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './login_Dto';
import { UserEntity } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signin')
  async callRegister(@Body() user: UserEntity) {
    return this.service.callRegister(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginData: LoginDto, @Res() reply: FastifyReply) {
    const { status, token } = await this.service.callSignIn(loginData);

    reply.setCookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60,
      domain: 'localhost',
    });

    return reply.send({ status, token });
  }
}
