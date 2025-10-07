import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthRepository } from './Auth_repository';
import { LoginDto } from './login_Dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Branche, Level, Mention, Role } from '@/core/types';

@Injectable()
export class AuthService {
  constructor(
    private authRepo: AuthRepository,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async callSignIn(loginData: LoginDto) {
    const result = await this.authRepo.signIn(loginData);

    if (result.status == 'failure')
      throw new BadRequestException('Credential not found');

    const isPasswordMatch = await argon.verify(
      result.data.password,
      loginData.password,
    );

    if (!isPasswordMatch) throw new ForbiddenException('Password incorrect');

    const payload = {
      sub: result.data.identifier,
      role: result.data.role,
      mention: result.data.mention,
      level: result.data.level,
      branche: result.data.branche,
    };

    const token = await this.generateAccessToken(payload);
    return { status: 'Success', token, payload };
  }

  async generateAccessToken(payload: {
    sub: number;
    role: Role;
    mention: Mention | undefined;
    level: Level | undefined;
    branche: Branche;
  }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async generateRefreshToken(payload: {
    sub: number;
    role: Role;
    mention: Mention | undefined;
    level: Level | undefined;
    branche: Branche;
  }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async verifyToken(token: string): Promise<{
    sub: number;
    role: Role;
    mention: Mention | undefined;
    level: Level | undefined;
    branche: Branche;
  }> {
    return this.jwtService.decode(token);
  }
}
