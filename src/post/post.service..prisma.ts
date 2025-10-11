import { GetPostInputType, PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PostDto } from './post.dto';

export abstract class PostPrismaService {
  abstract create(post: PostEntity): Promise<void>;
  abstract get(params: GetPostInputType): Promise<PostDto[]>;
}

@Injectable()
export class PostPrismaServiceImpl implements PostPrismaService {
  constructor(private prisma: PrismaService) {}

  async create(post: PostEntity): Promise<void> {
    try {
      await this.prisma.post.create({
        data: {
          Mention: post.mention ?? 'ASJA',
          Titre: post.title,
          Niveau: post.level,
          Branche: post.branche,
          Description: post.description,
          ...(post.fileName && {
            Fichier: post.fileName,
          }),
        },
      });
      return;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async get(params: GetPostInputType): Promise<PostDto[]> {
    try {
      const result = await this.prisma.post.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where: {
          OR: [
            {
              AND: [
                { Branche: params.branche ?? 'COMMUN' },
                { Mention: params.mention },
                { Niveau: params.level },
              ],
            },
            {
              Mention: 'ASJA',
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      const post: PostDto[] = result.map((item) => ({
        id: item.id,
        description: item.Description,
        imageUrl: item.Fichier as string,
        title: item.Titre as string,
        date: item.createdAt.toLocaleDateString('fr-FR'),
      })) as PostDto[];

      return post;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}
