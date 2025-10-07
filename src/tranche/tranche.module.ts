import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TrancheRepository } from './tranche.repository';
import { TrancheRepositoryImpl } from './tranche.repositoryImpl';
import {
  TranchePrismaService,
  TranchePrismaServiceImpl,
} from './tranche.service.prisma';
import { TrancheController } from './tranche.controller';
import { TrancheService } from './tranche.service';

@Module({
  imports: [PrismaModule],
  controllers: [TrancheController],
  providers: [
    TrancheService,
    { provide: TrancheRepository, useClass: TrancheRepositoryImpl },
    { provide: TranchePrismaService, useClass: TranchePrismaServiceImpl },
  ],
})
export class TrancheModule {}
