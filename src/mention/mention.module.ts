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

import { FileModule } from '@/file/file.module';

@Module({
  imports: [PrismaModule, FileModule.forFeature('./student_pictures/')],
  controllers: [MentionController],
  providers: [
    MentionService,
    { provide: MentionRepository, useClass: MentionRepositoryImpl },
    { provide: MentionPrismaService, useClass: MentionPrismaServiceImpl },
  ],
})
export class MentionModule {}
