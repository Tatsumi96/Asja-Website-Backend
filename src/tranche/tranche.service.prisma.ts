import { PrismaService } from '@/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { TrancheDto } from './tranche.dto';

export abstract class TranchePrismaService {
  abstract update(dto: TrancheDto): Promise<void>;
}

@Injectable()
export class TranchePrismaServiceImpl implements TranchePrismaService {
  constructor(private prisma: PrismaService) {}

  async update(dto: TrancheDto): Promise<void> {
    await this.prisma.tranche.update({
      where: { id: dto.id },
      data: {
        [dto.tranche]: dto.value,
      },
    });
  }
}
