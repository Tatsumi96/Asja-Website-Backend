import { Module } from '@nestjs/common';
import { DocController } from './doc.controller';
import { DocService } from './doc.service';
import { DocRepository } from './doc.repository';
import { DocRepositoryImpl } from './doc.repositoryImpl';
import { PrismaModule } from '@/prisma/prisma.module';
import { DocPrismaService, DocPrismaServiceImpl } from './doc.prisma.service';
import { FileModule } from '@/file/file.module';

@Module({
  imports: [PrismaModule, FileModule.forFeature('./files/')],
  controllers: [DocController],
  providers: [
    DocService,
    { provide: DocRepository, useClass: DocRepositoryImpl },
    { provide: DocPrismaService, useClass: DocPrismaServiceImpl },
  ],
})
export class DocModule {}
