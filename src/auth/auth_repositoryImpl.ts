import { failure, Result, success } from '@/core/Result';
import { AuthRepository } from './Auth_repository';
import { LoginDto } from './login_Dto';
import { AuthPrismaService } from './Auth_Prisma_Repository';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private service: AuthPrismaService) {}

  async signIn(login: LoginDto): Promise<Result<LoginDto>> {
    try {
      const result = await this.service.signIn(login);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async register(user: UserEntity): Promise<Result<void>> {
    try {
      await this.service.register(user);
      return success(undefined);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
