import { PrismaService } from '@/prisma/prisma.service';
import { DocEntity } from './doc.entity';
import { getDocFileInputType } from './doc.repository';

import { Injectable } from '@nestjs/common';
import { DocDto } from './doc.dto';
import { Branche, Level, Mention } from '@/core/types';

export abstract class DocPrismaService {
  abstract save(doc: DocEntity): Promise<{ id: string }>;
  abstract get(params: getDocFileInputType): Promise<DocDto[]>;
  abstract delete(id: string): Promise<void>;
}

@Injectable()
export class DocPrismaServiceImpl implements DocPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async save(doc: DocEntity): Promise<{ id: string }> {
    try {
      const result = await this.prisma.document.create({
        data: {
          Nom: doc.fileName,
          Titre: doc.lessonTitle,
          MegaByte: doc.fileSize,
          Professeur: '',
          Classe: {
            create: {
              Branche: doc.branche,
              Niveau: doc.level,
              Mention: doc.mention,
            },
          },
        },
      });
      return { id: result.id };
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
            ...(params.role == 'Student'
              ? {
                  where: {
                    AND: [
                      { Mention: params.mention },
                      { Niveau: params.level },
                      { Branche: params.branche },
                    ],
                  },
                }
              : {}),
          },
        },
      });
      const docFile: DocDto[] = result.map((item) => ({
        fileName: item.Nom,
        lessonTitle: item.Titre,
        id: item.id,
        mention: item.Classe?.Mention as Mention,
        level: item.Classe?.Niveau as Level,
        branche: item.Classe?.Branche as Branche,
      }));
      return docFile;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({
      where: { id },
    });
  }
}
