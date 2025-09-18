import { PrismaService } from '@/prisma/prisma.service';
import { DocEntity } from './doc.entity';

import { Injectable } from '@nestjs/common';

export abstract class DocPrismaService {
  abstract save(doc: DocEntity): Promise<void>;
}

@Injectable()
export class DocPrismaServiceImpl implements DocPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async save(doc: DocEntity): Promise<void> {
    try {
      await this.prisma.document.create({
        data: {
          FileName: doc.fileName,
          Mention: doc.mention,
          Niveau: doc.level,
          teacherId: doc.authorId,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}
