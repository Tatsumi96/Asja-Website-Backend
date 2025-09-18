import { failure, Result, success } from '@/core/Result';
import { DocEntity } from './doc.entity';
import { DocRepository } from './doc.repository';

import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DocPrismaRepository implements DocRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(doc: DocEntity): Promise<Result<void>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.prisma.document.create({
        data: {
          FileName: doc.fileName,
          Mention: doc.mention,
          Niveau: doc.level,
          teacherId: doc.authorId,
        },
      });

      return success(undefined);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
