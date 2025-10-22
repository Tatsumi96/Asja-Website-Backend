import { failure, Result, success } from '@/core/Result';
import { AuthRepository } from './auth.repository';
import { LoginDto, LoginReturnType } from './login.dto';
import { AuthPrismaService } from './aut.service.prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private service: AuthPrismaService) {}

  async signIn(login: LoginDto): Promise<Result<LoginReturnType>> {
    try {
      console.log(login);
      const result = await this.service.signIn(login);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
