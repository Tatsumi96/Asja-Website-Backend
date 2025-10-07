import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';

import {
  MentionPrismaService,
  MentionPrismaServiceImpl,
} from './mention.service.prisma';
import { MentionRepository } from './mention.repository';
import { MentionRepositoryImpl } from './mention.repositoryImpl';
import { MentionService } from './mention.service';
import { MentionController } from './mention.controller';
import { FileRepository } from './fileRepository';
import { FileRepositoryImpl } from './file_repositoryImpl';

@Module({
  imports: [PrismaModule],
  controllers: [MentionController],
  providers: [
    MentionService,
    { provide: MentionRepository, useClass: MentionRepositoryImpl },
    { provide: MentionPrismaService, useClass: MentionPrismaServiceImpl },
    { provide: FileRepository, useClass: FileRepositoryImpl },
  ],
})
export class MentionModule {}
