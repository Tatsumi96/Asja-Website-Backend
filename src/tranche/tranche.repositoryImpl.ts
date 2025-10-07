import { failure, Result, success } from '@/core/Result';
import { TrancheRepository } from './tranche.repository';
import { TranchePrismaService } from './tranche.service.prisma';
import { Injectable } from '@nestjs/common';
import { TrancheDto } from './tranche.dto';

@Injectable()
export class TrancheRepositoryImpl implements TrancheRepository {
  constructor(private service: TranchePrismaService) {}

  async update(dto: TrancheDto): Promise<Result<void>> {
    try {
      await this.service.update(dto);
      return success(undefined);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
