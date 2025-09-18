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
import { UserEntity } from './user.entity';

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

    const payload = { sub: result.data.identifier, role: result.data.role };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '5m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { status: 'Success', token };
  }

  async callRegister(user: UserEntity) {
    const hashPassword = await argon.hash(user.password);
    const userToInsert: UserEntity = { ...user, password: hashPassword };

    const result = await this.authRepo.register(userToInsert);

    if (result.status == 'failure') throw new BadRequestException();
    return { status: 'Success' };
  }
}
