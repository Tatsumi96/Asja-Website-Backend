import { PrismaService } from '@/prisma/prisma.service';
import { DocEntity } from './doc.entity';
import { getDocFileInputType } from './doc.repository';

import { Injectable } from '@nestjs/common';

export abstract class DocPrismaService {
  abstract save(doc: DocEntity): Promise<void>;
  abstract get(params: getDocFileInputType): Promise<DocEntity[]>;
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

  async get(params: getDocFileInputType): Promise<DocEntity[]> {
    try {
      const result = await this.prisma.document.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where: {
          AND: [{ Mention: params.mention }, { Niveau: params.level }],
        },
      });
      const docFile: DocEntity[] = result.map((item) => ({
        authorId: item.teacherId,
        fileName: item.FileName,
        level: item.Niveau,
        mention: item.Mention,
        id: item.id,
      }));

      return docFile;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}
