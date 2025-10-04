import { failure, Result, success } from '@/core/Result';
import { UserDto } from './user.dto';
import { UserRepository } from './user.repository';
import { UserPrismaService } from './user_prisma_service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private service: UserPrismaService) {}

  async getData(userId: number): Promise<Result<UserDto>> {
    try {
      const result = await this.service.get(userId);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
