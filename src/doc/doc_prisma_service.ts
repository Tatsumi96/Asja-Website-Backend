import { PrismaService } from '@/prisma/prisma.service';
import { DocEntity } from './doc.entity';
import { getDocFileInputType } from './doc.repository';

import { Injectable } from '@nestjs/common';
import { DocDto } from './docDto';

export abstract class DocPrismaService {
  abstract save(doc: DocEntity): Promise<void>;
  abstract get(params: getDocFileInputType): Promise<DocDto[]>;
}

@Injectable()
export class DocPrismaServiceImpl implements DocPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async save(doc: DocEntity): Promise<void> {
    try {
      await this.prisma.document.create({
        data: {
          Nom: doc.fileName,
          Titre: doc.lessonTitle,
          MegaByte: doc.fileSize,
          Professeur: doc.authorName,
          Classe: {
            create: {
              Branche: doc.branche,
              Niveau: doc.level,
              Mention: doc.mention,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async get(params: getDocFileInputType): Promise<DocDto[]> {
    try {
      const result = await this.prisma.document.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          Classe: {
            where: {
              AND: [
                { Mention: params.mention },
                { Niveau: params.level },
                { Branche: params.branche },
              ],
            },
          },
        },
      });
      const docFile: DocDto[] = result.map((item) => ({
        author: item.Professeur,
        fileName: item.Nom,
        lessonTitle: item.Titre,
        fileSize: item.MegaByte,
        id: item.id,
      }));
      return docFile;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}
