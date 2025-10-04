import { failure, Result, success } from '@/core/Result';
import { AuthRepository } from './Auth_repository';
import { LoginDto, LoginReturnType } from './login_Dto';
import { AuthPrismaService } from './Auth_Prisma_Repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private service: AuthPrismaService) {}

  async signIn(login: LoginDto): Promise<Result<LoginReturnType>> {
    try {
      const result = await this.service.signIn(login);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
