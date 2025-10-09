import { failure, Result, success } from '@/core/Result';
import { MentionPrismaService } from './mention.service.prisma';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { MentionRepository } from './mention.repository';
import { MentionDto } from './mention.dto';
import { UserDto } from './user.dto';
import { RegisterReturnType } from './registerReturnType';

@Injectable()
export class MentionRepositoryImpl implements MentionRepository {
  constructor(private service: MentionPrismaService) {}

  async getMentionData(): Promise<Result<MentionDto>> {
    try {
      const result = await this.service.getMentionData();
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async register(user: UserEntity): Promise<Result<RegisterReturnType>> {
    try {
      const result = await this.service.register(user);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async getStudentData(
    page: number,
    limit: number,
  ): Promise<Result<UserDto[]>> {
    try {
      const result = await this.service.getStudentData(page, limit);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async deleteStudent(id: string): Promise<Result<void>> {
    try {
      await this.service.deleteStudent(id);
      return success(undefined);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async searchStudent(query: string): Promise<Result<UserDto[]>> {
    try {
      const result: any = await this.service.searchStudent(query);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
