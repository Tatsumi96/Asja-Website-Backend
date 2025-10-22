import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AdminDto } from './admin.dto';

export abstract class AdminPrismaService {
  abstract get(userId: number): Promise<AdminDto>;
}

@Injectable()
export class AdminPrismaServiceImpl implements AdminPrismaService {
  constructor(private prisma: PrismaService) {}

  async get(userId: number): Promise<AdminDto> {
    const result = await this.prisma.administrateur.findFirst({
      where: { identifiant: userId },
      select: { Nom: true, Prenom: true, filePictureName: true },
    });

    return {
      name: result?.Nom as string,
      lastName: result?.Prenom as string,
      imageUrl: result?.filePictureName as string,
    };
  }
}
