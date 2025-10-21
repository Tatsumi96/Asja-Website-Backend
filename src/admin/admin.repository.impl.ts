import { failure, Result, success } from '@/core/Result';
import { Injectable } from '@nestjs/common';
import { AdminDto } from './admin.dto';
import { AdminPrismaService } from './admin.prisma.service';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminRepositoryImpl implements AdminRepository {
  constructor(private service: AdminPrismaService) {}

  async getData(userId: number): Promise<Result<AdminDto>> {
    try {
      const result = await this.service.get(userId);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
