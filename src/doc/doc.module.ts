import { Module } from '@nestjs/common';
import { DocController } from './doc.controller';
import { DocService } from './doc.service';
import { DocRepository } from './doc.repository';
import { DocRepositoryImpl } from './doc.repositoryImpl';
import { PrismaModule } from '@/prisma/prisma.module';
import { DocPrismaService, DocPrismaServiceImpl } from './doc_prisma_service';
import { FileRepository } from './fileRepository';
import { FileRepositoryImpl } from './file_repositoryImpl';

@Module({
  imports: [PrismaModule],
  controllers: [DocController],
  providers: [
    DocService,
    { provide: DocRepository, useClass: DocRepositoryImpl },
    { provide: DocPrismaService, useClass: DocPrismaServiceImpl },
    { provide: FileRepository, useClass: FileRepositoryImpl },
  ],
})
export class DocModule {}
