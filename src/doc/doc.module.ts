import { Module } from '@nestjs/common';
import { DocController } from './doc.controller';
import { DocService } from './doc.service';
import { DocRepository } from './doc.repository';
import { DocPrismaRepository } from './doc.repositoryImpl';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocController],
  providers: [
    DocService,
    { provide: DocRepository, useClass: DocPrismaRepository },
  ],
})
export class DocModule {}
