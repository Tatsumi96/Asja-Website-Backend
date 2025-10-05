import { failure, Result, success } from '@/core/Result';
import { MentionPrismaService } from './mention.service.prisma';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { MentionRepository } from './mention.repository';
import { MentionDto } from './mention.dto';

@Injectable()
export class MentionRepositoryImpl implements MentionRepository {
  constructor(private service: MentionPrismaService) {}

  async getData(): Promise<Result<MentionDto>> {
    try {
      const result = await this.service.get();
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
